# Task Management App

A full-stack Task Management application built with **React** and
**FastAPI**, using **PostgreSQL** as the database.

The project was created as a learning and portfolio project to practice
building a complete web application with authentication, RESTful APIs,
database management, and a React frontend.

## Features

### Authentication

-   User registration
-   User login
-   JWT-based authentication
-   Protected task routes
-   User-level task authorization
-   Access token stored in `localStorage`
-   Axios request interceptor for automatically attaching the JWT

### Task Management

-   Create tasks
-   View tasks
-   Edit tasks
-   Delete tasks
-   Mark tasks as completed/uncompleted
-   Search tasks by title
-   Set task due dates and times
-   Timezone-aware due dates

### Validation & Database

-   Request validation with Pydantic
-   PostgreSQL database
-   SQLAlchemy ORM
-   Alembic database migrations
-   User-task relationship
-   Users can only access their own tasks

## Tech Stack

### Frontend

-   React
-   Vite
-   React Router
-   Axios
-   HTML
-   CSS

### Backend

-   Python
-   FastAPI
-   SQLAlchemy
-   Pydantic
-   PostgreSQL
-   Alembic
-   JWT Authentication

## Project Structure

``` text
Task-Management/
│
├── backend/
│   ├── routers/
│   │   ├── users.py
│   │   └── tasks.py
│   │
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── oauth2.py
│   ├── utils.py
│   └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosClient.js
│   │   │   └── axiosAuth.js
│   │   │
│   │   ├── components/
│   │   │   └── ProtectRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Tasks.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── alembic/
│   └── versions/
│
└── README.md
```

> The exact folder structure may vary depending on the current project
> organization.

## Database Design

The application uses two main tables:

### Users

``` text
users
├── id
├── username
├── email
├── password
└── created_at
```

### Tasks

``` text
tasks
├── id
├── title
├── description
├── due_at
├── completed
├── created_at
└── user_id
```

Relationship:

``` text
Users 1 ──────────── N Tasks
```

Each task belongs to one user through `user_id`.

## API Endpoints

### Authentication

  Method   Endpoint   Description
  -------- ---------- -----------------------
  POST     `/users`   Register a new user
  POST     `/login`   Login and receive JWT

### Tasks

  Method   Endpoint        Description
  -------- --------------- --------------------------
  GET      `/tasks/`       Get current user's tasks
  POST     `/tasks/`       Create a task
  PATCH    `/tasks/{id}`   Update a task
  DELETE   `/tasks/{id}`   Delete a task

Task endpoints require a valid JWT:

``` http
Authorization: Bearer <access_token>
```

## Authentication Flow

``` text
User
 │
 ├── Register
 │      └── POST /users
 │
 ├── Login
 │      └── POST /login
 │             └── JWT Access Token
 │
 └── Access /tasks
        │
        └── Axios Interceptor
               │
               └── Authorization: Bearer <token>
```

Protected routes are handled by React Router:

``` text
/tasks
   │
   └── ProtectRoute
          │
          ├── Token exists → Tasks page
          │
          └── No token → /login
```

## Getting Started

### 1. Clone the repository

``` bash
git clone <your-repository-url>
cd Task-Management
```

## Backend Setup

### 2. Create and activate a virtual environment

Windows:

``` bash
python -m venv venv
venv\Scripts\activate
```

Linux/macOS:

``` bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install backend dependencies

``` bash
pip install -r requirements.txt
```

### 4. Configure PostgreSQL

Create a PostgreSQL database and configure the database connection used
by the backend.

Example:

``` env
DATABASE_URL=postgresql://username:password@localhost:5432/task_management
```

Do not commit real database credentials or secret keys to GitHub.

### 5. Run database migrations

``` bash
alembic upgrade head
```

### 6. Start the FastAPI server

From the project directory:

``` bash
uvicorn backend.main:app --reload
```

The backend will normally run at:

``` text
http://127.0.0.1:8000
```

FastAPI documentation:

``` text
http://127.0.0.1:8000/docs
```

## Frontend Setup

### 7. Install dependencies

Open another terminal:

``` bash
cd frontend
npm install
```

### 8. Start the React development server

``` bash
npm run dev
```

The frontend will normally run at:

``` text
http://localhost:5173
```

## Environment Variables

If environment variables are used in your local project, create a `.env`
file and keep it out of Git.

Example:

``` env
DATABASE_URL=postgresql://username:password@localhost:5432/task_management
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Add `.env` to `.gitignore`:

``` gitignore
.env
venv/
__pycache__/
node_modules/
```

## Screenshots

Add screenshots of the application here after pushing the project to
GitHub.

Example:

``` text
screenshots/
├── login.png
├── register.png
└── tasks.png
```

You can then display them in this section:

``` markdown
![Login](screenshots/login.png)

![Task Management](screenshots/tasks.png)
```

## What I Practiced

This project helped me practice:

-   Building REST APIs with FastAPI
-   Designing database models with SQLAlchemy
-   PostgreSQL database integration
-   Database migrations with Alembic
-   JWT authentication
-   Authorization and protected resources
-   Pydantic request/response validation
-   React component-based development
-   React Router
-   Axios and request interceptors
-   CRUD operations
-   Managing React state with `useState` and `useEffect`
-   Connecting a React frontend with a FastAPI backend
-   Handling date/time and timezone data
-   Building and styling a responsive UI

## Future Improvements

Possible improvements for future versions:

-   Better frontend error messages
-   Form validation messages
-   Loading states
-   Confirmation dialog before deleting a task
-   Task filtering by completion status
-   Task sorting by due date
-   Pagination
-   User profile page
-   Logout button
-   Refresh token support
-   Deployment to a cloud platform
-   Automated tests

## Author

**Nguyen Dang Hao**

This project was created as a personal learning and portfolio project.
