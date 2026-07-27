import { Link } from "react-router-dom";

const LatestLocations = ({ projectId, locations = [] }) => {
  const latestLocations = [...locations]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 2);

  return (
    <section className="detail__overview">
      <div className="detail__section-heading">
        <p className="detail__eyebrow">Locations</p>

        <h2>Latest locations</h2>

        <p>Explore the latest locations created for this story project.</p>
      </div>

      {latestLocations.length > 0 ? (
        <div className="detail__location-grid detail__location-grid--compact">
          {latestLocations.map((location) => (
            <article
              key={location.id}
              className="detail__location-card detail__location-card--compact"
            >
              <h3>{location.name}</h3>

              <p className="detail__location-description">
                {location.description || "No description has been added yet."}
              </p>

              {location.atmosphere && (
                <p className="detail__location-atmosphere">
                  <strong>Atmosphere:</strong> {location.atmosphere}
                </p>
              )}

              <Link
                to={`/projects/${projectId}/locations/${location.id}`}
                className="detail__location-link"
              >
                View location
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="detail__empty">No locations have been added yet.</p>
      )}

      <div className="detail__section-actions">
        <Link
          to={`/projects/${projectId}/locations`}
          className="detail__view-all-link"
        >
          View all locations
        </Link>
      </div>
    </section>
  );
};

export default LatestLocations;
