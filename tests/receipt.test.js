import test from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import { verifiedReceipt, receiptPdf, DEPOSIT_PRICE } from "../lib/receipt.js";
import { sendReceiptEmail } from "../lib/email.js";
import { makeReceiptHandler } from "../api/receipt.js";
const id = "cs_live_123456789012345678901234";
export function fixture() {
  return {
    livemode: true,
    mode: "payment",
    currency: "usd",
    status: "complete",
    payment_status: "paid",
    amount_total: 104250,
    amount_subtotal: 100000,
    total_details: { amount_tax: 4250 },
    line_items: {
      has_more: false,
      data: [{ price: { id: DEPOSIT_PRICE }, quantity: 1 }],
    },
    customer_details: { name: "Sample Customer", email: "sample@example.com" },
    payment_intent: {
      status: "succeeded",
      latest_charge: {
        id: "ch_SAMPLE_NOT_A_PAYMENT",
        receipt_number: "SAMPLE-0001",
        status: "succeeded",
        paid: true,
        amount: 104250,
        amount_captured: 104250,
        amount_refunded: 0,
        currency: "usd",
        created: 1789488000,
        payment_method_details: { card: { brand: "visa", last4: "4242" } },
      },
    },
  };
}
test("receipt uses Stripe amounts, tax, customer, and transaction date", () => {
  const r = verifiedReceipt(fixture());
  assert.equal(r.total, 104250);
  assert.equal(r.tax, 4250);
  assert.equal(r.customer, "Sample Customer");
  assert.equal(r.method, "VISA ending 4242");
});
test("rejects unpaid, processing, test mode, wrong product, and partial captures", () => {
  for (const mutate of [
    (s) => (s.payment_status = "unpaid"),
    (s) => (s.status = "open"),
    (s) => (s.payment_intent.status = "processing"),
    (s) => (s.payment_intent.latest_charge.paid = false),
    (s) => (s.payment_intent.latest_charge.amount_captured = 500),
    (s) => (s.livemode = false),
    (s) => (s.line_items.data[0].price.id = "wrong"),
    (s) => (s.line_items.data[0].quantity = 2),
    (s) => (s.currency = "eur"),
    (s) => (s.amount_total = 1),
  ]) {
    const s = fixture();
    mutate(s);
    assert.throws(() => verifiedReceipt(s));
  }
});
test("refunds and disputes retain correct current payment status", () => {
  const s = fixture();
  s.payment_intent.latest_charge.amount_refunded = 20000;
  s.payment_intent.latest_charge.disputed = true;
  const r = verifiedReceipt(s);
  assert.equal(r.refunded, 20000);
  assert.equal(r.disputed, true);
});
test("PDF is one page and tolerates long or Unicode customer fields", async () => {
  const r = verifiedReceipt(fixture());
  r.customer = "张伟 — Élodie ".repeat(30);
  r.email = "long".repeat(100) + "@example.com";
  const pdf = await PDFDocument.load(await receiptPdf(r, { sample: true }));
  assert.equal(pdf.getPageCount(), 1);
  assert.match(pdf.getTitle(), /SAMPLE/);
});
function response() {
  return {
    headers: {},
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(v) {
      this.code = v;
      return this;
    },
    json(v) {
      this.body = v;
      return this;
    },
    send(v) {
      this.body = v;
      return this;
    },
  };
}
test("endpoint validates before contacting Stripe and never caches responses", async () => {
  let called = false;
  const handler = makeReceiptHandler(() => {
    called = true;
    throw Error();
  });
  const res = response();
  await handler({ method: "GET", query: { session_id: "invented" } }, res);
  assert.equal(res.code, 400);
  assert.equal(called, false);
  assert.match(res.headers["Cache-Control"], /no-store/);
});
test("endpoint requires credentials and hides raw errors", async () => {
  const prev = process.env.STRIPE_RECEIPT_KEY,
    prevSecret = process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_RECEIPT_KEY;
  delete process.env.STRIPE_SECRET_KEY;
  try {
    const handler = makeReceiptHandler(() => {
      throw new Error("secret detail");
    });
    let res = response();
    await handler({ method: "GET", query: { session_id: id } }, res);
    assert.equal(res.code, 503);
    process.env.STRIPE_RECEIPT_KEY = "test-only";
    res = response();
    await handler({ method: "GET", query: { session_id: id } }, res);
    assert.equal(res.code, 503);
    assert.ok(!JSON.stringify(res.body).includes("secret detail"));
  } finally {
    if (prev === undefined) delete process.env.STRIPE_RECEIPT_KEY;
    else process.env.STRIPE_RECEIPT_KEY = prev;
    if (prevSecret === undefined) delete process.env.STRIPE_SECRET_KEY;
    else process.env.STRIPE_SECRET_KEY = prevSecret;
  }
});
test("verified endpoint provides JSON and a downloadable PDF", async () => {
  const prev = process.env.STRIPE_RECEIPT_KEY;
  process.env.STRIPE_RECEIPT_KEY = "test-only";
  try {
    const handler = makeReceiptHandler(() => ({
      checkout: { sessions: { retrieve: async () => fixture() } },
    }));
    for (const download of [undefined, "1"]) {
      const res = response();
      await handler(
        { method: "GET", query: { session_id: id, download } },
        res,
      );
      assert.equal(res.code, 200);
      if (download) {
        assert.match(res.headers["Content-Disposition"], /attachment/);
        assert.ok(Buffer.isBuffer(res.body));
      } else assert.equal(res.body.verified, true);
    }
  } finally {
    if (prev === undefined) delete process.env.STRIPE_RECEIPT_KEY;
    else process.env.STRIPE_RECEIPT_KEY = prev;
  }
});
test("email delivery addresses the Stripe customer and includes both PDFs", async () => {
  const previousKey = process.env.RESEND_API_KEY;
  const previousFrom = process.env.RECEIPT_FROM_EMAIL;
  process.env.RESEND_API_KEY = "re_test";
  process.env.RECEIPT_FROM_EMAIL = "receipts@lukaah.com";
  let sent;
  try {
    await sendReceiptEmail(
      {
        receipt: verifiedReceipt(fixture()),
        receiptPdf: Buffer.from("receipt"),
        agreementPdf: Buffer.from("agreement"),
      },
      {
        fetcher: async (_url, options) => {
          sent = JSON.parse(options.body);
          return { ok: true };
        },
      },
    );
    assert.deepEqual(sent.to, ["sample@example.com"]);
    assert.equal(sent.attachments.length, 2);
    assert.match(sent.subject, /Ritual Fitness Hawaii/);
  } finally {
    if (previousKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousKey;
    if (previousFrom === undefined) delete process.env.RECEIPT_FROM_EMAIL;
    else process.env.RECEIPT_FROM_EMAIL = previousFrom;
  }
});
