# Controllusion CRM

Controllusion is a monorepo CRM with a React frontend and a Python FastAPI backend.

## Current Stack

| Layer | Stack |
| --- | --- |
| Frontend | React 18, Vite, React Router, Tailwind CSS, Axios, Recharts |
| Backend | FastAPI, SQLAlchemy, PyJWT, Passlib |
| Database | SQLite by default, PostgreSQL-compatible via `DATABASE_URL` |
| Deployment | Vercel-friendly frontend, Docker-ready Python backend |

## Main Features

- Design-driven CRM UI matched to the provided Figma/screenshots
- Login, registration, logout, profile editing, password change
- Dashboard metrics, activity feed, and quick actions
- Customer CRUD with search, filtering, sorting, pagination, detail, and edit screens
- Admin-only team management with invite flow, role changes, and enable/disable actions
- Real FastAPI API with the same frontend contract

## Repo Structure

```text
crm/
  frontend/
    public/
    src/
    .env
    package.json
    vite.config.js
  backend/
    app/
    Dockerfile
    main.py
    requirements.txt
  README.md
```

## Demo Accounts

Available in the seeded app:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@controllusion.com` | `Admin@123` |
| User | `sara@controllusion.com` | `User@1234` |
| Showcase User | `showcase@controllusion.com` | `Showcase@123` |

Temporary password used by invite and reset flows:

- `Welcome@123`

## Routes

### Public

- `/`
- `/login`
- `/register`

### Protected

- `/dashboard`
- `/customers`
- `/customers/create`
- `/customers/:id`
- `/customers/:id/edit`
- `/profile`
- `/settings`

### Admin

- `/admin`

## API Endpoints

All real backend routes are served under `/api`.

### Auth

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `PATCH /api/auth/profile`
- `POST /api/auth/change-password`
- `POST /api/auth/logout`

### Dashboard

- `GET /api/dashboard/summary`

### Customers

- `GET /api/customers`
- `GET /api/customers/{id}`
- `POST /api/customers`
- `PATCH /api/customers/{id}`
- `DELETE /api/customers/{id}`

### Users

- `GET /api/users`
- `POST /api/users/invite`
- `PATCH /api/users/{id}`

## Local Development

### Requirements

- Node.js 18+
- npm
- Python 3.12+ recommended

### 1. Start the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8080
```

Backend URL:

```text
http://localhost:8080
```

Health check:

```text
http://localhost:8080/health
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Environment Variables

### Frontend

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Explicit API base URL for Axios | unset |
| `VITE_API_PROXY_TARGET` | Dev proxy target when `VITE_API_BASE_URL` is unset | `http://localhost:8080` |

### Backend

| Variable | Purpose | Default |
| --- | --- | --- |
| `DATABASE_URL` | SQLAlchemy database URL | SQLite file in `backend/controllusion.db` |
| `DB_URL` | Alias that overrides `DATABASE_URL` | unset |
| `JWT_SECRET` | JWT signing secret | dev default in config |
| `JWT_EXPIRATION_MINUTES` | Access token lifetime | `1440` |
| `APP_CORS_ALLOWED_ORIGINS` | Allowed origins list | `http://localhost:5173,http://localhost:3000` |
| `INVITE_TEMP_PASSWORD` | Temporary password for admin invite flow | `Welcome@123` |

## Backend Notes

- The backend entrypoint is `backend/main.py`
- FastAPI app is defined in `backend/app/main.py`
- SQLAlchemy tables are created automatically on startup
- Demo users and customers are seeded automatically on startup
- SQLite is the default database, so local boot works without PostgreSQL

## Frontend Notes

- The frontend build passes with `npm run build`

## Docker

Backend container build:

```bash
cd backend
docker build -t controllusion-backend .
docker run -p 8080:8080 controllusion-backend
```

## Removed Legacy Backend

The old Spring Boot / Java backend has been removed from the tracked repository.
The active backend is now the Python FastAPI service under `backend/app`.
