import { Link, useParams } from "react-router-dom";

import useLocation from "../../hooks/locations/useLocation";

function LocationDetail() {
  const { projectId, locationId } = useParams();

  const { location, loading, error } = useLocation(projectId, locationId);

  if (loading) {
    return (
      <main className="page-shell">
        <Link to={`/projects/${projectId}/locations`} className="back-link">
          ← Back to locations
        </Link>

        <div className="notice-card">Loading location...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-shell">
        <Link to={`/projects/${projectId}/locations`} className="back-link">
          ← Back to locations
        </Link>

        <div className="notice-card error-message" role="alert">
          <h1>Unable to load location</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!location) {
    return (
      <main className="page-shell">
        <Link to={`/projects/${projectId}/locations`} className="back-link">
          ← Back to locations
        </Link>

        <div className="notice-card">
          <h1>Location not found</h1>
          <p>This location does not exist or may have been removed.</p>
        </div>
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
