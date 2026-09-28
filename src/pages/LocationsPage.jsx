import { useMemo, useState } from "react";
import { MapPin, Plus, Search } from "lucide-react";
import toast from "react-hot-toast";

import { getErrorMessage } from "@/api/axios";
import { createLocation, deactivateLocation, getLocations, updateLocation } from "@/api/locations.api";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetch } from "@/hooks/useFetch";
import { DISTRICT_OPTIONS, ROLES } from "@/utils/constants";

import Alert from "@/components/common/Alert";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import { inputBase, inputClass } from "@/components/common/FormField";
import Loader from "@/components/common/Loader";
import Modal from "@/components/common/Modal";
import PageHeader from "@/components/common/PageHeader";
import LocationForm from "@/components/locations/LocationForm";
import LocationTable from "@/components/locations/LocationTable";

export default function LocationsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;

  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [status, setStatus] = useState("true"); // "true" | "false" | "all" (admin only)
  const debouncedSearch = useDebounce(search);

  const [formModal, setFormModal] = useState(null); // null | { location? }
  const [toDeactivate, setToDeactivate] = useState(null);
  const [busy, setBusy] = useState(false);

  const params = useMemo(() => {
    const p = {};
    if (debouncedSearch) p.search = debouncedSearch;
    if (district) p.district = district;
    const effectiveStatus = isAdmin ? status : "true"; // only admins can see inactive ones
    if (effectiveStatus !== "all") p.isActive = effectiveStatus;
    return p;
  }, [debouncedSearch, district, status, isAdmin]);

  const { data: locations, loading, error, reload } = useFetch(() => getLocations(params), [
    JSON.stringify(params),
  ]);

  const handleSave = async (payload) => {
    if (formModal.location) {
      await updateLocation(formModal.location._id, payload);
      toast.success("Location updated");
    } else {
      await createLocation(payload);
      toast.success("Location added");
    }
    setFormModal(null);
    reload();
  };

  const handleDeactivate = async () => {
    setBusy(true);
    try {
      await deactivateLocation(toDeactivate._id);
      toast.success("Location deactivated");
      setToDeactivate(null);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleActivate = async (location) => {
    try {
      await updateLocation(location._id, { isActive: true });
      toast.success("Location activated");
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <>
      <PageHeader
        title="Locations"
        subtitle="Known places where accidents are recorded. Officers pick from this list."
        action={
          isAdmin && (
            <Button icon={Plus} onClick={() => setFormModal({})}>
              Add Location
            </Button>
          )
        }
      />

      <Card className="mb-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-subtle" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className={`${inputBase} ps-10 pe-3`}
              aria-label="Search locations"
            />
          </div>

          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className={inputClass}
            aria-label="Filter by district"
          >
            <option value="">All districts</option>
            {DISTRICT_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>

          {isAdmin && (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
              aria-label="Filter by status"
            >
              <option value="true">Active only</option>
              <option value="false">Inactive only</option>
              <option value="all">All</option>
            </select>
          )}
        </div>
      </Card>

      {error && <Alert className="mb-4">{error}</Alert>}
      {!locations && loading && <Loader />}

      {locations && (
        <div className={`transition-opacity ${loading ? "opacity-60" : ""}`}>
          {locations.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No locations found"
              message={isAdmin ? "Add the first location, or change the filters." : "Try changing the filters."}
              action={
                isAdmin && (
                  <Button icon={Plus} onClick={() => setFormModal({})}>
                    Add Location
                  </Button>
                )
              }
            />
          ) : (
            <>
              <p className="mb-3 text-sm text-muted">
                {locations.length} location{locations.length === 1 ? "" : "s"}
              </p>
              <LocationTable
                locations={locations}
                isAdmin={isAdmin}
                onEdit={(location) => setFormModal({ location })}
                onDeactivate={setToDeactivate}
                onActivate={handleActivate}
              />
            </>
          )}
        </div>
      )}

      <Modal
        open={Boolean(formModal)}
        onClose={() => setFormModal(null)}
        title={formModal?.location ? "Edit location" : "Add location"}
      >
        {formModal && (
          <LocationForm location={formModal.location} onSubmit={handleSave} onCancel={() => setFormModal(null)} />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDeactivate)}
        danger
        title="Deactivate location?"
        message={`"${toDeactivate?.name}" will no longer appear in the accident form. Existing accidents keep it. You can activate it again later.`}
        confirmLabel="Deactivate"
        loading={busy}
        onConfirm={handleDeactivate}
        onCancel={() => setToDeactivate(null)}
      />
    </>
  );
}