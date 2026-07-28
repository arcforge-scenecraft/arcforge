import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LocationForm from "../../components/locations/LocationForm";
import ProjectFormHeader from "../../components/projects/ProjectFormHeader";
import { ErrorState, Loader } from "../../components/ui";
import useLocation from "../../hooks/locations/useLocation";
import { updateLocation } from "../../services/locationApi";
import NotFound from "../NotFound";

const EditLocation = () => {
  const { projectId, locationId } = useParams();
  const navigate = useNavigate();

  const { location, loading, error, notFound, retry } = useLocation(
    projectId,
    locationId,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleUpdateLocation = async (locationData) => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError("");

      const updatedLocation = await updateLocation(
        projectId,
        locationId,
        locationData,
      );

      if (!updatedLocation?.id) {
        throw new Error(
          "The location was updated, but the API did not return its ID.",
        );
      }

      navigate(`/projects/${projectId}/locations/${updatedLocation.id}`, {
        replace: true,
        state: {
          message: "Location updated successfully.",
        },
      });
    } catch (submitError) {
      setApiError(submitError.message || "Unable to update the location.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading location..." />;
  }

  if (notFound) {
    return <NotFound />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  return (
    <main className="page-container">
      <ProjectFormHeader
        eyebrow="Location settings"
        title={`Edit ${location.name}`}
        description="Update the description and atmosphere for this story location."
      />

      <LocationForm
        initialValues={location}
        onSubmit={handleUpdateLocation}
        onCancel={() =>
          navigate(`/projects/${projectId}/locations/${locationId}`)
        }
        submitLabel="Save Changes"
        isSubmitting={isSubmitting}
        apiError={apiError}
      />
    </main>
  );
};

export default EditLocation;
