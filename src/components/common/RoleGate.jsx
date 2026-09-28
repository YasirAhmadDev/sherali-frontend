import { useAuth } from "@/hooks/useAuth";

// Shows children only for the given roles. This only hides things in the UI,
// the backend enforces the real permissions.
//   <RoleGate roles={STAFF_ROLES}><Button>Add New Accident</Button></RoleGate>
export default function RoleGate({ roles, children, fallback = null }) {
  const { user } = useAuth();
  return user && roles.includes(user.role) ? children : fallback;
}