import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SceneForm from "../../components/scenes/SceneForm";
import ProjectFormHeader from "../../components/projects/ProjectFormHeader";
import { ErrorState, Loader } from "../../components/ui";
import { getSceneById } from "../../services/sceneApi";
import { updateScene } from "../../services/sceneApi";
import { assignCharacterToScene, deleteSceneCharacter, getSceneCharacters } from "../../services/scene-characterApi";
import { getCharacters } from "../../services/characterApi";

const EditScene = () => {
  const { projectId, sceneId } = useParams();
  const navigate = useNavigate();

  const [scene, setScene] = useState(null);
  const [initialCharacters, setInitialCharacters] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizeSceneValues = async () => {
    const values = await getSceneById(projectId, sceneId);
    const characterList = await getCharacters(projectId);

    // gets all characters in the project and puts them into a dictionary with names as keys and ids as values
    let characterDict = {};
    characterDict["Undecided"] = -1
    characterList.forEach(character => characterDict[character.name] = character.id);

    let sceneValues = {
      ...values,
      // Ensures characters variable an array of character ids for editing.
      characters: values.characters.map(name => characterDict[name])
    };

    setInitialCharacters(values.characters.map(name => characterDict[name]));

    console.log("Normalized Scene Values:", sceneValues);

    return (sceneValues)
  };

  const loadScene = async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const initialData = await getSceneById(projectId, sceneId);
      const characterList = await getCharacters(projectId);

      // gets all characters in the project and puts them into a dictionary with names as keys and ids as values
      let characterDict = {};
      characterDict["Undecided"] = -1
      characterList.forEach(character => characterDict[character.name] = character.id);

      let sceneData = {
        ...initialData,
        // Ensures characters variable an array of character ids for editing.
        characters: initialData.characters.map(name => characterDict[name])
      };

      setInitialCharacters(initialData.characters.map(name => characterDict[name]));

      setScene(sceneData);
      console.log("Scene loaded:", sceneData);
    } catch (error) {
      setLoadError(error.message || "Unable to load the scene.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadScene();
  }, [projectId, sceneId]);

  const handleUpdateProject = async (sceneData, characterData) => {
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

      if (updatedScene && updatedScene.id) {
        console.log("About to update scene-character assignments for scene", updatedScene.id, "in project", projectId, "with these character ids:", characterData)

        console.log("Remember, these are the initial character ids:", initialCharacters);

        // const currentSceneCharacters = await getSceneCharacters(projectId, updatedScene.id)
        // currentSceneCharacters = currentSceneCharacters.map(character => character.character_id);

        // console.log("Current Scene Characters", currentSceneCharacters);

        for (let i = 0; i < characterData.length; i++) {
          if (characterData[i] != -1 && !initialCharacters.find(c => c === characterData[i])) {
            try {
              const newSceneCharacter = await assignCharacterToScene(projectId, updatedScene.id, {
                character_id: characterData[i],
                role_in_scene: "",
                knowledge_gained: "",
              });
              console.log("Added this scene-character assignment:", newSceneCharacter);
            } catch (error) {
              setApiError(error.message || "Unable to create the scene-character assignments.")
            }
          }
        }

        console.log("Trying to remove character-assignments from", initialCharacters, "to", characterData)


        for (let j = 0; j < initialCharacters.length; j++) {
          console.log("Is", initialCharacters[j], "in", characterData);
          if (!characterData.find(c => c === initialCharacters[j])) {
            console.log("About to remove character-assignments", initialCharacters[j])
            try {
              await deleteSceneCharacter(projectId, updatedScene.id, initialCharacters[j]);
              console.log("Successfully deleted character", initialCharacters[j], "from the scene.");
            } catch (error) {
              console.log(error.message || "Unable to delete character", initialCharacters[j], "from the scene.");
            }
          }
        }
      }

      navigate(`/projects/${projectId}/scenes/${updatedScene.id}`, {
        replace: true,
        state: {
          message: "Scene and scene-character connections updated successfully.",
        },
      });
    } catch (error) {
      setApiError(error.message || "Unable to update the scene or scene-character connections.");
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
