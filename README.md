# Controllusion

Controllusion is a front-end CRM workspace built with React and Vite. It ships with a polished landing page, authentication, protected application routes, customer CRUD flows, a profile area, and an admin panel, all backed by a mock API that persists data in `localStorage`.

The project is designed to feel like a production admin dashboard while still running as a self-contained static app. There is no external database, no separate backend service, and no setup beyond installing dependencies.

## Preview

![Controllusion dashboard preview](./public/figma-dashboard-preview.png)

## What This App Includes

- Public marketing-style landing page
- Login and registration flows
- Session-aware protected routes
- Role-gated admin route
- Customer list with search, filter, sort, pagination, and row actions
- Customer create, edit, detail, and delete workflows
- Customer timeline, deal, and notes views
- Profile editing and password change forms
- Admin user management with role changes, access toggles, and invites
- Toast notifications, loading states, empty states, and error states
- Browser-persistent mock data using `localStorage`

## Demo Accounts

Use these seeded accounts after the first app load:

| Role | Email | Password | Notes |
| --- | --- | --- | --- |
| Admin | `admin@controllusion.com` | `Admin@123` | Full access, including `/admin` |
| User | `sara@controllusion.com` | `User@1234` | Standard protected user access |
| User | `ethan@controllusion.com` | `User@1234` | Additional seeded active user |
| User | `olivia@controllusion.com` | `User@1234` | Seeded as inactive, cannot sign in |

When an admin invites a user from the admin panel, the mock API creates the account with a temporary password of `Welcome@123`.

## Quick Start

### Requirements

- Node.js 18+ recommended
- npm

### Install and Run

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

If PowerShell blocks `npm`, use `npm.cmd install`, `npm.cmd run dev`, and `npm.cmd run build`.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create the production build in `dist/` |
| `npm run preview` | Serve the production build locally |

## Product Walkthrough

### Public Routes

- `/` renders the landing page with product framing and dashboard preview
- `/login` signs in an existing user
- `/register` creates a new user account and immediately starts a session

### Protected Routes

- `/dashboard` shows the main dashboard shell, KPI cards, chart, and deals table
- `/customers` lists CRM records with search, filters, sorting, pagination, and bulk selection state
- `/customers/create` opens the reusable customer form for record creation
- `/customers/:id` shows customer overview, timeline, deals, and notes
- `/customers/:id/edit` edits an existing customer using the same form component
- `/profile` updates account details and password

### Admin Route

- `/admin` is visible only to users with the `Admin` role
- Non-admin authenticated users receive an access-denied UI instead of the admin screen

### Fallback Route

- `*` renders the not-found page

## Main User Flows

### Authentication

- Session state is restored from `localStorage` on app boot
- Protected routes redirect unauthenticated users to `/login`
- Guest routes redirect authenticated users to `/dashboard`
- Disabled accounts are blocked at the mock API layer

### Customer Management

- Customers can be created, edited, viewed, and deleted
- List filtering supports text search, status filtering, stage filtering, and sorting
- Customer forms validate required fields before submission
- Updating a customer prepends a timeline event and can append note entries

### Profile Management

- Users can update name, email, phone, and job title
- Users can change password with current-password validation

### Admin Management

- Admins can list all users
- Admins can change user roles
- Admins can enable or disable user access
- Admins can invite new users directly from the UI

## Seeded Data

On first run, the app initializes a local mock database with:

- 4 users
- 10 customers
- 3 tasks
- 3 notifications

The seeded customer records include:

- Contact and company metadata
- CRM status and pipeline stage
- Deal value and deal objects
- Timeline activity
- Note history
- Ownership metadata
- Location and industry fields

## Tech Stack

| Area | Tools |
| --- | --- |
| Build tool | Vite |
| UI library | React 18 |
| Routing | React Router 6 |
| Styling | Tailwind CSS |
| HTTP layer | Axios |
| Charts | Recharts |
| Icons | Lucide React |
| State | React Context + custom hooks |
| Persistence | Browser `localStorage` |

## Architecture Overview

The application is split into clear layers:

```text
src/
  components/
    common/      shared data-display components
    forms/       reusable form building blocks
    layout/      sidebar and topbar shell components
    ui/          low-level UI primitives
  context/       auth and UI providers
  hooks/         reusable stateful logic
  layouts/       protected app shell
  pages/         route-level screens
  routes/        route definitions and guards
  services/      mock API client and feature services
  utils/         constants, seed data, formatters, validation
```

### Context Providers

- `AuthContext` manages session restore, login, registration, logout, profile updates, and password changes
- `UIContext` manages sidebar state, theme preference persistence, and toast notifications

### Service Layer

- `apiClient.js` configures Axios with a `/api` base URL
- `mockServer.js` attaches a custom Axios adapter to simulate backend endpoints and latency
- `authService.js`, `customerService.js`, `dashboardService.js`, and `adminService.js` wrap feature-specific requests

### Hooks

- `useAuth` exposes the authentication context
- `useCustomers` centralizes customer fetching and local list mutation
- `useDebounce` supports responsive search
- `useModal` manages dialog visibility
- `useLocalStorage` supports browser persistence where needed

## Mock API Contract

All requests stay in the browser through the Axios mock adapter.

### Auth Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/auth/login` | Sign in |
| `POST` | `/auth/register` | Create account |
| `GET` | `/auth/me` | Restore current user |
| `PATCH` | `/auth/profile` | Update profile |
| `POST` | `/auth/change-password` | Update password |
| `POST` | `/auth/logout` | End session |

### Dashboard Endpoint

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/dashboard/summary` | Load summary data for the dashboard |

### Customer Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/customers` | List customers |
| `POST` | `/customers` | Create customer |
| `GET` | `/customers/:id` | Read customer detail |
| `PATCH` | `/customers/:id` | Update customer |
| `DELETE` | `/customers/:id` | Delete customer |

### Admin Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/users` | List users |
| `POST` | `/users/invite` | Invite a user |
| `PATCH` | `/users/:id` | Update role or active state |

## Validation Rules

### Login

- Email is required and must be valid
- Password is required

### Registration

- Full name is required
- Email is required and must be valid
- Password must be at least 8 characters
- Password confirmation must match

### Customer Form

- Full name is required
- Email is required and must be valid
- Phone is required
- Company is required
- Status is required
- Stage is required
- Deal value must be numeric and non-negative

### Password Change

- Current password is required
- New password must be at least 8 characters
- Confirmation must match the new password

## Local Persistence

The app stores everything in the browser:

| Key | Purpose |
| --- | --- |
| `controllusion_db_v1` | Mock database with users, customers, tasks, and notifications |
| `controllusion_session_v1` | Active session token and user ID |
| `controllusion_preferences_v1` | UI preferences such as theme |

### Resetting the App

To restore the original seeded state:

1. Open your browser devtools.
2. Clear the three `controllusion_*` keys from `localStorage`.
3. Refresh the page.

## Styling Notes

- The UI follows a bright blue-and-white admin dashboard direction
- Shared card, table, form, and shell patterns are reused across routes
- The app is responsive and adapts the customer table into mobile cards on smaller screens

## Deployment Notes

This project is a static SPA and can be deployed to:

- Vercel
- Netlify
- GitHub Pages
- Any static host with SPA route fallback support

### Important Deployment Requirement

Because the app uses client-side routing, unknown paths must rewrite to `index.html`.

### Data Persistence in Production

There is still no server in production. Data remains per-browser because the mock backend is implemented with `localStorage`.

## Limitations

- There is no real backend or multi-user synchronization
- Data is isolated to the current browser profile
- Sessions are mock tokens only
- Invited users and record changes do not exist outside local browser storage
- Theme persistence exists, but the current UI normalizes the theme to light mode

## Troubleshooting

### The app looks empty after changes

Clear the `controllusion_*` keys in `localStorage` and reload to restore seed data.

### I cannot access the admin panel

Sign in with the admin demo account or promote a user from the seeded admin session.

### A seeded account cannot log in

`olivia@controllusion.com` is intentionally inactive and should be rejected by the mock API.

## Repository Notes

- This repo is intended to be easy to demo locally
- The mock API design keeps the UI architecture close to a real production React app
- Replacing the mock server with a real backend can be done incrementally by preserving the service layer shape
