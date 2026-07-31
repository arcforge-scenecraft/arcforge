import { Link } from "react-router-dom";

const LatestCharacters = ({ projectId, characters = [] }) => {
  const latestCharacters = [...characters]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 2);

  return (
    <section className="detail__overview">
      <div className="detail__section-heading">
        <p className="detail__eyebrow">Characters</p>

        <h2>Latest characters</h2>

        <p>Explore the latest characters created for this story project.</p>
      </div>

      {latestCharacters.length > 0 ? (
        <div className="detail__location-grid detail__location-grid--compact">
          {latestCharacters.map((character) => (
            <article
              key={character.id}
              className="detail__location-card detail__location-card--compact"
            >
              <h3>{character.name}</h3>

              <p className="character-card__role">
                {character.story_role || "Role not specified"}
              </p>

              <p className="detail__location-description">
                {character.description || "No description has been added yet."}
              </p>

              <Link
                to={`/projects/${projectId}/characters/${character.id}`}
                className="detail__location-link"
              >
                View character
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="detail__empty">No characters have been added yet.</p>
      )}

      <div className="detail__section-actions character-actions">
        <Link
          to={`/projects/${projectId}/characters`}
          className="detail__view-all-link"
        >
          View all characters
        </Link>

        <Link
          to={`/projects/${projectId}/characters/new`}
          className="detail__view-all-link"
        >
          Create character
        </Link>
      </div>
    </section>
  );
};

export default LatestCharacters;
