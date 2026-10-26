# MERN Task Manager

A basic task manager built with MongoDB, Express, React (Vite) and Node.

**Features:** add, edit, delete and complete tasks; priority levels; due dates with overdue highlighting; all / active / completed filters.

## Structure

```
task-manager/
├── server/          Express + Mongoose API
│   ├── models/Task.js
│   ├── routes/tasks.js
│   └── server.js
└── client/          React app (Vite)
    └── src/ (App, TaskForm, TaskItem, api.js, App.css)
```

## Prerequisites

- Node.js 18+
- MongoDB running locally, or a free MongoDB Atlas connection string

## Setup

**1. API**

```bash
cd server
cp .env.example .env     # edit MONGO_URI if you use Atlas
npm install
npm run dev              # http://localhost:5000
```

**2. Client** (in a second terminal)

```bash
cd client
npm install
npm run dev              # http://localhost:5173
```

Open http://localhost:5173. The Vite dev server proxies `/api` calls to port 5000.

## API

| Method | Endpoint             | Description                                  |
| ------ | -------------------- | -------------------------------------------- |
| GET    | `/api/tasks`         | List tasks (`?status=active` or `completed`) |
| POST   | `/api/tasks`         | Create a task                                |
| PUT    | `/api/tasks/:id`     | Update a task                                |
| DELETE | `/api/tasks/:id`     | Delete a task                                |
| GET    | `/api/health`        | Health check                                 |

Task fields: `title` (required), `description`, `priority` (`low` | `medium` | `high`), `dueDate`, `completed`.

## Ideas for next steps

- User accounts with JWT auth, so each person sees only their tasks
- Search, sorting and drag-to-reorder
- Tags or projects
- Deploy: API on Render/Railway, client on Vercel/Netlify (set `CLIENT_ORIGIN` on the API and add an API base URL to the client)
