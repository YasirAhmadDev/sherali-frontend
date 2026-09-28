import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createAccident, uploadPhotos } from "@/api/accidents.api";
import { getErrorMessage } from "@/api/axios";
import { getLocations } from "@/api/locations.api";
import { useFetch } from "@/hooks/useFetch";

import AccidentForm from "@/components/accidents/AccidentForm";
import Alert from "@/components/common/Alert";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";

export default function AddAccidentPage() {
  const navigate = useNavigate();
  const { data: locations, loading, error } = useFetch(() => getLocations({ isActive: "true" }), []);

  const handleSubmit = async (payload, { newFiles }) => {
    const accident = await createAccident(payload);

    if (newFiles.length > 0) {
      try {
        await uploadPhotos(accident._id, newFiles);
      } catch (err) {
        // The record is saved, only the photos failed: let the officer retry from the edit page
        toast.error(`Accident saved, but photos failed: ${getErrorMessage(err)}`);
        navigate(`/accidents/${accident._id}/edit`, { replace: true });
        return;
      }
    }

    toast.success("Accident saved");
    navigate(`/accidents/${accident._id}`, { replace: true });
  };

  return (
    <>
      <PageHeader title="Add New Accident" subtitle="Fill in the details of the accident" />

      {loading && <Loader />}
      {error && <Alert>{error}</Alert>}
      {locations && (
        <AccidentForm locations={locations} onSubmit={handleSubmit} onCancel={() => navigate(-1)} />
      )}
    </>
  );
}