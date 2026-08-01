import { Link } from "react-router-dom";
import { DeleteButton } from "../ui";

function LocationCard({ location, projectId, onDelete }) {
  return (
    <article className="detail-panel">
      <h3>{location.name}</h3>

      <p>{location.description || "No description provided."}</p>

      <p>
        <strong>Atmosphere:</strong> {location.atmosphere || "Not specified"}
      </p>

      <div className="page-actions">
        <Link
          to={`/projects/${projectId}/locations/${location.id}`}
          className="button button--secondary"
        >
          View location
        </Link>

        <DeleteButton
          itemName={location.name}
          itemType="location"
          label="Delete"
          warning="Scenes using this location will remain, but their location will be cleared."
          onDelete={onDelete}
        />
      </div>
    </article>
  );
}

export default LocationCard;
