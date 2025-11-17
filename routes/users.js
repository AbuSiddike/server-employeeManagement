import express from "express";
import {
    getUsers,
    getUserByEmail,
    addUser,
    updateUser,
    deleteUser,
} from "../controllers/usersController.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();

// Only ADMIN can access all users
router.get("/", verifyJwt, verifyRole("admin"), getUsers);

// ADMIN and HR can access user by email
router.get("/:email", verifyJwt, verifyRole("admin", "hr"), getUserByEmail);

// Only ADMIN can add or delete user
router.post("/", verifyJwt, verifyRole("admin"), addUser);
router.delete("/:email", verifyJwt, verifyRole("admin"), deleteUser);

// ADMIN and HR can update user info
router.patch("/:email", verifyJwt, verifyRole("admin", "hr"), updateUser);

export default router;
