import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/common/Loader";

// Usage in AppRoutes:
//   <Route element={<ProtectedRoute />}>                       -> any logged in user
//   <Route element={<ProtectedRoute roles={["admin"]} />}>     -> admin only
export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader fullScreen />;

  // 1. Not logged in
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  // 2. First login: password must be changed before anything else
  if (user.mustChangePassword && location.pathname !== "/change-password") {
    return <Navigate to="/change-password" replace />;
  }

  // 3. Logged in, but this role is not allowed here
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
        <h1 className="text-2xl font-bold text-fg">Not allowed</h1>
        <p className="text-muted">Your role does not have access to this page.</p>
        <Link to="/dashboard" className="text-accent hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return <Outlet />;
}