import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CharacterForm from "../../components/characters/CharacterForm";
import ProjectFormHeader from "../../components/projects/ProjectFormHeader";
import { ErrorState, Loader } from "../../components/ui";
import useCharacter from "../../hooks/characters/useCharacter";
import { updateCharacter } from "../../services/characterApi";
import NotFound from "../NotFound";

const EditCharacter = () => {
  const { projectId, characterId } = useParams();
  const navigate = useNavigate();

  const { character, loading, error, notFound, retry } = useCharacter(
    projectId,
    characterId,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleUpdateCharacter = async (characterData) => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError("");

      const updatedCharacter = await updateCharacter(
        projectId,
        characterId,
        characterData,
      );

      if (!updatedCharacter?.id) {
        throw new Error(
          "The character was updated, but the API did not return its ID.",
        );
      }

      navigate(`/projects/${projectId}/characters/${updatedCharacter.id}`, {
        replace: true,
        state: {
          notification: {
            type: "success",
            message: "Character updated successfully.",
          },
        },
      });
    } catch (submitError) {
      setApiError(submitError.message || "Unable to update the character.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading character..." />;
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
        eyebrow="Character settings"
        title={`Edit ${character.name}`}
        description="Update the role, description, goal, and knowledge notes for this character."
      />

      <CharacterForm
        initialValues={character}
        onSubmit={handleUpdateCharacter}
        onCancel={() =>
          navigate(`/projects/${projectId}/characters/${characterId}`)
        }
        submitLabel="Save Changes"
        isSubmitting={isSubmitting}
        apiError={apiError}
      />
    </main>
  );
};

export default EditCharacter;
