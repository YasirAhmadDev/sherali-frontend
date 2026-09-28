import { ROLES } from "@/utils/constants";

// Admin edits everything. An officer edits only the accidents they created.
export const canEditAccident = (user, accident) => {
  if (!user) return false;
  if (user.role === ROLES.ADMIN) return true;
  if (user.role !== ROLES.OFFICER) return false;
  const ownerId = accident.createdBy?._id ?? accident.createdBy;
  return ownerId === user._id;
};

export const canDeleteAccident = (user) => user?.role === ROLES.ADMIN;