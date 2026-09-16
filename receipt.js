const heading = document.getElementById("heading");
const status = document.getElementById("status");
const retry = document.getElementById("retry");
const section = document.getElementById("receipt");
const sessionId = new URLSearchParams(location.search).get("session_id");
const money = (cents) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
async function verify() {
  retry.hidden = true;
  section.hidden = true;
  if (!sessionId || !/^cs_live_[A-Za-z0-9]{20,240}$/.test(sessionId)) {
    heading.textContent = "Your payment receipt.";
    status.textContent =
      "After paying, use the receipt link from your Stripe confirmation. This page alone does not confirm a payment. Contact Lukaah if you need help finding your receipt.";
    return;
  }
  heading.textContent = "Checking your payment.";
  status.textContent = "Please wait while we verify your payment with Stripe.";
  const endpoint = "/api/receipt?session_id=" + encodeURIComponent(sessionId);
  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "no-referrer",
    });
    const data = await response.json();
    if (!response.ok || !data.verified)
      throw new Error(
        data.error || "Payment could not be verified. Please try again.",
      );
    const r = data.receipt;
    heading.textContent = r.refunded
      ? "Your payment receipt."
      : r.disputed
        ? "Payment under review."
        : "Payment received.";
    status.textContent = r.refunded
      ? "This payment has a refund. Your PDF includes the original payment and refund amounts."
      : r.disputed
        ? "Stripe reports a dispute on this payment. Your receipt includes its current status."
        : "Your payment is confirmed. Download a business receipt for your records.";
    for (const key of [
      "number",
      "customer",
      "method",
      "project",
      "description",
    ])
      document.getElementById(key).textContent = r[key];
    document.getElementById("balance-note").textContent = r.isDeposit
      ? "The receipt covers your deposit. The remaining $1,000 project balance is due at acceptance, before launch."
      : "Refer to your project agreement or invoice for any remaining balance.";
    document.getElementById("date").textContent = new Date(
      r.date,
    ).toLocaleString();
    document.getElementById("total").textContent = money(r.total);
    document.getElementById("refund-label").hidden = !r.refunded;
    document.getElementById("refunded").hidden = !r.refunded;
    document.getElementById("refunded").textContent = money(r.refunded);
    document.getElementById("download").href = endpoint + "&download=1";
    section.hidden = false;
  } catch (error) {
    heading.textContent = "Receipt not ready yet.";
    status.textContent =
      error.message === "Failed to fetch"
        ? "We could not reach the payment service. Please try again."
        : error.message;
    retry.hidden = false;
  }
}
retry.addEventListener("click", verify);
verify();
