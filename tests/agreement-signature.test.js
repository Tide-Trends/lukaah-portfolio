import test from "node:test";
import assert from "node:assert/strict";
import { makeAgreementSignatureHandler } from "../api/agreement-signature.js";

function response() {
  return {
    headers: {},
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
    end() { return this; },
  };
}

test("sends the signed agreement record to the owner with the agreement attached", async () => {
  const oldKey = process.env.RESEND_API_KEY;
  const oldFrom = process.env.SIGNATURE_FROM_EMAIL;
  process.env.RESEND_API_KEY = "re_test";
  process.env.SIGNATURE_FROM_EMAIL = "records@lukaah.com";
  let message;
  try {
    const handler = makeAgreementSignatureHandler({
      loadAgreement: async () => Buffer.from("agreement PDF"),
      now: () => new Date("2026-09-16T18:30:00.000Z"),
      recordId: () => "RFH-test-record",
      fetcher: async (_url, options) => {
        message = JSON.parse(options.body);
        return { ok: true };
      },
    });
    const res = response();
    await handler({
      method: "POST",
      headers: { "x-forwarded-for": "203.0.113.2", "user-agent": "Test Browser" },
      body: { accepted: true, name: "Ashley Burnett", email: "ashley@example.com" },
    }, res);
    assert.equal(res.code, 201);
    assert.equal(res.body.recordId, "RFH-test-record");
    assert.deepEqual(message.to, ["hello@lukaah.com"]);
    assert.equal(message.reply_to, "ashley@example.com");
    assert.equal(message.attachments[0].filename, "Ritual-Fitness-Hawaii-Website-Agreement.pdf");
  } finally {
    if (oldKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = oldKey;
    if (oldFrom === undefined) delete process.env.SIGNATURE_FROM_EMAIL;
    else process.env.SIGNATURE_FROM_EMAIL = oldFrom;
  }
});

test("does not send a record without Ashley's accepted declaration", async () => {
  const oldKey = process.env.RESEND_API_KEY;
  const oldFrom = process.env.SIGNATURE_FROM_EMAIL;
  process.env.RESEND_API_KEY = "re_test";
  process.env.SIGNATURE_FROM_EMAIL = "records@lukaah.com";
  try {
    let called = false;
    const handler = makeAgreementSignatureHandler({ fetcher: async () => { called = true; } });
    const res = response();
    await handler({ method: "POST", headers: {}, body: { accepted: false, name: "Ashley Burnett", email: "ashley@example.com" } }, res);
    assert.equal(res.code, 400);
    assert.equal(called, false);
  } finally {
    if (oldKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = oldKey;
    if (oldFrom === undefined) delete process.env.SIGNATURE_FROM_EMAIL;
    else process.env.SIGNATURE_FROM_EMAIL = oldFrom;
  }
});
