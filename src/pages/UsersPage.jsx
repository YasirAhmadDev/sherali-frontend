import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Users } from "lucide-react";
import toast from "react-hot-toast";

import { getErrorMessage } from "@/api/axios";
import { createUser, getUsers, resetUserPassword, updateUser } from "@/api/users.api";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetch } from "@/hooks/useFetch";
import { useOptions } from "@/hooks/useOptions";
import { PAGE_SIZE, ROLE_VALUES } from "@/utils/constants";
import { cleanParams } from "@/utils/params";

import Alert from "@/components/common/Alert";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import { inputBase, inputClass } from "@/components/common/FormField";
import Loader from "@/components/common/Loader";
import Modal from "@/components/common/Modal";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import ResetPasswordForm from "@/components/users/ResetPasswordForm";
import UserForm from "@/components/users/UserForm";
import UserTable from "@/components/users/UserTable";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const { t } = useTranslation();
  const roleOptions = useOptions(ROLE_VALUES, "roles");

  const [filters, setFilters] = useState({ search: "", role: "", status: "" });
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(filters.search);

  const [formModal, setFormModal] = useState(null); // null | {} (create) | { user } (edit)
  const [resetTarget, setResetTarget] = useState(null);
  const [toDisable, setToDisable] = useState(null);
  const [busy, setBusy] = useState(false);

  const params = useMemo(
    () =>
      cleanParams({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        role: filters.role,
        isActive: filters.status,
      }),
    [page, debouncedSearch, filters.role, filters.status]
  );

  const { data, loading, error, reload } = useFetch(() => getUsers(params), [JSON.stringify(params)]);

  const changeFilter = (name, value) => {
    setFilters((f) => ({ ...f, [name]: value }));
    setPage(1);
  };

  const handleSave = async (payload) => {
    if (formModal.user) {
      await updateUser(formModal.user._id, payload);
      toast.success("User updated");
    } else {
      await createUser(payload);
      toast.success("User created. Give them the temporary password.");
    }
    setFormModal(null);
    reload();
  };

  const handleReset = async (newPassword) => {
    await resetUserPassword(resetTarget._id, newPassword);
    toast.success("Password reset");
    setResetTarget(null);
    reload();
  };

  const setActive = async (user, isActive) => {
    setBusy(true);
    try {
      await updateUser(user._id, { isActive });
      toast.success(isActive ? "User enabled" : "User disabled");
      setToDisable(null);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleToggle = (user) => (user.isActive ? setToDisable(user) : setActive(user, true));

  return (
    <>
      <PageHeader
        title={t("nav.users")}
        subtitle="Create accounts and choose each person's role"
        action={
          <Button icon={Plus} onClick={() => setFormModal({})}>
            Add User
          </Button>
        }
      />

      <Card className="mb-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-subtle" />
            <input
              value={filters.search}
              onChange={(e) => changeFilter("search", e.target.value)}
              placeholder="Search name, email or badge..."
              className={`${inputBase} ps-10 pe-3`}
              aria-label="Search users"
            />
          </div>

          <select
            value={filters.role}
            onChange={(e) => changeFilter("role", e.target.value)}
            className={inputClass}
            aria-label="Filter by role"
          >
            <option value="">All roles</option>
            {roleOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => changeFilter("status", e.target.value)}
            className={inputClass}
            aria-label="Filter by status"
          >
            <option value="">Any status</option>
            <option value="true">Active</option>
            <option value="false">Disabled</option>
          </select>
        </div>
      </Card>

      {error && <Alert className="mb-4">{error}</Alert>}
      {!data && loading && <Loader />}

      {data && (
        <div className={`transition-opacity ${loading ? "opacity-60" : ""}`}>
          {data.data.length === 0 ? (
            <EmptyState icon={Users} title="No users found" message="Try changing the search or the filters." />
          ) : (
            <>
              <UserTable
                users={data.data}
                currentUser={currentUser}
                onEdit={(user) => setFormModal({ user })}
                onResetPassword={setResetTarget}
                onToggleActive={handleToggle}
              />
              <Pagination
                page={data.pagination.page}
                pages={data.pagination.pages}
                total={data.pagination.total}
                limit={data.pagination.limit}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      )}

      <Modal
        open={Boolean(formModal)}
        onClose={() => setFormModal(null)}
        title={formModal?.user ? "Edit user" : "Add user"}
      >
        {formModal && (
          <UserForm
            user={formModal.user}
            isSelf={formModal.user?._id === currentUser._id}
            onSubmit={handleSave}
            onCancel={() => setFormModal(null)}
          />
        )}
      </Modal>

      <Modal open={Boolean(resetTarget)} onClose={() => setResetTarget(null)} title="Reset password">
        {resetTarget && (
          <ResetPasswordForm user={resetTarget} onSubmit={handleReset} onCancel={() => setResetTarget(null)} />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDisable)}
        danger
        title="Disable this user?"
        message={`${toDisable?.name} will not be able to log in. Their records stay in the system. You can enable them again later.`}
        confirmLabel="Disable"
        loading={busy}
        onConfirm={() => setActive(toDisable, false)}
        onCancel={() => setToDisable(null)}
      />
    </>
  );
}