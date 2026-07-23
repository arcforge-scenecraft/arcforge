import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CharacterForm from "../components/characters/CharacterForm";
import { Loader, ErrorState } from "../components/ui";
import {
  createCharacter,
  getCharacterById,
  updateCharacter,
} from "../services/characterApi";
import "../styles/characters.css";

const CharacterFormPage = () => {
  const { projectId, characterId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(characterId);

  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const controller = new AbortController();

    const loadCharacter = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await getCharacterById(projectId, characterId);
        setCharacter(data);
      } catch (error) {
        setLoadError(error.message || "Failed to load character.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacter();

    return () => controller.abort();
  }, [projectId, characterId, isEditMode]);

  const handleSubmit = async (characterData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (isEditMode) {
        await updateCharacter(projectId, characterId, characterData);
      } else {
        await createCharacter(projectId, characterData);
      }

      navigate(`/projects/${projectId}`);
    } catch (error) {
      setSubmitError(
        error.message || "Something went wrong while saving the character.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="page-shell character-form-page">
      <Link to={`/projects/${projectId}`} className="back-link">
        ← Back to project
      </Link>

      <div className="page-header">
        <p className="eyebrow">Character</p>
        <h1 className="page-title">
          {isEditMode ? "Edit Character" : "Create Character"}
        </h1>
      </div>

      {isLoading && <Loader text="Loading character..." />}

      {!isLoading && loadError && (
        <ErrorState title="Unable to load character" message={loadError} />
      )}

      {!isLoading && !loadError && (isEditMode ? character : true) && (
        <CharacterForm
          character={character}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          error={submitError}
          submitLabel={isEditMode ? "Save Changes" : "Create Character"}
        />
      )}
    </div>
  );
};

export default CharacterFormPage;
