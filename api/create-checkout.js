import Stripe from "stripe";

const PRICE_MAP = {
  discovery: "STRIPE_PRICE_DISCOVERY",
  project: "STRIPE_PRICE_PROJECT",
  retainer: "STRIPE_PRICE_RETAINER",
  default: "STRIPE_PRICE_ID",
};

const MIN_CENTS = 100;
const MAX_CENTS = 5_000_000;

function resolvePriceId(priceKey) {
  const envName = PRICE_MAP[priceKey] || PRICE_MAP.default;
  return process.env[envName] || process.env.STRIPE_PRICE_ID;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({
      error:
        "Online invoice payments are not available yet. Please use the payment link in your agreement or contact hello@lukaah.com.",
    });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  } catch {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const origin = "https://lukaah.com";
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    let lineItems;

    if (body.customAmount != null) {
      const cents = Math.round(Number(body.customAmount) * 100);
      if (!Number.isFinite(cents) || cents < MIN_CENTS || cents > MAX_CENTS) {
        return res.status(400).json({
          error: "Enter an amount between $1.00 and $50,000.00.",
        });
      }

      const reference = String(body.reference || "")
        .trim()
        .slice(0, 120);
      lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: reference
                ? `Payment — ${reference}`
                : "Agreed project payment",
              description: "Custom payment via lukaah.com",
            },
            unit_amount: cents,
          },
          quantity: 1,
        },
      ];
    } else {
      const priceId = resolvePriceId(body.priceKey || "default");
      if (!priceId) {
        return res.status(503).json({
          error:
            "This payment option is not available yet. Please contact hello@lukaah.com for your payment link.",
        });
      }
      lineItems = [{ price: priceId, quantity: 1 }];
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pay`,
      allow_promotion_codes: true,
      metadata: {
        lukaah_checkout: "invoice_v1",
        reference: String(body.reference || "")
          .trim()
          .slice(0, 120),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    return res
      .status(500)
      .json({
        error:
          "Checkout could not be opened. Please try again or contact hello@lukaah.com.",
      });
  }
}
