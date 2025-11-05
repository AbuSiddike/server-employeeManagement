import { ObjectId } from "mongodb";
import { getDB } from "../db/connect.js";

export async function getMessages(req, res) {
    try {
        const db = getDB();
        const messages = await db
            .collection("contact_messages")
            .find()
            .toArray();
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch messages" });
    }
}

export async function addMessage(req, res) {
    try {
        const db = getDB();
        const addMessage = await db
            .collection("contact_messages")
            .insertOne(req.body);
        res.json(addMessage);
    } catch (err) {
        res.status(500).json({ message: "Failed to add message" });
    }
}

export async function deleteMessage(req, res) {
    const { id } = req.params;
    try {
        const db = getDB();
        const deleteMessage = await db
            .collection("contact_messages")
            .deleteOne({ _id: new ObjectId(id) });
        res.json(deleteMessage);
    } catch (err) {
        res.status(500).json({ message: "Failed to delete message" });
    }
}
