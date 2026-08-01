import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { DeleteButton, DetailPageState } from "../../components/ui";
import useCharacter from "../../hooks/characters/useCharacter";
import { deleteCharacter } from "../../services/characterApi";

function CharacterDetail() {
  const { projectId, characterId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { character, loading, error, notFound, retry } = useCharacter(
    projectId,
    characterId,
  );

  const handleDeleteCharacter = async () => {
    await deleteCharacter(projectId, characterId);

    navigate(`/projects/${projectId}/characters`, {
      replace: true,
      state: {
        message: `"${character.name}" was deleted successfully.`,
      },
    });
  };

  if (loading) {
    return (
      <DetailPageState
        state="loading"
        resourceName="Character"
        loadingText="Loading character details..."
        backTo={`/projects/${projectId}/characters`}
        backLabel="Back to characters"
      />
    );
  }

  if (notFound) {
    return (
      <DetailPageState
        state="not-found"
        resourceName="Character"
        description="The selected character or its project does not exist."
        backTo={`/projects/${projectId}/characters`}
        backLabel="Back to characters"
      />
    );
  }

  if (error) {
    return (
      <DetailPageState
        state="error"
        resourceName="Character"
        message={error}
        onRetry={retry}
        backTo={`/projects/${projectId}/characters`}
        backLabel="Back to characters"
      />
    );
  }

  return (
    <main className="page-shell">
      <Link
        to={`/projects/${projectId}/characters`}
        className="detail__back-link"
      >
        <ArrowLeftIcon aria-hidden="true" />
        Back to characters
      </Link>

      <header className="page-header">
        <p className="eyebrow">Character details</p>

        <h1 className="page-title">{character.name}</h1>

        <p className="character-card__role">
          {character.story_role || "Role not specified"}
        </p>
      </header>

      {state?.message && (
        <div className="notice-card form-success" role="status">
          <p>{state.message}</p>
        </div>
      )}

      <section className="detail-panel">
        <div className="detail-section character-section">
          <h2>Description</h2>

          <p>{character.description || "No description provided."}</p>
        </div>

        <div className="detail-section character-section">
          <h2>Goal</h2>

          <p>{character.goal || "No goal has been recorded yet."}</p>
        </div>

        <div className="detail-section character-section">
          <h2>Knowledge notes</h2>

          <p>
            {character.knowledge_notes ||
              "No knowledge notes have been recorded yet."}
          </p>
        </div>
      </section>

      <div className="page-actions">
        <Link
          to={`/projects/${projectId}/characters/${characterId}/edit`}
          className="button button--primary"
        >
          Edit character
        </Link>

        <Link
          to={`/projects/${projectId}`}
          className="button button--secondary"
        >
          Back to project
        </Link>

        <Link
          to={`/projects/${projectId}/characters`}
          className="button button--secondary"
        >
          View all characters
        </Link>

        <DeleteButton
          itemName={character.name}
          itemType="character"
          warning="This also removes the character from every scene they appear in and clears their relationships."
          onDelete={handleDeleteCharacter}
        />
      </div>
    </main>
  );
}

export default CharacterDetail;
