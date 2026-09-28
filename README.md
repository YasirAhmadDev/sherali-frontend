# Client (React + Vite + Tailwind v4)

```bash
cd client
npm install
cp .env.example .env
npm run dev        # http://localhost:5173  (API calls to /api are proxied to http://localhost:5000)
```

Start the backend first (`cd server && npm run dev`).

## Conventions

- ES modules everywhere (`"type": "module"`).
- Components and pages are `.jsx`. Hooks, api, utils are `.js`.
- Components and pages use **default exports**. Hooks, api functions and constants use **named exports**.
- Imports use the `@` alias for `src`, no `../../`:
  ```jsx
  import Sidebar from "@/components/layout/Sidebar";
  import { useAuth } from "@/hooks/useAuth";
  import { ROLES } from "@/utils/constants";
  ```
- Tailwind theme colours (in `src/index.css`): `bg-app`, `bg-panel`, `bg-card`, `border-line`, `bg-brand`, `text-brand-light`.

## Folders

```
src/
├── main.jsx            entry: renders <App /> inside BrowserRouter
├── App.jsx             AuthProvider + AppRoutes + Toaster
├── index.css           Tailwind + theme colours + Leaflet css
├── routes/             AppRoutes (all routes), ProtectedRoute (login + role check)
├── context/            AuthContext
├── hooks/              useAuth, useFetch
├── api/                axios instance (done) + one file per backend resource
├── utils/              constants (done), formatters
├── i18n/               English / Dari / Pashto
├── components/
│   ├── layout/         AppLayout, Sidebar, Header
│   ├── common/         Button, Card, Badge, Modal, Table, Pagination, Loader,
│   │                   EmptyState, ConfirmDialog, FormField, PageHeader, RoleGate
│   ├── dashboard/      StatCard, MonthlyChart, RecentAccidents, QuickActions, CityBanner
│   ├── accidents/      AccidentForm, AccidentFilters, AccidentTable, VehicleFields,
│   │                   PhotoUploader, SeverityBadge
│   ├── locations/      LocationForm, LocationTable
│   ├── users/          UserForm, UserTable
│   ├── reports/        ReportFilters, SummaryTable
│   └── map/            AccidentMap
└── pages/              Login, ChangePassword, Dashboard, Accidents, AccidentDetail,
                        AddAccident, EditAccident, Locations, Map, Reports, Users, NotFound
```

## Status

Done: config, entry files, routing (with role groups), axios setup, constants.
Placeholders (each renders its own name): every component and page, plus AuthContext and ProtectedRoute.
