import express from "express";
import {
    getPayrolls,
    addPayroll,
    updatePayroll,
    deletePayroll,
} from "../controllers/payrollsController.js";

const router = express.Router();

router.get("/", getPayrolls);
router.post("/", addPayroll);
router.patch("/:id", updatePayroll);
router.delete("/:id", deletePayroll);

export default router;
