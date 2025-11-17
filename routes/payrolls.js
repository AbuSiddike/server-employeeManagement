import express from "express";
import {
    getPayrolls,
    getMyPayrolls,
    addPayroll,
    updatePayroll,
    deletePayroll,
} from "../controllers/payrollsController.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();

// ADMIN & HR can view all payrolls
router.get("/", verifyJwt, verifyRole("admin", "hr"), getPayrolls);

// Employees can view their own payrolls
router.get("/my", verifyJwt, verifyRole("employee"), getMyPayrolls);

// HR can add payrolls
router.post("/", verifyJwt, verifyRole("hr"), addPayroll);

// ADMIN can update or delete payrolls
router.patch("/:id", verifyJwt, verifyRole("admin"), updatePayroll);
router.delete("/:id", verifyJwt, verifyRole("admin"), deletePayroll);

export default router;
