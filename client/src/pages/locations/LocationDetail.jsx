import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DeleteButton, DetailPageState } from "../../components/ui";
import useLocation from "../../hooks/locations/useLocation";
import { deleteLocation } from "../../services/locationApi";

function LocationDetail() {
  const { projectId, locationId } = useParams();
  const navigate = useNavigate();

  const { location, loading, error, notFound, retry } = useLocation(
    projectId,
    locationId,
  );

  const handleDeleteLocation = async () => {
    await deleteLocation(projectId, locationId);

    navigate(`/projects/${projectId}/locations`, {
      replace: true,
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

  return (
    <main className="page-shell">
      <Link
        to={`/projects/${projectId}/locations`}
        className="detail__back-link"
      >
        <ArrowLeftIcon aria-hidden="true" />
        Back to locations
      </Link>

      <header className="page-header">
        <p className="eyebrow">Location details</p>

        <h1 className="page-title">{location.name}</h1>
      </header>

      <section className="detail-panel">
        <div className="detail-section">
          <h2>Description</h2>

          <p>{location.description || "No description provided."}</p>
        </div>

        <div className="detail-section">
          <h2>Atmosphere</h2>

          <p>{location.atmosphere || "No atmosphere specified."}</p>
        </div>
      </section>

      <div className="page-actions">
        <Link
          to={`/projects/${projectId}/locations/${locationId}/edit`}
          className="button button--primary"
        >
          Edit location
        </Link>

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

        <DeleteButton
          itemName={location.name}
          itemType="location"
          warning="Scenes using this location will remain, but their location will be cleared."
          onDelete={handleDeleteLocation}
        />
      </div>
    </main>
  );
}

export default LocationDetail;
