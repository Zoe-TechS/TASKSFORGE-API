import { users, projects, tasks } from "../data/data.js";

export function getAllProjects(req, res) {
  res.status(200).json({
    message: "All Projects retrieved successfully",
    projects,
  });
}

export function createProject(req, res) {
  const { name, description, ownerId } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof description !== "string" ||
    !description.trim() ||
    typeof ownerId !== "number" ||
    isNaN(ownerId)
  ) {
    return res.status(400).json({
      message: "name, description and ownerId are required",
    });
  }

  const projectExists = projects.some(
    (project) => project.name === name.trim(),
  );
  if (projectExists) {
    return res.status(409).json({
      message: "Project with this name already exists",
    });
  }

  const projectOwner = users.find((user) => user.id === Number(ownerId));
  if (!projectOwner) {
    return res.status(4040).json({
      message: "Project owner does not exist",
    });
  }

  const newProject = {
    id: Math.max(...projects.map((project) => project.id)) + 1,
    name: name.trim(),
    description: description.trim(),
    ownerId: Number(ownerId),
    status: "active",
  };

  projects.push(newProject);

  res.status(201).json({
    message: "New Project created successfully",
    newProject,
  });
}

export function getProjectById(req, res) {
  const { id } = req.params;

  const project = projects.find((project) => project.id === Number(id));
  if (!project) {
    return res.status(404).json({
      message: "project not found",
    });
  }
  res.status(200).json({
    message: `Project with ID ${id} has been found`,
    project,
  });
}

export function updateProjects(req, res) {
  const { id } = req.params;
  const { name, description, status } = req.body;

  const project = projects.find((project) => project.id === Number(id));

  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  const updatedProject = {
    ...project,
    name: name?.trim() || project.name,
    description: description?.trim() || project.description,
    status: status?.trim() || project.status,
  };
  projects[projects.indexOf(project)] = updatedProject;
  res.status(200).json({
    message: "Project updated successfully",
    project: updatedProject,
  });
}

export function deleteProject(req, res) {
  const { id } = req.params;
  const projectIndex = projects.findIndex(
    (project) => project.id === Number(id),
  );
  if (projectIndex === -1) {
    return res.status(404).json({
      message: "Project not found",
    });
  }
  projects.splice(projectIndex, 1);
  res.status(200).json({
    message: "Project deleted successfully",
  });
}

export function getTasksByProjectId(req, res) {
  const { id } = req.params;
  const project = projects.find((project) => project.id === Number(id));
  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }
  const projectTasks = tasks.filter((task) => task.projectId === Number(id));
  res.status(200).json({
    message: `Tasks for Project with ID ${id} have been found`,
    tasks: projectTasks,
  });
}

export function getProjectTasksSummary(req, res) {
  const { id } = req.params;
  const project = projects.find((project) => project.id === Number(id));
  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }
  const projectTasks = tasks.filter((task) => task.projectId === Number(id));
  const summary = {
    totalTasks: `The project contains ${projectTasks.length} tasks`,
  };
  res.status(200).json({
    message: `Summary for Project with ID ${id} has been found`,
    summary,
  });
}
