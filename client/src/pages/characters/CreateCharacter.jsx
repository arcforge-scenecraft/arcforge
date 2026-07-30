import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CharacterForm from "../../components/characters/CharacterForm";
import ProjectFormHeader from "../../components/projects/ProjectFormHeader";
import { createCharacter } from "../../services/characterApi";

const CreateCharacter = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleCreateCharacter = async (characterData) => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError("");

      const createdCharacter = await createCharacter(projectId, characterData);

      if (!createdCharacter?.id) {
        throw new Error(
          "The character was created, but the API did not return its ID.",
        );
      }

      navigate(`/projects/${projectId}/characters/${createdCharacter.id}`, {
        replace: true,
        state: {
          message: "Character created successfully.",
        },
      });
    } catch (error) {
      setApiError(error.message || "Unable to create the character.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-container">
      <ProjectFormHeader
        eyebrow="New character"
        title="Create a character"
        description="Add a character to the selected story project."
      />

      <CharacterForm
        onSubmit={handleCreateCharacter}
        onCancel={() => navigate(`/projects/${projectId}/characters`)}
        submitLabel="Create Character"
        isSubmitting={isSubmitting}
        apiError={apiError}
      />
    </main>
  );
};

export default CreateCharacter;
