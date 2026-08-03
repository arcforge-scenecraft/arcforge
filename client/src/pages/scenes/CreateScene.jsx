import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SceneForm from "../../components/scenes/SceneForm";
import ProjectFormHeader from "../../components/projects/ProjectFormHeader";
import { createScene } from "../../services/sceneApi";
import { assignCharacterToScene } from "../../services/scene-characterApi";

const CreateScene = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateScene = async (sceneData, characterData) => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError("");

      const createdScene = await createScene(projectId, sceneData);

      if (!createdScene?.id) {
        throw new Error(
          "The scene was created, but the API did not return its ID.",
        );
      }

        if (createdScene && createdScene.id) {
            for (let i = 0; i < characterData.length; i++) {
                if (characterData[i] != -1) {
                    try {
                        const newSceneCharacter = await assignCharacterToScene(projectId, createdScene.id, {
                        character_id: characterData[i],
                        role_in_scene: "",
                        knowledge_gained: "",});
                    } catch (error) {
                        setApiError(error.message || "Unable to create the scene-character assignments.")
                    }
                }
            }
        }

        navigate(`/projects/${projectId}/scenes`, {
        replace: true,
        state: {
          notification: {
            type: "success",
            message: "Scene created successfully.",
          }
        },
      });
    } catch (error) {
      setApiError(error.message || "Unable to create the scene.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-container">
      <ProjectFormHeader
        eyebrow="New Scene"
        title="Create a scene"
        description="Add the basic information for your new scene."
      />

      <SceneForm
        onSubmit={handleCreateScene}
        projectId={projectId}
        onCancel={() => navigate(`/projects/${projectId}/scenes`)}
        submitLabel="Create Scene"
        isSubmitting={isSubmitting}
        apiError={apiError}
      />
    </main>
  );
};

export default CreateScene;
