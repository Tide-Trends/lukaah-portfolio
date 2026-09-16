const escape = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const money = (cents) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );

export async function sendReceiptEmail(
  { receipt, receiptPdf, agreementPdf },
  { fetcher = fetch } = {},
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RECEIPT_FROM_EMAIL;
  if (!apiKey || !from)
    throw new Error("Email delivery has not been configured.");
  if (!receipt.email) throw new Error("Stripe did not provide a customer email.");

  const response = await fetcher("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [receipt.email],
      subject: `Your Ritual Fitness Hawaii payment receipt`,
      html: `<p>Hi ${escape(receipt.customer)},</p>
        <p>Stripe confirmed your ${escape(receipt.project)} payment of <strong>${money(receipt.total)}</strong>.</p>
        <p>Your custom payment receipt and the Ritual Fitness Hawaii website agreement are attached.</p>
        <p>Receipt number: ${escape(receipt.number)}</p>
        <p>Lukaah<br><a href="https://lukaah.com">lukaah.com</a></p>`,
      attachments: [
        {
          filename: `Lukaah-receipt-${receipt.transaction.replace(/[^A-Za-z0-9_-]/g, "")}.pdf`,
          content: Buffer.from(receiptPdf).toString("base64"),
        },
        {
          filename: "Ritual-Fitness-Hawaii-Website-Agreement.pdf",
          content: Buffer.from(agreementPdf).toString("base64"),
        },
      ],
    }),
  });
  if (!response.ok) throw new Error("Email provider did not accept the receipt.");
}
