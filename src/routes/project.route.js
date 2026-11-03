import { Router } from "express";

import {
  getAllProjects,
  createProject,
  getProjectById,
  getProjectTasksSummary,
  deleteProject,
  updateProjects,
  getTasksByProjectId,
} from "../controllers/project.controller.js";

const route = Router();

route.get("/", getAllProjects);
route.post("/", createProject);
route.get("/:id", getProjectById);
route.get("/:id/tasks", getTasksByProjectId);
route.get("/:id/summary", getProjectTasksSummary);
route.patch("/:id", updateProjects);
route.delete("/:id", deleteProject);

export default route;
