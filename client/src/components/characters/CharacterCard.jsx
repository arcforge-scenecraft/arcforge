import { Link } from "react-router-dom";

function CharacterCard({ character, projectId }) {
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
      </div>
    </article>
  );
}

export default CharacterCard;
