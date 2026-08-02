import { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import SceneList from "../../components/scenes/SceneList";
import {
  CollectionPageHeader,
  CollectionToolbar,
  EmptyState,
  ErrorState,
  Loader,
  NotFoundState,
} from "../../components/ui";
import useScenes from "../../hooks/scenes/useScenes";
import useProject from "../../hooks/projects/useProject";
import { deleteScene } from "../../services/sceneApi";

function SceneLibrary() {
  const { projectId } = useParams();
  const { state } = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("scene-order");
  const [statusFilter, setStatusFilter] = useState("");

  const {
    project,
    loading: projectLoading,
    error: projectError,
    notFound: projectNotFound,
    retry: retryProject,
  } = useProject(projectId);

  const resolvedProjectId = project?.id ?? null;

  const { scenes, loading, error, retry, removeScene } =
    useScenes(resolvedProjectId);

  const visibleScenes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredScenes = scenes.filter((scene) => {
      if (statusFilter && scene.status !== statusFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const characters = Array.isArray(scene.characters)
        ? scene.characters
        : [];

      const searchableText = [
        scene.name,
        scene.description,
        scene.location,
        ...characters,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });

    return [...filteredScenes].sort((first, second) => {
      if (sortBy === "timeline-order") {
        return (
          Number(first.timeline_order || 0) - Number(second.timeline_order || 0)
        );
      }

      if (sortBy === "newest") {
        return (
          new Date(second.created_at || 0).getTime() -
          new Date(first.created_at || 0).getTime()
        );
      }

      if (sortBy === "name") {
        return String(first.name || "").localeCompare(
          String(second.name || ""),
        );
      }

      return Number(first.scene_order || 0) - Number(second.scene_order || 0);
    });
  }, [scenes, searchQuery, sortBy, statusFilter]);

  const handleDeleteScene = async (sceneId) => {
    await deleteScene(projectId, sceneId);
    removeScene(sceneId);
  };

  if (projectLoading) {
    return <Loader text="Loading scene library..." />;
  }

  if (projectNotFound) {
    return (
      <NotFoundState
        title="Project not found"
        description="This scene library belongs to a project that does not exist or may have been deleted."
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
          title="Scenes"
          count={scenes.length}
          countLabel="scenes"
          description="Manage the cast, their roles, goals, and place within this story."
          actionTo={`/projects/${projectId}/scenes/new`}
          actionLabel="Add scene"
        />

        {state?.message && (
          <div className="notice-card form-success" role="status">
            <p>{state.message}</p>
          </div>
        )}

        {loading && <Loader text="Loading scenes..." />}

        {!loading && error && <ErrorState message={error} onRetry={retry} />}

        {!loading && !error && scenes.length === 0 && (
          <EmptyState
            title="No scenes yet"
            description="Add the first scene to begin building this project's cast."
            action={
              <Link
                to={`/projects/${projectId}/scenes/new`}
                className="primary-button"
              >
                Add scene
              </Link>
            }
          />
        )}

        {!loading && !error && scenes.length > 0 && (
          <>
            <CollectionToolbar
              resourceName="scenes"
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search scenes, locations, characters..."
              filterLabel="Status"
              filterValue={statusFilter}
              onFilterChange={setStatusFilter}
              filterOptions={[
                {
                  value: "",
                  label: "All statuses",
                },
                {
                  value: "Planning",
                  label: "Planning",
                },
                {
                  value: "In Progress",
                  label: "In progress",
                },
                {
                  value: "On Hold",
                  label: "On hold",
                },
                {
                  value: "Completed",
                  label: "Completed",
                },
              ]}
              sortValue={sortBy}
              onSortChange={setSortBy}
              sortOptions={[
                {
                  value: "scene-order",
                  label: "Scene order",
                },
                {
                  value: "timeline-order",
                  label: "Timeline order",
                },
                {
                  value: "newest",
                  label: "Newest first",
                },
                {
                  value: "name",
                  label: "Name A-Z",
                },
              ]}
              visibleCount={visibleScenes.length}
              totalCount={scenes.length}
            />

            {visibleScenes.length === 0 ? (
              <EmptyState
                title="No matching scenes"
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
              <SceneList
                scenes={visibleScenes}
                projectId={projectId}
                onDeleteScene={handleDeleteScene}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default SceneLibrary;
