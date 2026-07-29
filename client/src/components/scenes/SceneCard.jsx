import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ErrorState, Loader } from "../../components/ui";
import SceneDeleteButton from "./SceneDeleteButton";

const SceneCard = ({scene, onDelete}) => {
    const characters = Array.isArray(scene.characters)
    ? scene.characters
    : scene.characters
      ? [scene.characters]
      : [];

  return (
    <article className="card">
      <div className="card-header">
        <span className="status">{scene.status || "Planning"}</span>
      </div>

      <div className="card-content">
        <h2 className="card-title">
          <Link to={`/projects/${scene.project_id}/scenes/${scene.id}`}>{scene.name}</Link>
        </h2>

        <p className="card-description">
          Scene Order: {scene.sceneOrder || "unknown"} | Timeline Order: {scene.timelineOrder || "unknown"}
        </p>

        <p className="card-description">
          {scene.description || "No description added yet."}
        </p>

        <p className="card-description">
          Location: {scene.location || "unknown"}
        </p>

        <div className="card-genres">
          {characters.length > 0 ? (
            characters.map((character) => (
              <span key={character} className="card-genre">
                {character}
              </span>
            ))
          ) : (
            <span className="card-genre project-card-genre-empty">
              Characters undecided
            </span>
          )}
        </div>

        <p className="card-description">
          Status: {scene.status || "unknown"}
        </p>
      </div>

      <div className="card-actions">
        <div className="card-primary-actions">
          <Link to={`/projects/${scene.project_id}/scenes/${scene.id}`} className="card-link">
            View Scene
          </Link>

          <Link to={`/projects/${scene.project_id}/scenes/${scene.id}/edit`} className="card-edit-link">
            Edit
          </Link>
        </div>

        <SceneDeleteButton
          projectTitle={scene.name}
          onDelete={() => onDelete(scene.id, scene.name)}
        />
      </div>
    </article>
  );
}

export default SceneCard;