import { Link } from "react-router-dom";
import ProjectDeleteButton from "./ProjectDeleteButton";

const ProjectCard = ({ project, onDelete }) => {
  const genres = Array.isArray(project.genre)
    ? project.genre
    : project.genre
      ? [project.genre]
      : [];

  return (
    <article className="card">
      <div className="card-header">
        <span className="status">{project.status || "Planning"}</span>
      </div>

      <div className="card-content">
        <h2 className="card-title">
          <Link to={`/projects/${project.id}`}>{project.title}</Link>
        </h2>

        <p className="card-description">
          {project.description || "No description added yet."}
        </p>

        <div className="card-genres">
          {genres.length > 0 ? (
            genres.map((genre) => (
              <span key={genre} className="card-genre">
                {genre}
              </span>
            ))
          ) : (
            <span className="card-genre project-card-genre-empty">
              Genre undecided
            </span>
          )}
        </div>
      </div>

      <div className="card-actions">
        <div className="card-primary-actions">
          <Link to={`/projects/${project.id}`} className="card-link">
            View project
          </Link>

          <Link to={`/projects/${project.id}/edit`} className="card-edit-link">
            Edit
          </Link>
        </div>

        <ProjectDeleteButton
          projectTitle={project.title}
          onDelete={() => onDelete(project.id, project.title)}
        />
      </div>
    </article>
  );
};

export default ProjectCard;
