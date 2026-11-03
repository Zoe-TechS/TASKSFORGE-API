import express from "express";
import userRoutes from "./routes/user.route.js";
import projectRoutes from "./routes/project.route.js";
import taskRoutes from "./routes/task.route.js";
import { requestLogger, customHeader } from "./middleware/logger.middleware.js";
import { errorHandler, invalidRoute } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(customHeader);

app.get("", (req, res) => {
  res.status(200).json({
    message: `TasksForge API is running`,
  });
});
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.use(invalidRoute);
app.use(errorHandler);
export default app;
