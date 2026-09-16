import Stripe from "stripe";
import { readFile } from "node:fs/promises";
import { verifiedReceipt, receiptPdf, ReceiptError } from "../lib/receipt.js";
import { sendReceiptEmail } from "../lib/email.js";

export const config = { api: { bodyParser: false } };

async function rawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export function makeStripeWebhookHandler({
  getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY),
  sendEmail = sendReceiptEmail,
  getAgreement = () =>
    readFile(
      new URL("../assets/documents/ritual-fitness-agreement.pdf", import.meta.url),
    ),
} = {}) {
  return async function handler(req, res) {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).send("Method not allowed");
    }
    const signature = req.headers["stripe-signature"];
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY)
      return res.status(400).send("Webhook is not configured.");
    let event;
    try {
      event = getStripe().webhooks.constructEvent(
        await rawBody(req),
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch {
      return res.status(400).send("Invalid Stripe signature.");
    }
    if (event.type !== "checkout.session.completed") return res.status(200).json({ received: true });

    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
        expand: ["line_items", "payment_intent.latest_charge"],
      });
      if (session.metadata?.receipt_email_sent_at)
        return res.status(200).json({ received: true, alreadySent: true });
      const receipt = verifiedReceipt(session);
      await sendEmail({
        receipt,
        receiptPdf: await receiptPdf(receipt),
        agreementPdf: await getAgreement(),
      });
      await stripe.checkout.sessions.update(session.id, {
        metadata: {
          ...session.metadata,
          receipt_email_sent_at: new Date().toISOString(),
        },
      });
      return res.status(200).json({ received: true });
    } catch (error) {
      if (error instanceof ReceiptError) return res.status(200).json({ received: true });
      return res.status(500).send("Receipt email could not be sent.");
    }
  };
}

export default makeStripeWebhookHandler();
