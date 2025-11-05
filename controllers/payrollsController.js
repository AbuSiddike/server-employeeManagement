import { ObjectId } from "mongodb";
import { getDB } from "../db/connect.js";

export async function getPayrolls(req, res) {
    try {
        const db = getDB();
        const payrolls = await db.collection("payrolls").find().toArray();
        res.json(payrolls);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch payrolls" });
    }
}

export async function addPayroll(req, res) {
    try {
        const db = getDB();
        const addPayroll = await db.collection("payrolls").insertOne(req.body);
        res.json(addPayroll);
    } catch (err) {
        res.status(500).json({ message: "Failed to add payroll" });
    }
}

export async function updatePayroll(req, res) {
    const { id } = req.params;
    try {
        const db = getDB();
        const updatePayroll = await db
            .collection("payrolls")
            .updateOne({ _id: new ObjectId(id) }, { $set: req.body });
        res.json(updatePayroll);
    } catch (err) {
        res.status(500).json({ message: "Failed to update payroll" });
    }
}

export async function deletePayroll(req, res) {
    const { id } = req.params;
    try {
        const db = getDB();
        const deletePayroll = await db
            .collection("payrolls")
            .deleteOne({ _id: new ObjectId(id) });
        res.json(deletePayroll);
    } catch (err) {
        res.status(500).json({ message: "Failed to delete payroll" });
    }
}
