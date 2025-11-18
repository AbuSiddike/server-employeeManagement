import { ObjectId } from "mongodb";
import { getDB } from "../db/connect.js";

// Any user can send a message
export async function addMessage(req, res) {
    try {
        const db = getDB();

        const newMessage = {
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message,
            createdAt: new Date(),
        };

        const result = await db
            .collection("contact_messages")
            .insertOne(newMessage);
        res.json({ success: true, insertedId: result.insertedId });
    } catch (err) {
        res.status(500).json({ message: "Failed to add message", error: err });
    }
}

// ADMIN & HR can fetch all contact messages
export async function getMessages(req, res) {
    try {
        const db = getDB();

        const messages = await db
            .collection("contact_messages")
            .find()
            .sort({ createdAt: -1 })
            .toArray();

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: "Failed to get messages", error: err });
    }
}

// ADMIN can delete a message
export async function deleteMessage(req, res) {
    try {
        const db = getDB();
        const id = req.params.id;

        const result = await db
            .collection("contact_messages")
            .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.json({ success: true, message: "Message deleted" });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete message",
            error: err,
        });
    }
}
