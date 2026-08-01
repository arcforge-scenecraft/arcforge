import { Link } from "react-router-dom";
import { DeleteButton } from "../ui";

function CharacterCard({ character, projectId, onDelete }) {
  return (
    <article className="detail-panel">
      <h3>{character.name}</h3>

      <p className="character-card__role">
        {character.story_role || "Role not specified"}
      </p>

      <p>{character.description || "No description provided."}</p>

      {character.goal && (
        <p>
          <strong>Goal:</strong> {character.goal}
        </p>
      )}

      <div className="page-actions">
        <Link
          to={`/projects/${projectId}/characters/${character.id}`}
          className="button button--secondary"
        >
          View character
        </Link>

        <Link
          to={`/projects/${projectId}/characters/${character.id}/edit`}
          className="button button--secondary"
        >
          Edit character
        </Link>

        <DeleteButton
          itemName={character.name}
          itemType="character"
          label="Delete"
          warning="This also removes the character from every scene they appear in and clears their relationships."
          onDelete={onDelete}
        />
      </div>
    </article>
  );
}

export default CharacterCard;
