import bcrypt from "bcrypt";
import { getDB } from "../db/connect.js";
import { generateToken } from "../utils/jwt.js";

export async function registerUser(req, res) {
    try {
        const db = getDB();
        const { name, email, password, role } = req.body;

        const existing = await db.collection("users").findOne({ email });
        if (existing)
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            name,
            email,
            password: hashedPassword,
            role: role || "employee",
            createdAt: new Date(),
        };

        await db.collection("users").insertOne(user);

        const token = generateToken(user);
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({
            message: "Registration failed",
            error: err.message,
        });
    }
}

export async function loginUser(req, res) {
    try {
        const db = getDB();
        const { email, password } = req.body;

        const user = await db.collection("users").findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });

        const token = generateToken(user);
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
}
