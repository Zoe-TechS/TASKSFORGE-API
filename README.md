# TaskForge API

A RESTful API built with **Node.js** and **Express.js** for managing users, projects, and tasks. It provides endpoints to create, retrieve, update, and delete records, as well as retrieve tasks associated with users or projects and view a project task summary.

> **Current implementation:** Data is stored in in-memory JavaScript arrays in `src/data/data.js`. There is no database integration or authentication in the current project. Data created or changed through the API is reset when the server restarts.

## Tech Stack

- Node.js
- Express.js 5
- JavaScript (ES modules)
- Native Node.js file-system APIs for request logging

## Features

- Create, list, retrieve, and update users.
- Create, list, retrieve, update, and delete projects.
- Create, list, retrieve, update, and delete tasks.
- Retrieve tasks assigned to a user.
- Retrieve tasks belonging to a project.
- Retrieve a task-count summary for a project.
- Filter users by role and active state.
- Task filtering by status, priority, project, assignee, and search term is present in the controller (see the implementation note below).
- Request logging and JSON error responses.

## Requirements

- Node.js **20.6.0 or later** (the npm scripts use Node's `--env-file` option).
- npm.

## Installation

1. Clone or download the project.
2. Open a terminal in the project directory.
3. Install dependencies:

   ```
   npm install
   ```

4. Create a `.env` file in the project root:

   ```env
   PORT=3000
   ```


## Environment Variables

| Variable | Required | Default | Description |
|---|---|---:|---|
| `PORT` | No | `3000` | Port on which the Express server listens. |


## How to Run the Server

### Development mode

Starts the server with Node.js watch mode:

```
npm run dev
```

### Standard mode

Starts the server normally:

```
npm start
```

The API is available at:

```text
http://localhost:3000
```

Change the port in `.env` if required.

### Check that the server is running

```http
GET /
```

Example response:

```json
{
  "message": "TasksForge API is running"
}
```

Send JSON request bodies with the `Content-Type: application/json` header.

## Project Structure

```text
taskforge-api/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── controllers/
│   │   ├── project.controller.js
│   │   ├── task.controller.js
│   │   └── user.controller.js
│   ├── data/
│   │   └── data.js
│   ├── middleware/
│   │   ├── error.middleware.js
│   │   ├── logger.middleware.js
│   │   └── urlInfo.log        # Generated/updated by request logging
│   └── routes/
│       ├── project.route.js
│       ├── task.route.js
│       └── user.route.js
├── .env                       # Create locally
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

### Folder and file responsibilities

- `src/server.js` — starts the HTTP server and selects the port.
- `src/app.js` — configures Express, JSON parsing, middleware, the root route, and API route groups.
- `src/routes/` — maps HTTP methods and URL paths to controller functions.
- `src/controllers/` — contains request-handling logic for users, projects, and tasks.
- `src/data/data.js` — contains the in-memory sample users, projects, and tasks.
- `src/middleware/` — contains request logging, a custom response header, invalid-route handling, and general error handling.

## API Endpoints

All resource endpoints are prefixed with `/api`.

### General

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Check whether the API is running. |

### Users

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | Retrieve all users. |
| `GET` | `/api/users?role=developer` | Filter users by role. |
| `GET` | `/api/users?active=true` | Filter users by active state (`true` or `false`). |
| `POST` | `/api/users` | Create a user. |
| `GET` | `/api/users/:id` | Retrieve a user by ID. |
| `PATCH` | `/api/users/:id` | Update a user's name, email, or role. |
| `GET` | `/api/users/:id/tasks` | Retrieve tasks assigned to a user. |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | Retrieve all projects. |
| `POST` | `/api/projects` | Create a project. |
| `GET` | `/api/projects/:id` | Retrieve a project by ID. |
| `PATCH` | `/api/projects/:id` | Update a project's name, description, or status. |
| `DELETE` | `/api/projects/:id` | Delete a project. |
| `GET` | `/api/projects/:id/tasks` | Retrieve tasks belonging to a project. |
| `GET` | `/api/projects/:id/summary` | Retrieve the task-count summary for a project. |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Retrieve all tasks. |
| `GET` | `/api/tasks?status=todo` | Filter tasks by status. |
| `GET` | `/api/tasks?priority=high` | Filter tasks by priority. |
| `GET` | `/api/tasks?projectId=1` | Filter tasks by project ID. |
| `GET` | `/api/tasks?assignedTo=2` | Filter tasks by assigned user ID. |
| `GET` | `/api/tasks?search=routes` | Search task titles and descriptions. |
| `POST` | `/api/tasks` | Create a task. |
| `GET` | `/api/tasks/:id` | Retrieve a task by ID. |
| `PATCH` | `/api/tasks/:id` | Update a task. |
| `DELETE` | `/api/tasks/:id` | Delete a task. |

Query parameters can be combined, for example:

```http
GET /api/tasks?projectId=1&priority=high
```

## Example Requests and Responses

The examples use the sample records in `src/data/data.js`. IDs may differ after records have been added or deleted during a server session.

### 1. Create a user

**Request**

```http
POST /api/users
Content-Type: application/json
```

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "developer"
}
```

**Example response — `201 Created`**

```json
{
  "message": "user created successfully",
  "newUser": {
    "id": 4,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "developer",
    "active": true
  }
}
```

### 2. Retrieve all users

**Request**

```http
GET /api/users
```

**Example response — `200 OK`**

```json
{
  "message": "All users retrieved successfully",
  "users": [
    {
      "id": 1,
      "name": "Amos",
      "email": "amos@example.com",
      "role": "admin",
      "active": true
    },
    {
      "id": 2,
      "name": "John",
      "email": "john@example.com",
      "role": "developer",
      "active": true
    },
    {
      "id": 3,
      "name": "Mary",
      "email": "mary@example.com",
      "role": "developer",
      "active": false
    }
  ]
}
```

### 3. Create a project

`ownerId` must refer to an existing user.

**Request**

```http
POST /api/projects
Content-Type: application/json
```

```json
{
  "name": "Website Redesign",
  "description": "Redesign the company website",
  "ownerId": 1
}
```

**Example response — `201 Created`**

```json
{
  "message": "New Project created successfully",
  "newProject": {
    "id": 4,
    "name": "Website Redesign",
    "description": "Redesign the company website",
    "ownerId": 1,
    "status": "active"
  }
}
```

### 4. Create a task

`projectId` and `assignedTo` must refer to existing project and user records.

**Request**

```http
POST /api/tasks
Content-Type: application/json
```

```json
{
  "title": "Build the landing page",
  "description": "Implement the new website landing page",
  "assignedTo": 2,
  "projectId": 1,
  "priority": "high"
}
```

**Example response — `201 Created`**

```json
{
  "message": "Task created successfully",
  "newTask": {
    "id": 3,
    "title": "Build the landing page",
    "description": "Implement the new website landing page",
    "assignedTo": 2,
    "projectId": 1,
    "priority": "high",
    "status": "to-do"
  }
}
```

### 5. Retrieve a task by ID

**Request**

```http
GET /api/tasks/1
```

**Example response — `200 OK`**

```json
{
  "message": "Task with ID 1 has been found",
  "task": {
    "id": 1,
    "title": "Create project routes",
    "description": "Build all project endpoints",
    "projectId": 1,
    "assignedTo": 2,
    "priority": "high",
    "status": "todo"
  }
}
```

### 6. Update a task

Only supplied fields are updated; omitted fields retain their existing values.

**Request**

```http
PATCH /api/tasks/1
Content-Type: application/json
```

```json
{
  "status": "completed",
  "priority": "medium"
}
```

**Example response — `200 OK`**

```json
{
  "message": "Task updated succesfully",
  "updatedTask": {
    "id": 1,
    "title": "Create project routes",
    "description": "Build all project endpoints",
    "projectId": 1,
    "assignedTo": 2,
    "priority": "medium",
    "status": "completed"
  }
}
```

### 7. Retrieve tasks for a project

**Request**

```http
GET /api/projects/1/tasks
```

**Example response — `200 OK`**

```json
{
  "message": "Tasks for Project with ID 1 have been found",
  "tasks": [
    {
      "id": 1,
      "title": "Create project routes",
      "description": "Build all project endpoints",
      "projectId": 1,
      "assignedTo": 2,
      "priority": "high",
      "status": "todo"
    },
    {
      "id": 2,
      "title": "Create task controller",
      "description": "Implement task CRUD operations",
      "projectId": 1,
      "assignedTo": 2,
      "priority": "medium",
      "status": "in-progress"
    }
  ]
}
```

## Response and Error Handling

Responses are JSON. The middleware returns these general error shapes:

**Invalid route — `404 Not Found`**

```json
{
  "message": "Route not found"
}
```

**Unhandled server error — `500 Internal Server Error`**

```json
{
  "message": "Internal server error"
}
```

Controllers also return endpoint-specific messages for validation errors and missing records. Depending on the endpoint, these may use `400`, `404`, or `409` status codes.

## Middleware

- **JSON parser:** `express.json()` parses incoming JSON request bodies.
- **Request logger:** records the timestamp, HTTP method, and request URL in `src/middleware/urlInfo.log`.
- **Custom header:** adds the `X-Powered-By-Student: Osato-Amayo` response header.
- **Invalid route handler:** returns a JSON 404 response for unmatched routes.
- **Error handler:** logs unhandled errors and returns a generic JSON 500 response.

## Current Limitations

- Data is held in memory; there is no persistent database.
- There is no authentication or authorization middleware in the current implementation.
- Restarting the server resets data to the sample values in `src/data/data.js`.

## License

The project currently declares the `ISC` license in `package.json`.