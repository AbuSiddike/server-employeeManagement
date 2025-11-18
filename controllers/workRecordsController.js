import { ObjectId } from "mongodb";
import { getDB } from "../db/connect.js";

// ADMIN & HR get all work records
export async function getAllWorks(req, res) {
    try {
        const db = getDB();
        const works = await db.collection("work_records").find().toArray();
        res.json(works);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch work records",
            error: err,
        });
    }
}

// Employee get only OWN records
export async function getMyWorks(req, res) {
    try {
        const db = getDB();
        const email = req.user.email;

        const works = await db
            .collection("work_records")
            .find({ employeeEmail: email })
            .toArray();

        res.json(works);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch user work records" });
    }
}

// Employee create own work record
export async function addWork(req, res) {
    try {
        const db = getDB();

        const newRecord = {
            employeeEmail: req.user.email,
            task: req.body.task,
            description: req.body.description,
            hoursWorked: req.body.hoursWorked,
            date: new Date(req.body.date),
            project: req.body.project,
            createdAt: new Date(),
        };

        const result = await db.collection("work_records").insertOne(newRecord);
        res.json(result);
    } catch (err) {
        res.status(500).json({
            message: "Failed to add work record",
            error: err,
        });
    }
}

// Employee update only their own record
export async function updateWork(req, res) {
    try {
        const db = getDB();
        const id = req.params.id;
        const email = req.user.email;

        // make sure this record belongs to the employee
        const record = await db.collection("work_records").findOne({
            _id: new ObjectId(id),
        });

        if (!record)
            return res.status(404).json({ message: "Record not found" });

        if (record.employeeEmail !== email)
            return res
                .status(403)
                .json({ message: "Forbidden: not your work record" });

        const result = await db
            .collection("work_records")
            .updateOne({ _id: new ObjectId(id) }, { $set: req.body });

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: "Failed to update work record" });
    }
}

// Employee delete only their own record
export async function deleteWork(req, res) {
    try {
        const db = getDB();
        const id = req.params.id;
        const email = req.user.email;

        const record = await db.collection("work_records").findOne({
            _id: new ObjectId(id),
        });

        if (!record)
            return res.status(404).json({ message: "Record not found" });

        if (record.employeeEmail !== email)
            return res
                .status(403)
                .json({ message: "Forbidden: not your work record" });

        const result = await db.collection("work_records").deleteOne({
            _id: new ObjectId(id),
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: "Failed to delete work record" });
    }
}
