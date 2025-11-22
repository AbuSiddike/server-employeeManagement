import { stripe } from "../utils/stripe.js";
import { getDB } from "../db/connect.js";
import { ObjectId } from "mongodb";

export async function handleStripeWebhook(req, res) {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        // Verify the webhook signature
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.log("Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const db = getDB();

    // Handle successful checkout
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const payrollId = session.metadata.payrollId;
        const email = session.metadata.payerEmail;

        // 1. Update payroll status
        await db
            .collection("payrolls")
            .updateOne(
                { _id: new ObjectId(payrollId) },
                { $set: { status: "paid" } }
            );

        // 2. Insert into payments collection
        await db.collection("payments").insertOne({
            payrollId,
            employeeEmail: email,
            amount: session.amount_total / 100,
            stripeSessionId: session.id,
            stripePaymentIntent: session.payment_intent,
            status: "success",
            createdAt: new Date(),
        });

        console.log("Payment success recorded.");
    }

    // Handle payment failed or expired
    if (
        event.type === "checkout.session.expired" ||
        event.type === "payment_intent.payment_failed"
    ) {
        const session = event.data.object;

        await db.collection("payments").insertOne({
            payrollId: session.metadata?.payrollId,
            employeeEmail: session.metadata?.payerEmail,
            amount: session.amount_total / 100,
            stripeSessionId: session.id,
            stripePaymentIntent: session.payment_intent,
            status: "failed",
            createdAt: new Date(),
        });

        console.log("Payment failed recorded.");
    }

    res.json({ received: true });
}
