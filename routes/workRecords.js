import express from "express";
import {
    getWorks,
    addWork,
    updateWork,
    deleteWork,
} from "../controllers/workRecordsController.js";

const router = express.Router();

router.get("/", getWorks);
router.post("/", addWork);
router.patch("/:id", updateWork);
router.delete("/:id", deleteWork);

export default router;
