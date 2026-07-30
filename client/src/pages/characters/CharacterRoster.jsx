import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useParams } from "react-router-dom";

import CharacterList from "../../components/characters/CharacterList";
import { ErrorState, Loader } from "../../components/ui";
import useCharacters from "../../hooks/characters/useCharacters";
import { deleteCharacter } from "../../services/characterApi";

function CharacterRoster() {
  const { projectId } = useParams();
  const { state } = useLocation();

  const { characters, loading, error, retry, removeCharacter } =
    useCharacters(projectId);

  const handleDeleteCharacter = async (characterId) => {
    await deleteCharacter(projectId, characterId);

    removeCharacter(characterId);
  };

  return (
    <main className="detail-page">
      <Link to={`/projects/${projectId}`} className="detail__back-link">
        <ArrowLeftIcon aria-hidden="true" />
        Back to project
      </Link>

      <header className="page-header">
        <p className="eyebrow">Character roster</p>

        <h1 className="page-title">Characters</h1>

        <p className="page-copy">
          Browse every character that belongs to this story project.
        </p>
      </header>

      {state?.message && (
        <div className="notice-card form-success" role="status">
          <p>{state.message}</p>
        </div>
      )}

      <div className="page-actions page-actions--header">
        <Link
          to={`/projects/${projectId}/characters/new`}
          className="button button--primary"
        >
          Create character
        </Link>
      </div>

      {loading && <Loader text="Loading characters..." />}

      {!loading && error && <ErrorState message={error} onRetry={retry} />}

      {!loading && !error && characters.length === 0 && (
        <div className="notice-card">
          <p>No characters have been added to this project yet.</p>
        </div>
      )}

      {!loading && !error && characters.length > 0 && (
        <CharacterList
          characters={characters}
          projectId={projectId}
          onDeleteCharacter={handleDeleteCharacter}
        />
      )}
    </main>
  );
}

export default CharacterRoster;
