import { NavLink, useNavigate } from "react-router-dom";
import { Car, FileText, LayoutDashboard, LogOut, MapPin, Map as MapIcon, Users } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/utils/constants";

// Items without `roles` are visible to everyone
const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/accidents", label: "Accidents", icon: Car },
  { to: "/locations", label: "Locations", icon: MapPin },
  { to: "/map", label: "Map", icon: MapIcon },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/users", label: "Users", icon: Users, roles: [ROLES.ADMIN] },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive ? "bg-brand text-white" : "text-muted hover:bg-line hover:text-fg"
  }`;

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const items = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Dark overlay behind the menu on mobile */}
      {open && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-line bg-panel p-3 transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-1 flex-col gap-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass} onClick={onClose}>
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-line hover:text-fg"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>
    </>
  );
}