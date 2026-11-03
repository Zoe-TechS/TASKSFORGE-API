import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  getTasksByUserId,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id/tasks", getTasksByUserId);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);

export default router;
