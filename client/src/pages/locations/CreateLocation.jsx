import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LocationForm from "../../components/locations/LocationForm";
import ProjectFormHeader from "../../components/projects/ProjectFormHeader";
import { createLocation } from "../../services/locationApi";

const CreateLocation = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleCreateLocation = async (locationData) => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError("");

      const createdLocation = await createLocation(projectId, locationData);

      if (!createdLocation?.id) {
        throw new Error(
          "The location was created, but the API did not return its ID.",
        );
      }

      navigate(`/projects/${projectId}/locations/${createdLocation.id}`, {
        replace: true,
        state: {
          message: "Location created successfully.",
        },
      });
    } catch (error) {
      setApiError(error.message || "Unable to create the location.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-container">
      <ProjectFormHeader
        eyebrow="New location"
        title="Create a location"
        description="Add a reusable location to the selected story project."
      />

      <LocationForm
        onSubmit={handleCreateLocation}
        onCancel={() => navigate(`/projects/${projectId}/locations`)}
        submitLabel="Create Location"
        isSubmitting={isSubmitting}
        apiError={apiError}
      />
    </main>
  );
};

export default CreateLocation;
