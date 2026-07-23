import { Link } from "react-router-dom";

function LocationCard({ location, projectId }) {
  return (
    <article className="detail-panel">
      <h3>{location.name}</h3>

      <p>{location.description || "No description provided."}</p>

      <p>
        <strong>Atmosphere:</strong> {location.atmosphere || "Not specified"}
      </p>

      <Link
        to={`/projects/${projectId}/locations/${location.id}`}
        className="button button--secondary"
      >
        View location
      </Link>
    </article>
  );
}

export default LocationCard;
