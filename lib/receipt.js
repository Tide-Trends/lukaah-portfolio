import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const DEPOSIT_PRICE = "price_1UG6REFMsJJmkcgLrt0hIG10";
export class ReceiptError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export function verifiedReceipt(session) {
  const item = session.line_items?.data?.[0];
  const isDeposit = item?.price?.id === DEPOSIT_PRICE;
  const isInvoice = session.metadata?.lukaah_checkout === "invoice_v1";
  if (
    (!isDeposit && !isInvoice) ||
    !session.livemode ||
    session.mode !== "payment" ||
    session.currency !== "usd" ||
    session.line_items?.has_more ||
    session.line_items?.data?.length !== 1 ||
    item?.quantity !== 1
  ) {
    throw new ReceiptError(
      404,
      "This payment does not match a supported Lukaah checkout.",
    );
  }
  const payment = session.payment_intent;
  const charge = payment?.latest_charge;
  if (
    session.status !== "complete" ||
    session.payment_status !== "paid" ||
    payment?.status !== "succeeded" ||
    !charge?.paid ||
    charge.status !== "succeeded"
  ) {
    throw new ReceiptError(
      409,
      "Stripe has not confirmed this payment yet. Please check again shortly.",
    );
  }
  if (
    charge.currency !== "usd" ||
    charge.amount !== session.amount_total ||
    charge.amount_captured !== charge.amount
  ) {
    throw new ReceiptError(
      409,
      "The payment is not fully captured. Please contact Lukaah for your receipt.",
    );
  }
  return {
    isDeposit,
    description: isDeposit
      ? "Website design & custom booking system"
      : item.description || "Agreed project payment",
    project: isDeposit
      ? "Ritual Fitness Hawaii"
      : session.metadata?.reference || "Lukaah project",
    number: charge.receipt_number || `LUK-${charge.id}`,
    transaction: charge.id,
    date: new Date(charge.created * 1000).toISOString(),
    customer:
      session.customer_details?.name ||
      (isDeposit ? "Ritual Fitness Hawaii" : "Customer"),
    email: session.customer_details?.email || "",
    subtotal: session.amount_subtotal,
    tax: session.total_details?.amount_tax || 0,
    discount: session.total_details?.amount_discount || 0,
    shipping: session.total_details?.amount_shipping || 0,
    total: charge.amount,
    refunded: charge.amount_refunded || 0,
    disputed: !!charge.disputed,
    method: charge.payment_method_details?.card
      ? `${charge.payment_method_details.card.brand.toUpperCase()} ending ${charge.payment_method_details.card.last4}`
      : "Stripe payment",
  };
}
const money = (cents) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
// Standard PDF fonts cannot encode every Unicode character. Normalize punctuation
// and replace unsupported glyphs, so a customer name can never break a receipt.
const clean = (s) =>
  String(s ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^\x20-\x7E\n]/g, "?");
export async function receiptPdf(data, { sample = false } = {}) {
  const doc = await PDFDocument.create();
  doc.setTitle(
    sample ? "SAMPLE - Not proof of payment" : `Lukaah receipt ${data.number}`,
  );
  doc.setAuthor("Lukaah");
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([612, 792]);
  const ink = rgb(0.08, 0.08, 0.07),
    muted = rgb(0.4, 0.4, 0.37),
    accent = rgb(0.76, 0.22, 0.15);
  const text = (
    value,
    x,
    y,
    size = 11,
    face = font,
    color = ink,
    max = 500,
  ) => {
    let valueText = clean(value).replace(/\n/g, " ");
    while (face.widthOfTextAtSize(valueText, size) > max && size > 8)
      size -= 0.5;
    if (face.widthOfTextAtSize(valueText, size) > max) {
      while (face.widthOfTextAtSize(valueText + "...", size) > max)
        valueText = valueText.slice(0, -1);
      valueText += "...";
    }
    page.drawText(valueText, { x, y, size, font: face, color });
  };
  const line = (y) =>
    page.drawLine({
      start: { x: 48, y },
      end: { x: 564, y },
      thickness: 0.7,
      color: rgb(0.8, 0.8, 0.76),
    });
  const right = (value, y, size = 11, face = font) => {
    const s = clean(value);
    text(s, 564 - face.widthOfTextAtSize(s, size), y, size, face);
  };
  text("LUKAAH", 48, 735, 28, bold);
  text("lukaah.com  /  hello@lukaah.com", 48, 714, 10, font, muted);
  right(sample ? "SAMPLE RECEIPT" : "PAYMENT RECEIPT", 737, 11, bold);
  right("USD", 718, 10, font);
  line(692);
  text(
    data.refunded
      ? data.refunded === data.total
        ? "REFUNDED"
        : "PARTIALLY REFUNDED"
      : data.disputed
        ? "PAYMENT DISPUTED"
        : "PAID",
    48,
    650,
    28,
    bold,
    accent,
  );
  text(`Receipt ${data.number}`, 48, 626, 10, font, muted);
  text("TRANSACTION DATE", 365, 658, 8, bold, muted);
  text(
    new Date(data.date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    }) + " UTC",
    365,
    641,
    10,
    font,
    ink,
    199,
  );
  text("BILL TO", 48, 578, 9, bold, muted);
  text(data.customer, 48, 558, 13, bold, ink, 290);
  text(data.project, 48, 539, 11, font, ink, 290);
  text(data.email, 48, 520, 10, font, muted, 290);
  text("PAYMENT METHOD", 365, 578, 9, bold, muted);
  text(data.method, 365, 558, 11, font, ink, 199);
  line(492);
  text("DESCRIPTION", 48, 472, 9, bold, muted);
  right("AMOUNT", 472, 9, bold);
  text(data.description, 48, 442, 12, bold, ink, 370);
  text(
    data.isDeposit ? "Ritual Fitness Hawaii - project deposit" : data.project,
    48,
    424,
    10,
    font,
    muted,
    370,
  );
  right(money(data.subtotal), 442, 12, bold);
  line(405);
  let y = 377;
  for (const [label, cents] of [
    ["Subtotal", data.subtotal],
    ["Discount", -data.discount],
    ["Tax", data.tax],
    ["Shipping", data.shipping],
  ]) {
    if ((label === "Discount" || label === "Shipping") && !cents) continue;
    text(label, 365, y, 11);
    right(money(cents), y);
    y -= 24;
  }
  line(y + 7);
  y -= 22;
  text("Amount paid", 365, y, 12, bold);
  right(money(data.total), y, 15, bold);
  if (data.refunded) {
    y -= 27;
    text("Refunded", 365, y, 11);
    right(money(data.refunded), y);
    y -= 24;
    text("Net payment", 365, y, 11, bold);
    right(money(data.total - data.refunded), y, 12, bold);
  }
  const noteY = Math.min(212, y - 45);
  text(data.isDeposit ? "PROJECT" : "PAYMENT NOTE", 48, noteY, 9, bold, muted);
  text(
    data.isDeposit
      ? "Project fee: $2,000.00. This receipt covers the deposit only."
      : "This receipt records the payment shown above.",
    48,
    noteY - 20,
    10,
  );
  text(
    data.isDeposit
      ? "The $1,000.00 project balance is due at acceptance, before launch."
      : "Refer to your project agreement or invoice for any remaining balance.",
    48,
    noteY - 37,
    10,
  );
  text("Transaction reference", 48, noteY - 79, 8, bold, muted);
  text(data.transaction, 48, noteY - 95, 9, font, muted);
  line(noteY - 116);
  text(
    sample
      ? "SAMPLE - NOT PROOF OF PAYMENT"
      : "Generated from Stripe-confirmed payment details. Keep this receipt for your records.",
    48,
    noteY - 136,
    9,
    sample ? bold : font,
    sample ? accent : muted,
  );
  text(
    "Receipt status reflects the transaction when this PDF was generated.",
    48,
    noteY - 152,
    8,
    font,
    muted,
  );
  return doc.save();
}
