import { Link } from "react-router-dom";
import { DeleteButton } from "../ui";

const SceneCard = ({ scene, onDelete }) => {
  const characters = Array.isArray(scene.characters)
    ? scene.characters
    : scene.characters
      ? [scene.characters]
      : [];

  return (
    <article className="card">
      <div className="card-header-2">
        <div className="card-orders">
          <span className="card-order">Scene #{scene.scene_order}</span>
          <span className="card-order">Timeline #{scene.timeline_order}</span>
        </div>

        <span className="status">{scene.status || "Planning"}</span>
      </div>

      <div className="card-content">
        <h2 className="card-title">
          <Link to={`/projects/${scene.project_id}/scenes/${scene.id}`}>
            {scene.name}
          </Link>
        </h2>

        <p className="card-description">
          {scene.description || "No description added yet."}
        </p>

        <div className="card-genres">
          {scene.location && scene.location != "Undefined" ? (
            <span className="card-genre-2">{scene.location}</span>
          ) : (
            ""
          )}

          {characters.length > 0
            ? characters.map((character) =>
                character != "Undecided" ? (
                  <span key={character} className="card-genre">
                    {character}
                  </span>
                ) : (
                  ""
                ),
              )
            : ""}
        </div>

        <p></p>
      </div>

      <div className="card-actions">
        <div className="card-primary-actions">
          <Link
            to={`/projects/${scene.project_id}/scenes/${scene.id}`}
            className="card-link"
          >
            View scene
          </Link>

          <Link
            to={`/projects/${scene.project_id}/scenes/${scene.id}/edit`}
            className="card-edit-link"
          >
            Edit
          </Link>
        </div>

        <DeleteButton
          itemName={scene.name}
          itemType="scene"
          label="Delete"
          warning="This permanently removes the scene and its related scene data, but retains associated characters and locations."
          onDelete={() => onDelete(scene.id)}
        />
      </div>
    </article>
  );
};

export default SceneCard;
