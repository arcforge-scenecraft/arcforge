import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <article className="project-card">
      <div className="project-card__header">
        <h2>{project.title}</h2>
        <span className="project-status">{project.status}</span>
      </div>

      <p className="project-genre">{project.genre}</p>
      <p className="project-description">{project.description}</p>

      <Link className="project-link" to={`/projects/${project.id}`}>
        View project
      </Link>
    </article>
  );
};

export default ProjectCard;
