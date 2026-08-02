import { Link } from "react-router-dom";

import { CollectionCardActions } from "../ui";

const MAX_CHARACTER_BADGES = 2;

const normalizeCharacters = (characters) => {
  const normalizedCharacters = Array.isArray(characters)
    ? characters
    : characters
      ? [characters]
      : [];

  return normalizedCharacters.filter(
    (character) =>
      typeof character === "string" &&
      character.trim() &&
      character.trim().toLowerCase() !== "undecided",
  );
};

const normalizeLocation = (location) => {
  if (typeof location !== "string") {
    return "";
  }

  const normalizedLocation = location.trim();

  if (
    !normalizedLocation ||
    normalizedLocation.toLowerCase() === "undefined" ||
    normalizedLocation.toLowerCase() === "undecided"
  ) {
    return "";
  }

  return normalizedLocation;
};

const getStatusClassName = (status) => {
  return String(status || "Planning")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
};

const SceneCard = ({ scene, projectId, onDelete }) => {
  const scenePath = `/projects/${projectId}/scenes/${scene.id}`;
  const characters = normalizeCharacters(scene.characters);
  const visibleCharacters = characters.slice(0, MAX_CHARACTER_BADGES);
  const hiddenCharacterCount = characters.length - visibleCharacters.length;
  const location = normalizeLocation(scene.location);
  const status = scene.status || "Planning";
  const sceneOrder =
    Number(scene.scene_order) > 0
      ? `Scene #${scene.scene_order}`
      : "Scene order not set";
  const timelineOrder =
    Number(scene.timeline_order) > 0
      ? `Timeline #${scene.timeline_order}`
      : "Timeline not set";

  return (
    <article className="card collection-card">
      <header className="card-header">
        <div className="card-orders">
          <span className="card-order">{sceneOrder}</span>

          <span className="card-order">{timelineOrder}</span>
        </div>

        <span className={`status status-${getStatusClassName(status)}`}>
          {status}
        </span>
      </header>

      <div className="card-content">
        <h2 className="card-title">
          <Link to={scenePath}>{scene.name}</Link>
        </h2>

        <p className="card-description">
          {scene.description || "No description has been added yet."}
        </p>

        <div className="card-badges">
          {location && (
            <span className="card-badge card-badge--location">{location}</span>
          )}

          {visibleCharacters.map((character) => (
            <span key={character} className="card-badge">
              {character}
            </span>
          ))}

          {hiddenCharacterCount > 0 && (
            <span className="card-badge">+{hiddenCharacterCount} more</span>
          )}

          {!location && characters.length === 0 && (
            <span className="card-badge card-badge--empty">
              No story elements selected
            </span>
          )}
        </div>
      </div>

      <CollectionCardActions
        viewTo={scenePath}
        editTo={`${scenePath}/edit`}
        itemName={scene.name}
        itemType="scene"
        warning="This permanently removes the scene and its related scene data, but retains associated characters and locations."
        onDelete={() => onDelete(scene.id)}
      />
    </article>
  );
};

export default SceneCard;
