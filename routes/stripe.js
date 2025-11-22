import express from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import {
    createCheckoutSession,
    stripeWebhook,
} from "../controllers/stripeController.js";

const router = express.Router();

// Employee make payment
router.post(
    "/checkout-session",
    verifyJwt,
    verifyRole("employee"),
    createCheckoutSession
);

// Stripe webhook to handle payment events
router.post(
    "webhook",
    express.raw({ type: "application/json" }),
    stripeWebhook
);

export default router;
