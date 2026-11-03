import { users, tasks } from "../data/data.js";

export function getAllUsers(req, res) {
  let newUsersArray = users;
  const { role, active } = req.query;
  const roles = users.map((user) => user.role);

  if (role !== undefined) {
    if (!roles.includes(role) && role !== undefined) {
      return res.status(400).json({
        message: "Role has not been asigned to any user",
      });
    }
    newUsersArray = newUsersArray.filter((user) => user.role === role);
  }

  if (active !== undefined) {
    if (!["true", "false"].includes(active)) {
      return res.status(400).json({
        message: "active must be true or false",
      });
    }
    newUsersArray = newUsersArray.filter(
      (user) => String(user.active) === active,
    );
  }

  res.status(200).json({
    message: "All users retrieved successfully",
    users: newUsersArray,
  });
}

export function getUserById(req, res) {
  const { id } = req.params;

  const user = users.find((user) => user.id === Number(id));

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json({
    message: `User with id ${id} has been found`,
    user,
  });
}

export function getUserTasks(req, res) {
  const { id } = req.params;
  const userTasks = tasks.filter((task) => task.assignedTo === Number(id));

  if (userTasks.length === 0) {
    return res.status(404).json({
      message: "No tasks found for this user",
    });
  }

  res.status(200).json({
    message: "User tasks retrieved",
    userTasks,
  });
}

export function createUser(req, res) {
  const { name, email, role } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof role !== "string" ||
    !role.trim()
  ) {
    return res.status(400).json({
      message: "name, email and role are required",
    });
  }

  const fixedEmail = email.trim().toLowerCase();

  const emailExists = users.some((user) => user.email === fixedEmail);

  if (emailExists) {
    return res.status(409).json({
      message: "User with this email already exists",
    });
  }

  const newUser = {
    id: Math.max(...users.map((user) => user.id)) + 1,
    name: name.trim(),
    email: fixedEmail,
    role: role.trim(),
    active: true,
  };

  users.push(newUser);

  res.status(201).json({
    message: "user created successfully",
    newUser,
  });
}

export function updateUser(req, res) {
  const { id } = req.params;
  const { name, email, role, active } = req.body;

  const userIndex = users.findIndex((user) => user.id === Number(id));

  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const updatedUser = {
    ...users[userIndex],
    name: name?.trim() || users[userIndex].name,
    email: email?.trim().toLowerCase() || users[userIndex].email,
    role: role?.trim() || users[userIndex].role,
  };

  users[userIndex] = updatedUser;

  res.status(200).json({
    message: "User updated successfully",
    user: updatedUser,
  });
}

export function getTasksByUserId(req, res) {
  const { id } = req.params;
  const user = users.find((user) => user.id === Number(id));
  const userTasks = tasks.filter((task) => task.assignedTo === Number(id));
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (userTasks.length == 0) {
    return res.status(404).json({
      message: "User has no assigned tasks",
    });
  }
  res.status(200).json({
    message: `Tasks for User with ID ${id} have been found`,
    tasks: userTasks,
  });
}
