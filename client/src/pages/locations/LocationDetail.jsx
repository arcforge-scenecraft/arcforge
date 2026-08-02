import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  PencilSquareIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import {
  Link,
  useLocation as useRouteLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { DeleteButton, DetailPageState } from "../../components/ui";
import useLocationData from "../../hooks/locations/useLocation";
import { deleteLocation } from "../../services/locationApi";

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const normalizeText = (value, fallback) => {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  return value.trim();
};

function LocationDetail() {
  const { projectId, locationId } = useParams();
  const navigate = useNavigate();
  const { state } = useRouteLocation();

  const { location, loading, error, notFound, retry } = useLocationData(
    projectId,
    locationId,
  );

  const handleDeleteLocation = async () => {
    await deleteLocation(projectId, locationId);

    navigate(`/projects/${projectId}/locations`, {
      replace: true,
      state: {
        message: `"${location.name}" was deleted successfully.`,
      },
    });
  };

  if (loading) {
    return (
      <DetailPageState
        state="loading"
        resourceName="Location"
        loadingText="Loading location details..."
        backTo={`/projects/${projectId}/locations`}
        backLabel="Back to locations"
      />
    );
  }

  if (notFound) {
    return (
      <DetailPageState
        state="not-found"
        resourceName="Location"
        description="The selected location or its project does not exist."
        backTo={`/projects/${projectId}/locations`}
        backLabel="Back to locations"
      />
    );
  }

  if (error) {
    return (
      <DetailPageState
        state="error"
        resourceName="Location"
        message={error}
        onRetry={retry}
        backTo={`/projects/${projectId}/locations`}
        backLabel="Back to locations"
      />
    );
  }

  const locationName = normalizeText(location.name, "Untitled location");

  const description = normalizeText(
    location.description,
    "No description has been added for this location yet.",
  );

  const atmosphere = normalizeText(
    location.atmosphere,
    "Atmosphere not specified",
  );

  return (
    <main className="detail-page">
      <article className="detail" aria-labelledby="location-detail-heading">
        <Link
          to={`/projects/${projectId}/locations`}
          className="detail__back-link"
        >
          <ArrowLeftIcon aria-hidden="true" />
          Back to locations
        </Link>

        {state?.message && (
          <div
            className="notice-card form-success detail__notice"
            role="status"
            aria-live="polite"
          >
            <p>{state.message}</p>
          </div>
        )}

        <header className="detail__hero detail__hero--location">
          <div className="detail__hero-content">
            <div className="detail__heading-row">
              <p className="detail__eyebrow">Location workspace</p>

              <span className="detail__badge">
                <MapPinIcon aria-hidden="true" />
                Story location
              </span>
            </div>

            <h1 id="location-detail-heading">{locationName}</h1>

            <p className="detail__description">
              Review this setting&apos;s descriptive details, atmosphere, and
              place within the story world.
            </p>
          </div>

          <div className="detail__actions">
            <Link
              to={`/projects/${projectId}/locations/${locationId}/edit`}
              className="detail__edit-link"
            >
              <PencilSquareIcon aria-hidden="true" />
              Edit location
            </Link>

            <DeleteButton
              variant="detail"
              itemName={locationName}
              itemType="location"
              label="Delete location"
              warning="Scenes using this location will remain, but their location will be cleared."
              onDelete={handleDeleteLocation}
            />
          </div>
        </header>

        <section className="detail__metadata" aria-label="Location information">
          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <MapPinIcon aria-hidden="true" />
            </div>

            <div>
              <span className="detail__metadata-label">Type</span>

              <strong className="detail__metadata-value">Story location</strong>
            </div>
          </article>

          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <CalendarDaysIcon aria-hidden="true" />
            </div>

            <div>
              <span className="detail__metadata-label">Created</span>

              <strong className="detail__metadata-value">
                {formatDate(location.created_at)}
              </strong>
            </div>
          </article>

          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <ClockIcon aria-hidden="true" />
            </div>

            <div>
              <span className="detail__metadata-label">Last updated</span>

              <strong className="detail__metadata-value">
                {formatDate(location.updated_at)}
              </strong>
            </div>
          </article>
        </section>

        <section className="detail__overview">
          <div className="detail__section-heading">
            <p className="detail__eyebrow">Overview</p>

            <h2>About this location</h2>

            <p>
              Capture the appearance, purpose, and role this setting plays in
              the story.
            </p>
          </div>

          <div className="detail__prose">
            <p>{description}</p>
          </div>
        </section>

        <section className="detail__overview-single">
          <div className="detail__section-heading">
            <p className="detail__eyebrow">Environment</p>

            <h2>Mood and atmosphere</h2>

            <p>
              Define the emotional tone readers or players should experience in
              this location.
            </p>
          </div>

          <div className="detail__feature-card">
            <div className="detail__feature-icon">
              <SparklesIcon aria-hidden="true" />
            </div>

            <div className="detail__feature-content">
              <span className="detail__feature-label">Atmosphere</span>

              <p className="detail__feature-value">{atmosphere}</p>
            </div>
          </div>
        </section>

        <footer className="detail__footer-navigation">
          <Link
            to={`/projects/${projectId}`}
            className="button button--secondary"
          >
            Back to project
          </Link>

          <Link
            to={`/projects/${projectId}/locations`}
            className="button button--secondary"
          >
            View all locations
          </Link>
        </footer>
      </article>
    </main>
  );
}

export default LocationDetail;
