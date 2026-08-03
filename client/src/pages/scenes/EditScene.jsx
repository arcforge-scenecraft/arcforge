import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SceneForm from "../../components/scenes/SceneForm";
import ProjectFormHeader from "../../components/projects/ProjectFormHeader";
import { ErrorState, Loader } from "../../components/ui";
import useScene from "../../hooks/scenes/useScene";
import { updateScene } from "../../services/sceneApi";
import { assignCharacterToScene, deleteSceneCharacter, getSceneCharacters } from "../../services/scene-characterApi";
import { getCharacters } from "../../services/characterApi";
import NotFound from "../NotFound";

const EditScene = () => {
  const { projectId, sceneId } = useParams();
  const navigate = useNavigate();

  const [initialCharacters, setInitialCharacters] = useState(null);
  const { scene, setScene, loading, setLoading, error, notFound, retry } = useScene(
    projectId,
    sceneId,
    false
  );

  const [sceneForm, setSceneForm] = useState(null);
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const modifyScene = async () => {
      try {
        setApiError("");

        const characterList = await getCharacters(projectId);

        // gets all characters in the project and puts them into a dictionary with names as keys and ids as values
        let characterDict = {};
        characterDict["Undecided"] = -1
        characterList.forEach(character => characterDict[character.name] = character.id);

        const modifiedCharacters = scene.characters.map(name => characterDict[name]);
        let sceneData = {
          ...scene,
          // Ensures characters variable an array of character ids for editing.
          characters: modifiedCharacters ? modifiedCharacters : [-1]
        };

        if (modifiedCharacters && modifiedCharacters != []) {
          setInitialCharacters(scene.characters.map(name => characterDict[name]));
        } else {
          setInitialCharacters([-1]);
        }

        setSceneForm(sceneData);
      } catch (error) {
        setApiError(error.message || "Unable to load the scene.");
      } finally {
        setIsLoading(false);
      }
    };

    if (scene && !loading && !error) {
      modifyScene();
    }
  }, [projectId, sceneId, scene]);

  const handleUpdateScene = async (sceneData, characterData) => {
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

      if (updatedScene && updatedScene.id) {
        if (Array.isArray(characterData)) {
          for (let i = 0; i < characterData.length; i++) {
            if (characterData[i] != -1 && !initialCharacters.find(c => c === characterData[i])) {
              try {
                const newSceneCharacter = await assignCharacterToScene(projectId, updatedScene.id, {
                  character_id: characterData[i],
                  role_in_scene: "",
                  knowledge_gained: "",
                });
              } catch (error) {
                setApiError(error.message || "Unable to create the scene-character assignments.")
              }
            }
          }
        }

        if (Array.isArray(initialCharacters)) {
          for (let j = 0; j < initialCharacters.length; j++) {
            if (initialCharacters[j] != -1 && !characterData.find(c => c === initialCharacters[j])) {
              try {
                await deleteSceneCharacter(projectId, updatedScene.id, initialCharacters[j]);
              } catch (error) {
                console.log(error.message || "Unable to delete character", initialCharacters[j], "from the scene.");
              }
            }
          }
        }
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

  if (loading || isLoading) {
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
        initialValues={sceneForm}
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
