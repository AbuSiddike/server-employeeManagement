import express from "express";
import {
    getMessages,
    addMessage,
    deleteMessage,
} from "../controllers/contactMessagesController.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();

// Any user can send a message
router.post("/", addMessage);

// ADMIN & HR can view all contact messages
router.get("/", verifyJwt, verifyRole("admin", "hr"), getMessages);

// ADMIN can delete messages
router.delete("/:id", verifyJwt, verifyRole("admin"), deleteMessage);

export default router;
