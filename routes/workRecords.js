import express from "express";
import {
    getWorks,
    addWork,
    updateWork,
    deleteWork,
} from "../controllers/workRecordsController.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();

// 
router.get("/", verifyJwt, verifyRole("admin", "hr"), getWorks);
router.post("/", verifyJwt, verifyRole("hr"), addWork);
router.patch("/:id", verifyJwt, verifyRole("admin"), updateWork);
router.delete("/:id", verifyJwt, verifyRole("admin"), deleteWork);

export default router;
