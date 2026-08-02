import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SceneForm from "../../components/scenes/SceneForm";
import ProjectFormHeader from "../../components/projects/ProjectFormHeader";
import { ErrorState, Loader } from "../../components/ui";
import useScene from "../../hooks/scenes/useScene";
import { updateScene } from "../../services/sceneApi";
import NotFound from "../NotFound";

const EditScene = () => {
  const { projectId, sceneId } = useParams();
  const navigate = useNavigate();

  const { scene, loading, error, notFound, retry } = useScene(
    projectId,
    sceneId,
  );

  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateScene = async (sceneData) => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError("");

      const updatedScene = await updateScene(projectId, sceneId, sceneData);

      if (!updatedScene?.id) {
        throw new Error(
          "The scene was updated, but the API did not return its ID.",
        );
      }

      navigate(`/projects/${projectId}/scenes/${updatedScene.id}`, {
        replace: true,
        state: {
          notification: {
            type: "success",
            message: "Scene updated successfully.",
          },
        },
      });
    } catch (submitError) {
      setApiError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to update the scene.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading scene..." />;
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
        eyebrow="Scene settings"
        title={`Edit ${scene.name}`}
        description="Update the events, order, location, characters, and planning notes for this scene."
      />

      <SceneForm
        initialValues={scene}
        onSubmit={handleUpdateScene}
        projectId={projectId}
        onCancel={() => navigate(`/projects/${projectId}/scenes/${sceneId}`)}
        submitLabel="Save Changes"
        isSubmitting={isSubmitting}
        apiError={apiError}
      />
    </main>
  );
};

export default EditScene;
