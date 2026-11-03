import { Router } from "express";
import {
  getAllTasks,
  createNewTask,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

const route = Router();

route.get("/", getAllTasks);
route.post("/", createNewTask);
route.get("/:id", getTaskById);
route.patch("/:id", updateTask);
route.delete("/:id", deleteTask);

export default route;
