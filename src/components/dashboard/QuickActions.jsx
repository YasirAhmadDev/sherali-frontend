import { Link } from "react-router-dom";
import { Car, ChevronRight, FileText, MapPin, Plus } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/common/Card";
import RoleGate from "@/components/common/RoleGate";
import { ROLES, STAFF_ROLES } from "@/utils/constants";

export default function QuickActions() {
  const { user } = useAuth();

  const links = [
    { to: "/accidents", label: "View All Accidents", icon: Car },
    {
      to: "/locations",
      label: user?.role === ROLES.ADMIN ? "Manage Locations" : "View Locations",
      icon: MapPin,
    },
    { to: "/reports", label: "Generate Report", icon: FileText },
  ];

  return (
    <Card>
      <RoleGate roles={STAFF_ROLES}>
        <Link
          to="/accidents/new"
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 font-medium text-white transition-colors hover:bg-green-700 dark:hover:bg-brand-light"
        >
          <Plus size={18} />
          Add New Accident
        </Link>
      </RoleGate>

      <h3 className="mb-2 font-semibold text-fg">Quick Actions</h3>
      <ul className="divide-y divide-line">
        {links.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex items-center gap-3 py-3 text-sm text-fg transition-colors hover:text-accent"
            >
              <Icon size={20} className="text-accent" />
              <span className="flex-1">{label}</span>
              <ChevronRight size={16} className="text-subtle rtl:rotate-180" />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}