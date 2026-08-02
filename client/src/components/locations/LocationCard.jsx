import { Link } from "react-router-dom";
import { CollectionCardActions } from "../ui";

function LocationCard({ location, projectId, onDelete }) {
  const locationPath = `/projects/${projectId}/locations/${location.id}`;
  const atmosphere = location.atmosphere?.trim() || "Not specified";

  return (
    <article className="card collection-card">
      <header className="card-header">
        <span className="card-type">Location</span>

        <span className="card-meta-badge">{atmosphere}</span>
      </header>

      <div className="card-content">
        <h2 className="card-title">
          <Link to={locationPath}>{location.name}</Link>
        </h2>

        <p className="card-description">
          {location.description || "No description has been added yet."}
        </p>

        <div className="card-details">
          <span className="card-details__label">Atmosphere</span>

          <p className="card-details__value">{atmosphere}</p>
        </div>
      </div>

      <CollectionCardActions
        viewTo={locationPath}
        editTo={`${locationPath}/edit`}
        itemName={location.name}
        itemType="location"
        warning="Scenes using this location will remain, but their location will be cleared."
        onDelete={onDelete}
      />
    </article>
  );
}

export default LocationCard;
