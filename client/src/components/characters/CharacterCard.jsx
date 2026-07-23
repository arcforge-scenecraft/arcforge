import { Link, useParams } from "react-router-dom";

const CharacterCard = ({ character }) => {
  const { projectId } = useParams();

  return (
    <article className="character-card">
      <div className="character-card__header">
        <h3>{character.name}</h3>
        {character.story_role && (
          <span className="character-card__role">{character.story_role}</span>
        )}
      </div>

      {character.description && (
        <p className="character-card__description">{character.description}</p>
      )}

      <Link
        className="character-card__link"
        to={`/projects/${projectId}/characters/${character.id}/edit`}
      >
        Edit character
      </Link>
    </article>
  );
};

export default CharacterCard;
