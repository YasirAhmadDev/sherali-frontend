import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Car, Plus } from "lucide-react";
import toast from "react-hot-toast";

import { deleteAccident, getAccidents } from "@/api/accidents.api";
import { getErrorMessage } from "@/api/axios";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetch } from "@/hooks/useFetch";
import { PAGE_SIZE, STAFF_ROLES } from "@/utils/constants";

import AccidentFilters, { EMPTY_FILTERS } from "@/components/accidents/AccidentFilters";
import AccidentTable from "@/components/accidents/AccidentTable";
import Alert from "@/components/common/Alert";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import RoleGate from "@/components/common/RoleGate";

export default function AccidentsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // The search box waits until the user stops typing
  const debouncedSearch = useDebounce(filters.search);

  // Query sent to the API (empty values are removed)
  const params = useMemo(() => {
    const all = { ...filters, search: debouncedSearch, page, limit: PAGE_SIZE };
    return Object.fromEntries(Object.entries(all).filter(([, value]) => value !== ""));
  }, [filters, debouncedSearch, page]);

  const { data, loading, error, reload } = useFetch(() => getAccidents(params), [JSON.stringify(params)]);

  const handleFiltersChange = (next) => {
    setFilters(next);
    setPage(1);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAccident(toDelete._id);
      toast.success("Accident deleted");
      setToDelete(null);
      // If that was the last item on this page, go back one page
      if (data.data.length === 1 && page > 1) setPage(page - 1);
      else reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const addButton = (
    <RoleGate roles={STAFF_ROLES}>
      <Button icon={Plus} onClick={() => navigate("/accidents/new")}>
        {t("dashboard.addNewAccident")}
      </Button>
    </RoleGate>
  );

  return (
    <>
      <PageHeader title={t("nav.accidents")} subtitle="Search, filter and manage accident records" action={addButton} />

      <Card className="mb-4">
        <AccidentFilters filters={filters} onChange={handleFiltersChange} />
      </Card>

      {error && <Alert className="mb-4">{error}</Alert>}

      {!data && loading && <Loader />}

      {data && (
        <div className={`transition-opacity ${loading ? "opacity-60" : ""}`}>
          {data.data.length === 0 ? (
            <EmptyState
              icon={Car}
              title="No accidents found"
              message="Try changing or resetting the filters."
              action={
                Object.values(filters).some(Boolean) && (
                  <Button variant="secondary" onClick={() => handleFiltersChange(EMPTY_FILTERS)}>
                    Reset filters
                  </Button>
                )
              }
            />
          ) : (
            <>
              <AccidentTable accidents={data.data} user={user} onDelete={setToDelete} />
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

      <ConfirmDialog
        open={Boolean(toDelete)}
        danger
        title="Delete accident?"
        message="This record will be removed from the lists and statistics. Only an administrator can do this."
        confirmLabel={t("common.delete")}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}