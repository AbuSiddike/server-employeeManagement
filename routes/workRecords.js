import express from "express";
import {
    getAllWorks,
    getMyWorks,
    addWork,
    updateWork,
    deleteWork,
} from "../controllers/workRecordsController.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();

// ADMIN & HR can view all work records
router.get("/", verifyJwt, verifyRole("admin", "hr"), getAllWorks);

// Employee can view only their own work records
router.get("/my", verifyJwt, verifyRole("employee"), getMyWorks);

// Employee can create their new work record
router.post("/", verifyJwt, verifyRole("employee"), addWork);

// Employee can update only their own work record
router.patch("/:id", verifyJwt, verifyRole("employee"), updateWork);

// Employee can delete only their own work record
router.delete("/:id", verifyJwt, verifyRole("employee"), deleteWork);

export default router;
