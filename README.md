# Employee Management System (MERN Stack)

A full-stack Employee Management System built with MongoDB, Express, React, and Node.js. Includes JWT authentication, protected routes, full employee CRUD, name search, department filtering, sorting, pagination, Redux Toolkit state management, Docker setup, and a Jest/Supertest test suite.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running with Docker](#running-with-docker)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Running Tests](#running-tests)
- [Deployment](#deployment)
- [Problem-Solving Approach](#problem-solving-approach)

## Tech Stack

**Frontend:** React 18, Vite, Redux Toolkit, React Router, Axios, Tailwind CSS
**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Auth:** JWT (jsonwebtoken), bcryptjs for password hashing
**Validation:** express-validator (server), custom validation (client)
**Testing:** Jest, Supertest, mongodb-memory-server
**DevOps:** Docker, docker-compose

## Project Structure

```
employee-management-system/
├── backend/
│   ├── config/db.js                 # MongoDB connection
│   ├── models/                      # User.js, Employee.js (Mongoose schemas)
│   ├── middleware/                  # authMiddleware.js, errorMiddleware.js
│   ├── controllers/                 # authController.js, employeeController.js
│   ├── routes/                      # authRoutes.js, employeeRoutes.js
│   ├── tests/                       # auth.test.js, employee.test.js
│   ├── server.js
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/axiosInstance.js     # Axios instance + JWT interceptor
│   │   ├── redux/                   # store.js, authSlice.js, employeeSlice.js
│   │   ├── components/              # Navbar, EmployeeTable, EmployeeFormModal, etc.
│   │   └── pages/                   # Login.jsx, Register.jsx, Dashboard.jsx
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js v18+ and npm
- MongoDB running locally, OR a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd employee-management-system
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# edit .env and set MONGO_URI and JWT_SECRET (see below)
npm run dev
```
Backend runs on `http://localhost:5000`.

### 3. Frontend setup
Open a new terminal:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend runs on `http://localhost:5173`.

### 4. Use the app
Open `http://localhost:5173`, register a new account, log in, and start adding employees.

## Environment Variables

### backend/.env
| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the API server listens on | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/employee_management` |
| `JWT_SECRET` | Secret used to sign JWTs — use a long random string | `a_long_random_string` |
| `JWT_EXPIRES_IN` | Token expiry | `30d` |
| `CLIENT_URL` | Frontend origin allowed by CORS | `http://localhost:5173` |

### frontend/.env
| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API | `http://localhost:5000/api` |

## Running with Docker

A `docker-compose.yml` at the project root spins up MongoDB, the backend, and the frontend together:

```bash
JWT_SECRET=your_long_random_secret docker-compose up --build
```
- Frontend → `http://localhost:5173`
- Backend → `http://localhost:5000`
- MongoDB → `localhost:27017` (persisted in a named Docker volume)

## API Documentation

Base URL: `/api`

### Auth Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user. Body: `{ name, email, password }` |
| POST | `/auth/login` | Public | Log in. Body: `{ email, password }`. Returns a JWT. |
| GET | `/auth/me` | Private | Returns the logged-in user's profile |

**Register/Login response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Rani Yadav",
    "email": "rani@example.com",
    "role": "hr",
    "token": "<jwt>"
  }
}
```

### Employee Routes
All routes below require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/employees` | List employees. Supports query params below. |
| GET | `/employees/:id` | Get a single employee by id |
| POST | `/employees` | Create an employee |
| PUT | `/employees/:id` | Update an employee |
| DELETE | `/employees/:id` | Delete an employee |

**Query params for `GET /employees`:**
| Param | Description | Default |
|---|---|---|
| `search` | Case-insensitive partial match on `fullName` | `''` |
| `department` | Exact match filter | none |
| `sortBy` | One of `fullName`, `department`, `designation`, `joiningDate`, `createdAt` | `createdAt` |
| `order` | `asc` or `desc` | `desc` |
| `page` | Page number | `1` |
| `limit` | Page size (max 100) | `10` |

Example: `GET /api/employees?search=Rani&department=Engineering&sortBy=joiningDate&order=asc&page=1&limit=10`

**Create/Update employee body:**
```json
{
  "fullName": "Rani Yadav",
  "email": "rani@example.com",
  "mobileNumber": "9876543210",
  "department": "Engineering",
  "designation": "Software Engineer Intern",
  "joiningDate": "2026-01-15"
}
```

**List response:**
```json
{
  "success": true,
  "data": [ { "_id": "...", "fullName": "...", "...": "..." } ],
  "pagination": { "total": 42, "page": 1, "limit": 10, "totalPages": 5 }
}
```

## Database Schema

**User**
| Field | Type | Notes |
|---|---|---|
| name | String | required, 2–50 chars |
| email | String | required, unique, validated format |
| password | String | required, min 6 chars, bcrypt-hashed, never returned by default |
| role | String | enum: `admin`, `hr`, `employee` (default `hr`) |

**Employee**
| Field | Type | Notes |
|---|---|---|
| fullName | String | required, 2–100 chars |
| email | String | required, unique, validated format |
| mobileNumber | String | required, exactly 10 digits |
| department | String | required, enum of fixed departments |
| designation | String | required, max 100 chars |
| joiningDate | Date | required, cannot be in the future |
| createdBy | ObjectId (ref User) | tracks which user added the record |

Indexes: text index on `fullName` (search), compound index on `department + joiningDate` (filter/sort performance).

## Running Tests

```bash
cd backend
npm test
```
Uses `mongodb-memory-server` to spin up a temporary in-memory MongoDB instance, so no real database is touched. Covers registration, login (success/failure), protected-route rejection, employee creation, validation errors, and search.

## Deployment

Suggested free-tier deployment path:
- **Database:** MongoDB Atlas (free M0 cluster) → use the connection string as `MONGO_URI`
- **Backend:** Render / Railway — deploy the `backend/` folder, set the environment variables from the table above
- **Frontend:** Vercel / Netlify — deploy the `frontend/` folder, set `VITE_API_BASE_URL` to your deployed backend URL (e.g. `https://your-backend.onrender.com/api`)

After deploying, update `CLIENT_URL` on the backend to your deployed frontend URL so CORS allows it.

> Live demo link: _add here after deploying_
> GitHub repo: _add here_

## Problem-Solving Approach

1. **Schema-first design** — modeled `User` and `Employee` with Mongoose validators matching every functional requirement (10-digit mobile regex, department enum, no-future-joining-date) so bad data is rejected at the database layer, not just the UI.
2. **Layered backend** — routes → validation → controllers → models, with a single centralized error handler so every error (validation, duplicate key, bad ObjectId, unknown route) returns a consistent JSON shape.
3. **Security defaults** — passwords hashed with bcrypt, JWT-protected routes, `helmet` for secure headers, rate limiting on auth endpoints, and explicit CORS origin allow-listing.
4. **One endpoint, four bonus features** — `GET /employees` combines search, department filtering, sorting, and pagination into a single, query-param-driven endpoint instead of separate ad-hoc routes.
5. **Frontend state** — Redux Toolkit slices separate `auth` and `employees` concerns; async thunks handle loading/error states consistently so every screen can show a spinner or error message without repeated boilerplate.
6. **Resilience** — an Axios response interceptor catches `401`s globally and force-logs-out, so an expired token never leaves the user stuck on a broken screen.
