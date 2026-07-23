import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link, useParams } from "react-router-dom";

import { ErrorState, Loader } from "../../components/ui";
import useLocation from "../../hooks/locations/useLocation";
import NotFound from "../NotFound";

function LocationDetail() {
  const { projectId, locationId } = useParams();

  const { location, loading, error, notFound, retry } = useLocation(
    projectId,
    locationId,
  );

  if (loading) {
    return (
      <main className="detail-page">
        <section className="project-detail">
          <Link
            to={`/projects/${projectId}/locations`}
            className="project-detail__back-link"
          >
            <ArrowLeftIcon aria-hidden="true" />
            Back to locations
          </Link>

          <div className="detail__state">
            <Loader text="Loading location details..." />
          </div>
        </section>
      </main>
    );
  }

  if (notFound) {
    return <NotFound />;
  }

  if (error) {
    return (
      <main className="detail-page">
        <section className="project-detail">
          <Link
            to={`/projects/${projectId}/locations`}
            className="detail__back-link"
          >
            <ArrowLeftIcon aria-hidden="true" />
            Back to locations
          </Link>

          <header className="detail__error-header">
            <p className="detail__eyebrow">Location workspace</p>

            <h1>Unable to open location</h1>

            <p>We could not retrieve the selected story location.</p>
          </header>

          <div className="detail__state">
            <ErrorState message={error} onRetry={retry} />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <Link to={`/projects/${projectId}/locations`} className="back-link">
        ← Back to locations
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
      </div>
    </main>
  );
}

export default LocationDetail;
