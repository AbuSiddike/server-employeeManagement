import { stripe } from "../utils/stripe.js";
import { getDB } from "../db/connect.js";
import Stripe from "stripe";

// Create checkout session
export async function createCheckoutSession(req, res) {
  try {
    const db = getDB();
    const { payrollId, amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Employee Salary Payment",
              description: `Payroll ID: ${payrollId}`
            },
            unit_amount: amount * 100
          },
          quantity: 1
        }
      ],
      metadata: {
        payrollId,
        payerEmail: req.user.email
      }
    });

    res.json({ url: session.url });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Stripe session failed", error: err });
  }
}

// Webhook (Stripe → backend)
export async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const payrollId = session.metadata.payrollId;

    const db = getDB();
    await db.collection("payrolls").updateOne(
      { _id: new ObjectId(payrollId) },
      { $set: { status: "paid" } }
    );
  }

  res.json({ received: true });
}