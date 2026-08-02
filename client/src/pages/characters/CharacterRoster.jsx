import { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import CharacterList from "../../components/characters/CharacterList";
import {
  CollectionPageHeader,
  CollectionToolbar,
  EmptyState,
  ErrorState,
  Loader,
  NotFoundState,
} from "../../components/ui";
import useCharacters from "../../hooks/characters/useCharacters";
import useProject from "../../hooks/projects/useProject";
import { deleteCharacter } from "../../services/characterApi";

const sortCharacters = (characters, sortBy) => {
  return [...characters].sort((first, second) => {
    if (sortBy === "name") {
      return String(first.name || "").localeCompare(String(second.name || ""));
    }

    if (sortBy === "role") {
      return String(first.story_role || "").localeCompare(
        String(second.story_role || ""),
      );
    }

    return (
      new Date(second.created_at || 0).getTime() -
      new Date(first.created_at || 0).getTime()
    );
  });
};

function CharacterRoster() {
  const { projectId } = useParams();
  const { state } = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const {
    project,
    loading: projectLoading,
    error: projectError,
    notFound: projectNotFound,
    retry: retryProject,
  } = useProject(projectId);

  const resolvedProjectId = project?.id ?? null;

  const { characters, loading, error, retry, removeCharacter } =
    useCharacters(resolvedProjectId);

  const visibleCharacters = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredCharacters = characters.filter((character) => {
      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        character.name,
        character.story_role,
        character.description,
        character.goal,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });

    return sortCharacters(filteredCharacters, sortBy);
  }, [characters, searchQuery, sortBy]);

  const handleDeleteCharacter = async (characterId) => {
    await deleteCharacter(projectId, characterId);
    removeCharacter(characterId);
  };

  if (projectLoading) {
    return <Loader text="Loading character roster..." />;
  }

  if (projectNotFound) {
    return (
      <NotFoundState
        title="Project not found"
        description="This character roster belongs to a project that does not exist or may have been deleted."
        action={
          <Link to="/dashboard" className="primary-button">
            Back to dashboard
          </Link>
        }
      />
    );
  }

  if (projectError) {
    return <ErrorState message={projectError} onRetry={retryProject} />;
  }

  return (
    <main className="collection-page">
      <div className="collection-page__content">
        <CollectionPageHeader
          backTo={`/projects/${projectId}`}
          eyebrow={project.title}
          title="Characters"
          count={characters.length}
          countLabel="characters"
          description="Manage the cast, their roles, goals, and place within this story."
          actionTo={`/projects/${projectId}/characters/new`}
          actionLabel="Add character"
        />

        {state?.message && (
          <div className="notice-card form-success" role="status">
            <p>{state.message}</p>
          </div>
        )}

        {loading && <Loader text="Loading characters..." />}

        {!loading && error && <ErrorState message={error} onRetry={retry} />}

        {!loading && !error && characters.length === 0 && (
          <EmptyState
            title="No characters yet"
            description="Add the first character to begin building this project's cast."
            action={
              <Link
                to={`/projects/${projectId}/characters/new`}
                className="primary-button"
              >
                Add character
              </Link>
            }
          />
        )}

        {!loading && !error && characters.length > 0 && (
          <>
            <CollectionToolbar
              resourceName="characters"
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search by name, role, goal..."
              sortValue={sortBy}
              onSortChange={setSortBy}
              sortOptions={[
                {
                  value: "newest",
                  label: "Newest first",
                },
                {
                  value: "name",
                  label: "Name A-Z",
                },
                {
                  value: "role",
                  label: "Story role",
                },
              ]}
              visibleCount={visibleCharacters.length}
              totalCount={characters.length}
            />

            {visibleCharacters.length === 0 ? (
              <EmptyState
                title="No matching characters"
                description="Try changing your search."
                action={
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </button>
                }
              />
            ) : (
              <CharacterList
                characters={visibleCharacters}
                projectId={projectId}
                onDeleteCharacter={handleDeleteCharacter}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default CharacterRoster;
