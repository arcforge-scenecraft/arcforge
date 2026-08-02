import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import LocationList from "../../components/locations/LocationList";
import {
  CollectionPageHeader,
  CollectionToolbar,
  EmptyState,
  ErrorState,
  Loader,
  Notification,
  NotFoundState,
} from "../../components/ui";
import useLocations from "../../hooks/locations/useLocations";
import useProject from "../../hooks/projects/useProject";
import useRouteNotification from "../../hooks/useRouteNotification";
import { deleteLocation } from "../../services/locationApi";

const sortLocations = (locations, sortBy) => {
  return [...locations].sort((first, second) => {
    if (sortBy === "name") {
      return String(first.name || "").localeCompare(String(second.name || ""));
    }

    if (sortBy === "atmosphere") {
      return String(first.atmosphere || "").localeCompare(
        String(second.atmosphere || ""),
      );
    }

    return (
      new Date(second.created_at || 0).getTime() -
      new Date(first.created_at || 0).getTime()
    );
  });
};

function LocationLibrary() {
  const { projectId } = useParams();

  const { notification, showNotification, dismissNotification } =
    useRouteNotification();

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

  const { locations, loading, error, retry, removeLocation } =
    useLocations(resolvedProjectId);

  const visibleLocations = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredLocations = locations.filter((location) => {
      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        location.name,
        location.description,
        location.atmosphere,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });

    return sortLocations(filteredLocations, sortBy);
  }, [locations, searchQuery, sortBy]);

  const handleDeleteLocation = async (locationId) => {
    const deletedLocation = locations.find(
      (location) => String(location.id) === String(locationId),
    );

    await deleteLocation(projectId, locationId);
    removeLocation(locationId);

    showNotification({
      type: "success",
      message: `"${deletedLocation?.name || "Location"}" was deleted successfully.`,
    });
  };

  if (projectLoading) {
    return <Loader text="Loading location library..." />;
  }

  if (projectNotFound) {
    return (
      <NotFoundState
        title="Project not found"
        description="This location library belongs to a project that does not exist or may have been deleted."
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
          title="Locations"
          count={locations.length}
          countLabel="locations"
          description="Manage the settings, environments, and places used throughout this story."
          actionTo={`/projects/${projectId}/locations/new`}
          actionLabel="Add location"
        />

        {notification && (
          <Notification {...notification} onDismiss={dismissNotification} />
        )}

        {loading && <Loader text="Loading locations..." />}

        {!loading && error && <ErrorState message={error} onRetry={retry} />}

        {!loading && !error && locations.length === 0 && (
          <EmptyState
            title="No locations yet"
            description="Add the first location to begin building this project's cast."
            action={
              <Link
                to={`/projects/${projectId}/locations/new`}
                className="primary-button"
              >
                Add location
              </Link>
            }
          />
        )}

        {!loading && !error && locations.length > 0 && (
          <>
            <CollectionToolbar
              resourceName="locations"
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search by name, description, atmosphere..."
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
                  value: "atmosphere",
                  label: "Atmosphere",
                },
              ]}
              visibleCount={visibleLocations.length}
              totalCount={locations.length}
            />

            {visibleLocations.length === 0 ? (
              <EmptyState
                title="No matching locations"
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
              <LocationList
                locations={visibleLocations}
                projectId={projectId}
                onDeleteLocation={handleDeleteLocation}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default LocationLibrary;
