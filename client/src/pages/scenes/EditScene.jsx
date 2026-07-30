import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SceneForm from "../../components/scenes/SceneForm";
import ProjectFormHeader from "../../components/projects/ProjectFormHeader";
import { ErrorState, Loader } from "../../components/ui";
import { getSceneById } from "../../services/sceneApi";
import { updateScene } from "../../services/sceneApi";

const EditScene = () => {
  const { projectId, sceneId } = useParams();
  const navigate = useNavigate();

  // const [project, setProject] = useState(null);
  // const [characters, setCharacters] = useState(null);
  // const [locations, setLocations] = useState(null);
  const [scene, setScene] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadScene = async () => {
      try {
        setIsLoading(true);
        setLoadError("");

        const sceneData = await getSceneById(projectId, sceneId);
        setScene(sceneData);
        console.log("Scene loaded:", sceneData);
      } catch (error) {
        setLoadError(error.message || "Unable to load the scene.");
      } finally {
        setIsLoading(false);
      }
    };

    loadScene();
  }, [projectId, sceneId]);

  const handleUpdateProject = async (sceneData) => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError("");

      const updatedScene = await updateScene(projectId, sceneId, sceneData);

      console.log("Updated scene:", updatedScene);

      if (!updatedScene?.id) {
        throw new Error(
          "The scene was updated, but the API did not return its ID.",
        );
      }

      navigate(`/projects/${projectId}/scenes/${updatedScene.id}`, {
        replace: true,
        state: {
          message: "Scene updated successfully.",
        },
      });
    } catch (error) {
      setApiError(error.message || "Unable to update the scene.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader text="Loading scene..." />;
  }

  if (loadError) {
    return <ErrorState message={loadError} onRetry={loadScene} />;
  }

  return (
    <main className="page-container">
      <ProjectFormHeader
        eyebrow="Scene settings"
        title={`Edit ${scene.name}`}
        description="Update the information for this scene."
      />

      <SceneForm
        initialValues={scene}
        onSubmit={handleUpdateProject}
        projectId={projectId}
        onCancel={() => navigate(`/projects/${projectId}/scenes`)}
        submitLabel="Save Changes"
        isSubmitting={isSubmitting}
        apiError={apiError}
      />
    </main>
  );
};

export default EditScene;
