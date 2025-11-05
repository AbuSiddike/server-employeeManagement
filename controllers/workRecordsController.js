import { ObjectId } from "mongodb";
import { getDB } from "../db/connect.js";

export async function getWorks(req, res) {
    try {
        const db = getDB();
        const works = await db.collection(work_records).find().toArray();
        res.json(works);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch work records",
            error: err,
        });
    }
}

export async function addWork(req, res) {
    try {
        const db = getDB();
        const newWork = await db.collection("work_records").insertOne(req.body);
        res.json(newWork);
    } catch (err) {
        res.status(500).json({
            message: "Failed to add Work record",
            error: err,
        });
    }
}

export async function updateWork(req, res) {
    const { id } = req.params;
    try {
        const db = getDB();
        const updateWork = await db
            .collection("work_records")
            .updateOne({ _id: new ObjectId(id) }, { $set: req.body });
        res.json(updateWork);
    } catch (err) {
        res.status(500).json({
            message: "Failed to update work record",
            error: err,
        });
    }
}

export async function deleteWork(req, res) {
    const { id } = req.params;
    try {
        const db = getDB();
        const deleteWork = await db
            .collection("work_records")
            .deleteOne({ _id: new ObjectId(id) });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete work record",
            error: err,
        });
    }
}
