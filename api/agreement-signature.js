import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";

const agreementPath = new URL(
  "../assets/documents/ritual-fitness-agreement.pdf",
  import.meta.url,
);
const escape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

function dataFrom(req) {
  if (typeof req.body === "string") return JSON.parse(req.body);
  return req.body || {};
}

export function makeAgreementSignatureHandler({
  fetcher = fetch,
  loadAgreement = () => readFile(agreementPath),
  now = () => new Date(),
  recordId = () => `RFH-${randomUUID()}`,
} = {}) {
  return async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Cache-Control", "no-store");
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST, OPTIONS");
      return res.status(405).json({ error: "Method not allowed" });
    }
    if (!process.env.RESEND_API_KEY || !process.env.SIGNATURE_FROM_EMAIL) {
      return res.status(503).json({
        error: "Agreement records are not available yet. Please contact Lukaah before paying.",
      });
    }

    let body;
    try {
      body = dataFrom(req);
    } catch {
      return res.status(400).json({ error: "Invalid agreement record." });
    }
    const name = String(body.name || "").trim().replace(/\s+/g, " ");
    const email = String(body.email || "").trim().toLowerCase();
    if (!body.accepted || !/^ashley burnett$/i.test(name))
      return res.status(400).json({ error: "Enter Ashley Burnett’s full name and accept the agreement." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ error: "Enter a valid email address." });

    const agreement = await loadAgreement();
    const signedAt = now().toISOString();
    const id = recordId();
    const sourceIp = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "Unavailable";
    const userAgent = String(req.headers["user-agent"] || "Unavailable").slice(0, 500);
    const agreementHash = createHash("sha256").update(agreement).digest("hex");
    const response = await fetcher("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.SIGNATURE_FROM_EMAIL,
        to: [process.env.SIGNATURE_RECORD_EMAIL || "hello@lukaah.com"],
        reply_to: email,
        subject: `Agreement record ${id} — Ritual Fitness Hawaii`,
        html: `<h2>Agreement acceptance record</h2>
          <p>This is an acceptance record created before Stripe checkout. It is not payment confirmation.</p>
          <table><tr><td><strong>Record</strong></td><td>${escape(id)}</td></tr>
          <tr><td><strong>Client</strong></td><td>${escape(name)}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escape(email)}</td></tr>
          <tr><td><strong>Accepted at</strong></td><td>${escape(signedAt)}</td></tr>
          <tr><td><strong>Agreement</strong></td><td>Ritual Fitness Hawaii Website Agreement v2</td></tr>
          <tr><td><strong>Agreement SHA-256</strong></td><td>${agreementHash}</td></tr>
          <tr><td><strong>IP address</strong></td><td>${escape(sourceIp)}</td></tr>
          <tr><td><strong>Browser</strong></td><td>${escape(userAgent)}</td></tr></table>
          <p>Client declaration: “I am Ashley Burnett. I have read this Agreement. I agree to its terms. Pay $1,000.00 to start.”</p>
          <p>The attached PDF is the agreement presented at acceptance.</p>`,
        attachments: [
          {
            filename: "Ritual-Fitness-Hawaii-Website-Agreement.pdf",
            content: Buffer.from(agreement).toString("base64"),
          },
        ],
      }),
    });
    if (!response.ok)
      return res.status(502).json({ error: "Could not save the agreement record. Please try again." });
    return res.status(201).json({ recordId: id, signedAt });
  };
}

export default makeAgreementSignatureHandler();
