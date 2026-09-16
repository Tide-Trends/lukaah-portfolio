import Stripe from "stripe";
import { verifiedReceipt, receiptPdf, ReceiptError } from "../lib/receipt.js";

export function makeReceiptHandler(
  getStripe = () =>
    new Stripe(process.env.STRIPE_RECEIPT_KEY || process.env.STRIPE_SECRET_KEY),
) {
  return async function handler(req, res) {
    res.setHeader("Cache-Control", "private, no-store, max-age=0");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ error: "Method not allowed" });
    }
    const sessionId = req.query?.session_id;
    if (
      typeof sessionId !== "string" ||
      !/^cs_live_[A-Za-z0-9]{20,240}$/.test(sessionId)
    ) {
      return res
        .status(400)
        .json({
          error: "Open the receipt link provided after your Stripe payment.",
        });
    }
    if (!process.env.STRIPE_RECEIPT_KEY && !process.env.STRIPE_SECRET_KEY) {
      return res
        .status(503)
        .json({
          error:
            "Receipt verification is not available yet. Contact hello@lukaah.com for a receipt. Please do not pay again.",
        });
    }
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId, {
        expand: ["line_items", "payment_intent.latest_charge"],
      });
      const receipt = verifiedReceipt(session);
      if (req.query.download === "1") {
        const bytes = await receiptPdf(receipt);
        const filename = `Lukaah-receipt-${receipt.transaction.replace(/[^A-Za-z0-9_-]/g, "")}.pdf`;
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`,
        );
        return res.status(200).send(Buffer.from(bytes));
      }
      return res.status(200).json({ verified: true, receipt });
    } catch (error) {
      if (error instanceof ReceiptError)
        return res.status(error.status).json({ error: error.message });
      if (error.code === "resource_missing")
        return res
          .status(404)
          .json({
            error:
              "We could not find this payment. Please check your receipt link.",
          });
      return res
        .status(503)
        .json({
          error:
            "We could not verify the payment right now. Try again shortly or contact hello@lukaah.com. Please do not pay again.",
        });
    }
  };
}
export default makeReceiptHandler();
