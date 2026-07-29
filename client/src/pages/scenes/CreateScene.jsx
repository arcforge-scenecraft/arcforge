import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SceneForm from "../../components/scenes/SceneForm";
import ProjectFormHeader from "../../components/projects/ProjectFormHeader";
import { ErrorState, Loader } from "../../components/ui";
import { createScene } from "../../services/sceneApi";

const CreateScene = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [characters, setCharacters] = useState(null); // currently no characters api routes
  const [locations, setLocations] = useState(null);

//   const [isLoading, setIsLoading] = useState(true);
//   const [loadError, setLoadError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

//   const loadInfo = async () => {
//     try {
//       setIsLoading(true);
//       setLoadError("");

//       const locationData = await getLocations(projectId);
//       setLocations(locationData);
//       // add real character data from api when available
//       const characterData = ["Character 1", "Character 2"]; 
//       setCharacters(characterData)
//     } catch (error) {
//       setLoadError(error.message || "Unable to load the location and character data.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadInfo();
//   }, [projectId]);

   const handleCreateScene = async (sceneData) => {

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError("");

      console.log("About to call createScene for project", projectId, "and sceneData:", sceneData)

      const createdScene = await createScene(projectId, sceneData);

      if (!createdScene?.id) {
        throw new Error(
          "The scene was created, but the API did not return its ID.",
        );
      }

      navigate(`/projects/${projectId}/scenes`, {
        replace: true,
        state: {
          message: "Scene created successfully.",
        },
      });
    } catch (error) {
      setApiError(error.message || "Unable to create the scene.");
    } finally {
      setIsSubmitting(false);
    }
  };

//   if (isLoading) {
//     return <Loader text="Loading scene creator..." />;
//   }

//   if (loadError) {
//     return <ErrorState message={loadError} onRetry={loadInfo} />;
//   }

  return (
    <main className="page-container">
      <ProjectFormHeader
        eyebrow={projectId}
        title="Create a scene"
        description="Add the basic information for your new scene."
      />

      <SceneForm
        onSubmit={handleCreateScene}
        projectId={projectId}
        onCancel={() => navigate(`/projects/${projectId}`)}
        submitLabel="Create Scene"
        isSubmitting={isSubmitting}
        apiError={apiError}
      />
    </main>
  );
};

export default CreateScene;
