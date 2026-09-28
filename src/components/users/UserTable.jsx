import { KeyRound, Pencil, UserCheck, UserX } from "lucide-react";

import Badge from "@/components/common/Badge";
import Table, { tdClass, thClass } from "@/components/common/Table";
import { ROLE_OPTIONS } from "@/utils/constants";
import { formatDateTime, labelFor } from "@/utils/formatters";

const ROLE_COLORS = { admin: "red", officer: "blue", viewer: "gray" };
const iconButton = "rounded-lg p-2 text-muted transition-colors hover:bg-line hover:text-fg";

function StatusBadges({ user }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge color={user.isActive ? "green" : "red"}>{user.isActive ? "Active" : "Disabled"}</Badge>
      {user.mustChangePassword && <Badge color="yellow">Password change pending</Badge>}
    </div>
  );
}

// Phones: cards. Tablets and desktop: a table.
export default function UserTable({ users, currentUser, onEdit, onResetPassword, onToggleActive }) {
  const actions = (u) => {
    const isSelf = u._id === currentUser._id;
    return (
      <div className="flex items-center justify-end gap-1">
        <button onClick={() => onEdit(u)} className={iconButton} aria-label="Edit user">
          <Pencil size={16} />
        </button>
        <button onClick={() => onResetPassword(u)} className={iconButton} aria-label="Reset password">
          <KeyRound size={16} />
        </button>
        {!isSelf && (
          <button
            onClick={() => onToggleActive(u)}
            className={`${iconButton} ${u.isActive ? "hover:text-red-500" : "hover:text-accent"}`}
            aria-label={u.isActive ? "Disable user" : "Enable user"}
          >
            {u.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
          </button>
        )}
      </div>
    );
  };

  const roleBadge = (u) => (
    <Badge color={ROLE_COLORS[u.role]} className="capitalize">
      {labelFor(ROLE_OPTIONS, u.role)}
    </Badge>
  );

  return (
    <>
      {/* Phones */}
      <div className="space-y-3 md:hidden">
        {users.map((u) => (
          <div key={u._id} className="rounded-xl border border-line bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-semibold text-fg">{u.name}</p>
                <p className="truncate text-sm text-muted">{u.email}</p>
              </div>
              {roleBadge(u)}
            </div>
            <p className="mt-2 text-sm text-muted">
              {u.district || "No district"}
              {u.badgeNumber ? ` · Badge ${u.badgeNumber}` : ""}
            </p>
            <div className="mt-2">
              <StatusBadges user={u} />
            </div>
            <div className="mt-3 flex justify-end border-t border-line pt-2">{actions(u)}</div>
          </div>
        ))}
      </div>

      {/* Tablet + desktop */}
      <Table className="hidden md:block">
        <thead className="border-b border-line">
          <tr>
            <th className={thClass}>User</th>
            <th className={thClass}>Role</th>
            <th className={thClass}>District</th>
            <th className={`${thClass} hidden xl:table-cell`}>Badge</th>
            <th className={`${thClass} hidden lg:table-cell`}>Last login</th>
            <th className={thClass}>Status</th>
            <th className={thClass} />
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b border-line/60 last:border-0 hover:bg-line/40">
              <td className={tdClass}>
                <p className="font-medium text-fg">{u.name}</p>
                <p className="text-xs text-muted">{u.email}</p>
              </td>
              <td className={tdClass}>{roleBadge(u)}</td>
              <td className={`${tdClass} text-muted`}>{u.district || "-"}</td>
              <td className={`${tdClass} hidden text-muted xl:table-cell`}>{u.badgeNumber || "-"}</td>
              <td className={`${tdClass} hidden whitespace-nowrap text-muted lg:table-cell`}>
                {u.lastLoginAt ? formatDateTime(u.lastLoginAt) : "Never"}
              </td>
              <td className={tdClass}>
                <StatusBadges user={u} />
              </td>
              <td className={tdClass}>{actions(u)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}