import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ExternalLink, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { deleteAccident, getAccident } from "@/api/accidents.api";
import { getErrorMessage } from "@/api/axios";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { useOptions } from "@/hooks/useOptions";
import { ACCIDENT_CAUSE_VALUES, ACCIDENT_TYPE_VALUES, VEHICLE_TYPE_VALUES } from "@/utils/constants";
import { formatDateTime, labelFor } from "@/utils/formatters";
import { canDeleteAccident, canEditAccident } from "@/utils/permissions";

import PhotoGallery from "@/components/accidents/PhotoGallery";
import SeverityBadge from "@/components/accidents/SeverityBadge";
import Alert from "@/components/common/Alert";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";

function Info({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-fg">{children || "-"}</dd>
    </div>
  );
}

export default function AccidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const accidentTypes = useOptions(ACCIDENT_TYPE_VALUES, "accidentTypes");
  const accidentCauses = useOptions(ACCIDENT_CAUSE_VALUES, "accidentCauses");
  const vehicleTypes = useOptions(VEHICLE_TYPE_VALUES, "vehicleTypes");

  const { data: accident, loading, error } = useFetch(() => getAccident(id), [id]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (loading && !accident) return <Loader />;
  if (error) {
    return (
      <div className="space-y-3">
        <Alert>{error}</Alert>
        <Link to="/accidents" className="text-sm text-accent hover:underline">
          Back to accidents
        </Link>
      </div>
    );
  }
  if (!accident) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAccident(id);
      toast.success("Accident deleted");
      navigate("/accidents", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleting(false);
    }
  };

  // Viewers receive a reduced record: no vehicles list, photos, notes or officer
  const hasVehicleList = Array.isArray(accident.vehicles);
  const lat = accident.coordinates?.lat;
  const lng = accident.coordinates?.lng;
  const hasCoords = lat != null && lng != null;
  const mapLink = hasCoords
    ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`
    : null;

  const actions = (
    <div className="flex flex-wrap gap-2">
      {canEditAccident(user, accident) && (
        <Button variant="secondary" icon={Pencil} onClick={() => navigate(`/accidents/${id}/edit`)}>
          {t("common.edit")}
        </Button>
      )}
      {canDeleteAccident(user) && (
        <Button variant="danger" icon={Trash2} onClick={() => setConfirmDelete(true)}>
          {t("common.delete")}
        </Button>
      )}
    </div>
  );

  return (
    <>
      <Link to="/accidents" className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
        <ArrowLeft size={16} className="rtl:rotate-180" />
        Back to accidents
      </Link>

      <PageHeader
        title={accident.location?.name || accident.roadName || "Accident details"}
        subtitle={formatDateTime(accident.date)}
        action={actions}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left / main column */}
        <div className="space-y-6 lg:col-span-2">
          <Card title="Accident information" action={<SeverityBadge severity={accident.severity} />}>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Info label={t("table.type")}>{labelFor(accidentTypes, accident.type)}</Info>
              <Info label={t("table.cause")}>{labelFor(accidentCauses, accident.cause)}</Info>
              <Info label={t("table.injured")}>{accident.injured}</Info>
              <Info label={t("table.deaths")}>{accident.deaths}</Info>
            </dl>
          </Card>

          <Card title="Vehicles involved">
            {hasVehicleList ? (
              accident.vehicles.length === 0 ? (
                <p className="text-sm text-muted">No vehicles recorded.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {accident.vehicles.map((v, i) => (
                    <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                      <span className="text-fg">{labelFor(vehicleTypes, v.type)}</span>
                      <span className="font-mono text-muted">{v.plate || "No plate"}</span>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <p className="text-sm text-fg">{accident.vehicleCount} vehicle(s) involved</p>
            )}
          </Card>

          {accident.notes && (
            <Card title="Notes">
              <p className="whitespace-pre-wrap text-sm text-fg">{accident.notes}</p>
            </Card>
          )}

          {accident.photos?.length > 0 && (
            <Card title={`Photos (${accident.photos.length})`}>
              <PhotoGallery photos={accident.photos} />
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card title="Place">
            <dl className="space-y-4">
              <Info label={t("table.district")}>{accident.district}</Info>
              <Info label={t("table.location")}>{accident.location?.name}</Info>
              <Info label="Road">{accident.roadName}</Info>
              <Info label="Coordinates">{hasCoords ? `${lat}, ${lng}` : null}</Info>
            </dl>
            {mapLink && (
              <a href={mapLink} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
                Open in map <ExternalLink size={14} />
              </a>
            )}
          </Card>

          {accident.createdBy && (
            <Card title="Record">
              <dl className="space-y-4">
                <Info label="Entered by">
                  {accident.createdBy.name}
                  {accident.createdBy.badgeNumber ? ` (${accident.createdBy.badgeNumber})` : ""}
                </Info>
                <Info label="Created">{formatDateTime(accident.createdAt)}</Info>
                <Info label="Last updated">{formatDateTime(accident.updatedAt)}</Info>
              </dl>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        danger
        title="Delete accident?"
        message="This record will be removed from the lists and statistics."
        confirmLabel={t("common.delete")}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}