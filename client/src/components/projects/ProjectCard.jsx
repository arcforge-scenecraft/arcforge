import { Link } from "react-router-dom";
import ProjectDeleteButton from "./ProjectDeleteButton";

const ProjectCard = ({ project, onDelete }) => {
  const genres = Array.isArray(project.genre)
    ? project.genre
    : project.genre
      ? [project.genre]
      : [];

  return (
    <article className="project-card">
      <div className="project-card-header">
        <span className="project-status">{project.status || "Planning"}</span>
      </div>

      <div className="project-card-content">
        <h2 className="project-card-title">
          <Link to={`/projects/${project.id}`}>{project.title}</Link>
        </h2>

        <p className="project-card-description">
          {project.description || "No description added yet."}
        </p>

        <div className="project-card-genres">
          {genres.length > 0 ? (
            genres.map((genre) => (
              <span key={genre} className="project-card-genre">
                {genre}
              </span>
            ))
          ) : (
            <span className="project-card-genre project-card-genre-empty">
              Genre undecided
            </span>
          )}
        </div>
      </div>

      <div className="project-card-actions">
        <div className="project-card-primary-actions">
          <Link to={`/projects/${project.id}`} className="project-card-link">
            View project
          </Link>

          <Link
            to={`/projects/${project.id}/edit`}
            className="project-card-edit-link"
          >
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
