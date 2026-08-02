import { Link } from "react-router-dom";
import { CollectionCardActions } from "../ui";

function CharacterCard({ character, projectId, onDelete }) {
  const characterPath = `/projects/${projectId}/characters/${character.id}`;
  const role = character.story_role?.trim() || "Role not specified";
  const goal = character.goal?.trim();

  return (
    <article className="card collection-card">
      <header className="card-header">
        <span className="card-type">Character</span>

        <span className="card-meta-badge">{role}</span>
      </header>

      <div className="card-content">
        <h2 className="card-title">
          <Link to={characterPath}>{character.name}</Link>
        </h2>

        <p className="card-description">
          {character.description || "No description has been added yet."}
        </p>

        <div className="card-details">
          <span className="card-details__label">Goal</span>

          <p className="card-details__value">{goal || "No goal specified"}</p>
        </div>
      </div>

      <CollectionCardActions
        viewTo={characterPath}
        editTo={`${characterPath}/edit`}
        itemName={character.name}
        itemType="character"
        warning="This also removes the character from every scene they appear in and clears their relationships."
        onDelete={onDelete}
      />
    </article>
  );
}

export default CharacterCard;
