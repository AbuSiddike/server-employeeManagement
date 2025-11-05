import { getDB } from "../db/connect.js";

export async function getUsers(req, res) {
    try {
        const db = getDB();
        const users = await db.collection("users").find().toArray();
        res.json(users);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch users",
        });
    }
}

export async function getUserByEmail(req, res) {
    const { email } = req.params;
    try {
        const db = getDB();
        const user = await db.collection("users").findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch user",
        });
    }
}

export async function addUser(req, res) {
    try {
        const db = getDB();
        const newUser = await db.collection("users").insertOne(req.body);
        res.json(newUser);
    } catch (err) {
        res.status(500).json({
            message: "Failed to add user",
        });
    }
}

export async function updateUser(req, res) {
    const { email } = req.params;
    try {
        const db = getDB();
        const updateUser = await db
            .collection("users")
            .updateOne({ email }, { $set: req.body });
        res.json(updateUser);
    } catch (err) {
        res.status(500).json({
            message: "Failed to update user",
        });
    }
}

export async function deleteUser(req, res) {
    const { email } = req.params;
    try {
        const db = getDB();
        const deleteUser = await db.collection("users").deleteOne({ email });
        res.json(deleteUser);
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete user",
        });
    }
}
