import express from "express";
import {
    getUsers,
    getUserByEmail,
    addUser,
    updateUser,
    deleteUser,
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:email", getUserByEmail);
router.post("/", addUser);
router.patch("/:email", updateUser);
router.delete("/:email", deleteUser);

export default router;
