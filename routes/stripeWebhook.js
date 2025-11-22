import express from "express";
import { handleStripeWebhook } from "../controllers/stripeWebhookController.js";

const router = express.Router();

// Stripe Webhook: MUST use express.raw()
router.post(
    "/",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
);

export default router;
