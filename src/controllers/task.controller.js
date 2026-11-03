import { tasks, projects, users } from "../data/data.js";

export function getAllTasks(req, res) {
  const { status, priority, projectId, assignedTo, search } = req.query;
  const filteredTasks = [...tasks];
  if (status !== undefined) {
    if (
      !filteredTasks.map((task) => task.status).includes(status.trim()) ||
      status === ""
    ) {
      return res.status(404).json({
        message: "Status is not found",
      });
    }
    filteredTasks = filteredTasks.filter(
      (task) => task.status === status.trim(),
    );
  }
  if (priority !== undefined) {
    if (
      !filteredTasks.map((task) => task.priority).includes(priority.trim()) ||
      priority === ""
    ) {
      return res.status(404).json({
        message: "Priority is not found",
      });
    }
    filteredTasks = filteredTasks.filter(
      (task) => task.priority === priority.trim(),
    );
  }
  if (projectId !== undefined) {
    if (
      !filteredTasks
        .map((task) => task.projectId)
        .includes(Number(projectId)) ||
      projectId === ""
    ) {
      return res.status(404).json({
        message: "ProjectID is not found",
      });
    }
    filteredTasks = filteredTasks.filter(
      (task) => task.projectId === Number(projectId),
    );
  }
  if (assignedTo !== undefined) {
    if (
      !filteredTasks
        .map((task) => task.assignedTo)
        .includes(Number(assignedTo)) ||
      assignedTo === ""
    ) {
      return res.status(404).json({
        message: "User assigned not found",
      });
    }
    filteredTasks = filteredTasks.filter(
      (task) => task.assignedTo === Number(assignedTo),
    );
  }
  if (search !== undefined) {
    const searchValue = req.query.search.trim().toLowerCase();
    if (
      !filteredTasks
        .map((task) => task.title.toLowerCase())
        .includes(searchValue.trim()) ||
      !filteredTasks
        .map((task) => task.description.toLowerCase())
        .includes(searchValue.trim()) ||
      search === ""
    ) {
      return res.status(404).json({
        message: "task is not found",
      });
    }
    filteredTasks = filteredTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchValue) ||
        task.description.toLowerCase().includes(searchValue),
    );
  }

  res.status(200).json({
    message: "All Tasks have been found",
    filteredTasks,
  });
}

export function getTaskById(req, res) {
  const { id } = req.params;
  const task = tasks.find((task) => task.id === Number(id));
  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }
  res.status(200).json({
    message: `Task with ID ${id} has been found`,
    task,
  });
}

export function createNewTask(req, res) {
  const { title, description, assignedTo, projectId, priority } = req.body;
  const projectIdExists = projects.some(
    (project) => project.id === Number(projectId),
  );
  const userIdExists = users.some((task) => task.id === Number(assignedTo));

  if (!projectIdExists || !userIdExists) {
    return res.status(404).json({
      message: "Projectid or UserId does nor exist",
    });
  }
  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof assignedTo !== "number" ||
    typeof projectId !== "number" ||
    typeof priority !== "string" ||
    !title.trim() ||
    !description.trim() ||
    !assignedTo ||
    !projectId ||
    !priority.trim()
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const newTask = {
    id: Math.max(...tasks.map((task) => task.id)) + 1,
    title: title.trim(),
    description: description.trim(),
    assignedTo: Number(assignedTo),
    projectId: Number(projectId),
    priority: priority.trim(),
    status: "to-do",
  };

  tasks.push(newTask);
  res.status(201).json({
    message: "Task created successfully",
    newTask,
  });
}

export function updateTask(req, res) {
  const { id } = req.params;
  const { title, description, assignedTo, projectId, priority, status } =
    req.body;

  const task = tasks.find((task) => task.id === Number(id));

  if (!task) {
    return res.status(404).json({
      message: "Task does not exist",
    });
  }
  const updatedTask = {
    ...task,
    title: title?.trim() || task.title,
    description: description?.trim() || task.description,
    assignedTo: assignedTo !== undefined ? Number(assignedTo) : task.assignedTo,
    projectId: projectId !== undefined ? Number(projectId) : task.projectId,
    priority: priority?.trim() || task.priority,
    status: status?.trim() || task.status,
  };

  tasks[tasks.indexOf(task)] = updatedTask;

  res.status(200).json({
    message: "Task updated succesfully",
    updatedTask,
  });
}

export function deleteTask(req, res) {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((task) => task.id === Number(id));
  if (taskIndex === -1) {
    return res.status(404).json({
      message: "Project not found",
    });
  }
  tasks.splice(taskIndex, 1);
  res.status(200).json({
    message: "Task deleted successfully",
  });
}
