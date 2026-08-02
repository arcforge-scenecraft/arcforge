import { Link } from "react-router-dom";
import { CollectionCardActions } from "../ui";

const normalizeGenres = (genre) => {
  const genres = Array.isArray(genre) ? genre : genre ? [genre] : [];

  return [
    ...new Set(
      genres
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter((item) => item && item.toLowerCase() !== "undecided"),
    ),
  ];
};

const getStatusClassName = (status) => {
  return String(status || "Planning")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
};

const ProjectCard = ({ project, onDelete }) => {
  const projectPath = `/projects/${project.id}`;

  const projectTitle =
    typeof project.title === "string" && project.title.trim()
      ? project.title.trim()
      : "Untitled project";

  const description =
    typeof project.description === "string" && project.description.trim()
      ? project.description.trim()
      : "No description has been added yet.";

  const status =
    typeof project.status === "string" && project.status.trim()
      ? project.status.trim()
      : "Planning";

  const genres = normalizeGenres(project.genre);

  return (
    <article className="card collection-card">
      <header className="card-header">
        <span className="card-type">Project</span>

        <span className={`status status-${getStatusClassName(status)}`}>
          {status}
        </span>
      </header>

      <div className="card-content">
        <h2 className="card-title">
          <Link to={projectPath}>{projectTitle}</Link>
        </h2>

        <p className="card-description">{description}</p>

        <div className="card-genres" aria-label="Project genres">
          {genres.length > 0 ? (
            genres.map((genre) => (
              <span key={genre} className="card-genre">
                {genre}
              </span>
            ))
          ) : (
            <span className="card-genre card-genre-empty">Genre undecided</span>
          )}
        </div>
      </div>

      <CollectionCardActions
        viewTo={projectPath}
        editTo={`${projectPath}/edit`}
        itemName={projectTitle}
        itemType="project"
        warning="This permanently removes the project and all of its related story data."
        onDelete={() => onDelete(project.id, projectTitle)}
      />
    </article>
  );
};

export default ProjectCard;
