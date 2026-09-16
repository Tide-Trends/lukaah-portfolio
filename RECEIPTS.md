# Lukaah payment receipts

The agreement uses Stripe's existing live $1,000 deposit Payment Link. It does not enable Stripe Invoicing or invoice PDF fees.

## Production connection

1. In this Vercel project's **Production** environment variables, add `STRIPE_SECRET_KEY`: a live key for the same LUKAAH.COM Stripe account with access to Checkout Sessions, PaymentIntents, and Charges. This also activates the existing invoice checkout API.
2. In Stripe, edit the **Ritual Fitness Contract + First Payment** Payment Link. Under **After payment**, choose website redirect and set exactly:

   `https://lukaah.com/success.html?session_id={CHECKOUT_SESSION_ID}`

   Leave **Create an invoice PDF** off. Stripe's ordinary processing fees still apply; this site's PDF generation does not use Stripe Invoicing.
3. To email the customer automatically, create a Resend account, verify the sender domain, then add `RESEND_API_KEY` and `RECEIPT_FROM_EMAIL` (for example, `receipts@lukaah.com`) to Vercel Production.
4. In Stripe Workbench, add a webhook endpoint at `https://lukaah.com/api/stripe-webhook`, select the `checkout.session.completed` event, then add its `STRIPE_WEBHOOK_SECRET` to Vercel Production. The webhook verifies the Stripe signature before generating a receipt. It emails the address collected by Stripe with both the custom receipt PDF and the exact agreement PDF attached.
5. Redeploy Vercel after adding the environment variables and webhook.
6. Verify a real completed deposit's return page shows the Stripe-confirmed amount and downloads the receipt. Do not run an unnecessary live payment solely as a test.

The receipt API rejects unpaid or pending payments, test-mode sessions, unrelated sessions, and partially captured payments. It accepts the exact Ritual Fitness deposit price or a session created by this site's invoice checkout API. Responses are private and not cached. Each request rechecks Stripe so refunded and disputed payments are reflected when a receipt is downloaded again.

The Checkout Session ID in the return link acts as a private access token. Do not publish paid customers' receipt links. The return page disables referrer transmission and search indexing, and contains no third-party resources.

Receipts state the project deposit separately from the total project fee. They use actual Stripe customer information, payment method, tax, discounts, amount paid, transaction reference, and refunds. A receipt does not independently preserve a legally signed copy of the agreement or prove who checked the agreement box. Keep the agreement revision and Stripe payment record together.

## Validation

Run `npm test`. Tests use synthetic transactions and do not contact Stripe or charge a card.
