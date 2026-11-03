export function invalidRoute(req, res, next) {
  res.status(404).json({
    message: "Route not found",
  });
}

export function errorHandler(error, req, res, next) {
  console.error(error);

  res.status(500).json({
    message: "Internal server error",
  });
}

// REMOVE ALL UNNECESSARY CONSOLE.LOGS IN THE PROJECT LATER
