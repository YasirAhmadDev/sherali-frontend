import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { deletePhoto, getAccident, updateAccident, uploadPhotos } from "@/api/accidents.api";
import { getErrorMessage } from "@/api/axios";
import { getLocations } from "@/api/locations.api";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { canEditAccident } from "@/utils/permissions";

import AccidentForm from "@/components/accidents/AccidentForm";
import Alert from "@/components/common/Alert";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";

export default function EditAccidentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: accident, loading, error, updatedAt, reload } = useFetch(() => getAccident(id), [id]);
  const { data: activeLocations } = useFetch(() => getLocations({ isActive: "true" }), []);

  if (loading && !accident) return <Loader />;
  if (error) return <Alert>{error}</Alert>;
  if (!accident || !activeLocations) return <Loader />;

  if (!canEditAccident(user, accident)) {
    return (
      <div className="space-y-3">
        <Alert>You can only edit accidents that you created.</Alert>
        <Link to={`/accidents/${id}`} className="text-sm text-accent hover:underline">
          Back to accident
        </Link>
      </div>
    );
  }

  // If the accident's location was deactivated later, keep it selectable
  const locations =
    accident.location && !activeLocations.some((l) => l._id === accident.location._id)
      ? [...activeLocations, accident.location]
      : activeLocations;

  const handleSubmit = async (payload, { newFiles, removedPhotos }) => {
    await updateAccident(id, payload);

    try {
      for (const filename of removedPhotos) await deletePhoto(id, filename);
      if (newFiles.length > 0) await uploadPhotos(id, newFiles);
    } catch (err) {
      toast.error(`Changes saved, but photos failed: ${getErrorMessage(err)}`);
      reload(); // reload the record and reset the form
      return;
    }

    toast.success("Accident updated");
    navigate(`/accidents/${id}`, { replace: true });
  };

  return (
    <>
      <PageHeader title="Edit Accident" subtitle="Update the details of this record" />
      <AccidentForm
        key={updatedAt?.getTime()} // reloading the record gives the form a fresh start
        accident={accident}
        locations={locations}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </>
  );
}