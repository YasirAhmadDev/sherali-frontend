import { Routes, Route, Navigate } from "react-router-dom";

import { ROLES, STAFF_ROLES } from "@/utils/constants";

import ProtectedRoute from "@/routes/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

import LoginPage from "@/pages/LoginPage";
import ChangePasswordPage from "@/pages/ChangePasswordPage";
import DashboardPage from "@/pages/DashboardPage";
import AccidentsPage from "@/pages/AccidentsPage";
import AccidentDetailPage from "@/pages/AccidentDetailPage";
import AddAccidentPage from "@/pages/AddAccidentPage";
import EditAccidentPage from "@/pages/EditAccidentPage";
import LocationsPage from "@/pages/LocationsPage";
import MapPage from "@/pages/MapPage";
import ReportsPage from "@/pages/ReportsPage";
import UsersPage from "@/pages/UsersPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Must be logged in */}
      <Route element={<ProtectedRoute />}>
        {/* Forced on first login, no sidebar */}
        <Route path="/change-password" element={<ChangePasswordPage />} />

        {/* Pages with sidebar + header */}
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* All roles */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="accidents" element={<AccidentsPage />} />
          <Route path="accidents/:id" element={<AccidentDetailPage />} />
          <Route path="locations" element={<LocationsPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="reports" element={<ReportsPage />} />

          {/* Admin + officer only */}
          <Route element={<ProtectedRoute roles={STAFF_ROLES} />}>
            <Route path="accidents/new" element={<AddAccidentPage />} />
            <Route path="accidents/:id/edit" element={<EditAccidentPage />} />
          </Route>

          {/* Admin only */}
          <Route element={<ProtectedRoute roles={[ROLES.ADMIN]} />}>
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
