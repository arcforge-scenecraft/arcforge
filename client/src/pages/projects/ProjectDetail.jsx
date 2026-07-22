import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  PencilSquareIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProjectDeleteButton from "../../components/projects/ProjectDeleteButton";
import { ErrorState, Loader } from "../../components/ui";
import { deleteProject, getProjectById } from "../../services/projectApi";

const formatLabel = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  return String(value)
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadProject = async () => {
      try {
        setIsLoading(true);
        setError("");

        const projectData = await getProjectById(projectId, {
          signal: controller.signal,
        });

        if (!projectData) {
          throw new Error("Project not found.");
        }

        setProject(projectData);
      } catch (loadError) {
        if (loadError.name === "AbortError") {
          return;
        }

        console.error("Failed to load project:", loadError);

        setProject(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load this project.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      controller.abort();
    };
  }, [projectId, retryCount]);

  const handleRetry = () => {
    setRetryCount((currentCount) => currentCount + 1);
  };

  const handleDeleteProject = async () => {
    await deleteProject(project.id);

    navigate("/dashboard", {
      replace: true,
      state: {
        message: `"${project.title}" was deleted successfully.`,
      },
    });
  };

  if (isLoading) {
    return (
      <main className="project-detail-page">
        <section className="project-detail">
          <Link to="/dashboard" className="project-detail__back-link">
            <ArrowLeftIcon aria-hidden="true" />
            Back to dashboard
          </Link>

          <div className="project-detail__state">
            <Loader text="Loading project details..." />
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="project-detail-page">
        <section className="project-detail">
          <Link to="/dashboard" className="project-detail__back-link">
            <ArrowLeftIcon aria-hidden="true" />
            Back to dashboard
          </Link>

          <header className="project-detail__error-header">
            <p className="project-detail__eyebrow">Project workspace</p>
            <h1>Unable to open project</h1>
            <p>We could not retrieve the selected story project.</p>
          </header>

          <div className="project-detail__state">
            <ErrorState message={error} onRetry={handleRetry} />
          </div>
        </section>
      </main>
    );
  }

  const genres = Array.isArray(project.genre)
    ? project.genre
    : project.genre
      ? [project.genre]
      : [];

  const status = formatLabel(project.status, "Planning");
  const createdDate = formatDate(project.created_at);
  const updatedDate = formatDate(project.updated_at);

  return (
    <main className="project-detail-page">
      <article
        className="project-detail"
        aria-labelledby="project-detail-heading"
      >
        <Link to="/dashboard" className="project-detail__back-link">
          <ArrowLeftIcon aria-hidden="true" />
          Back to dashboard
        </Link>

        <header className="project-detail__hero">
          <div className="project-detail__hero-content">
            <div className="project-detail__heading-row">
              <p className="project-detail__eyebrow">Story workspace</p>

              <span className="project-detail__status">{status}</span>
            </div>

            <h1 id="project-detail-heading">{project.title}</h1>

            <p className="project-detail__description">
              {project.description ||
                "No project description has been added yet."}
            </p>
          </div>

          <div className="project-detail__actions">
            <Link
              to={`/projects/${project.id}/edit`}
              className="project-detail__edit-link"
            >
              <PencilSquareIcon aria-hidden="true" />
              Edit project
            </Link>

            <ProjectDeleteButton
              projectTitle={project.title}
              onDelete={handleDeleteProject}
            />
          </div>
        </header>

        <section
          className="project-detail__metadata"
          aria-label="Project information"
        >
          <article className="project-detail__metadata-card">
            <div className="project-detail__metadata-icon">
              <TagIcon aria-hidden="true" />
            </div>

            <div>
              <span className="project-detail__metadata-label">Genre</span>

              <div className="project-detail__genres">
                {genres.length > 0 ? (
                  genres.map((genre) => (
                    <span key={genre} className="project-detail__genre">
                      {genre}
                    </span>
                  ))
                ) : (
                  <span className="project-detail__metadata-value">
                    Genre undecided
                  </span>
                )}
              </div>
            </div>
          </article>

          <article className="project-detail__metadata-card">
            <div className="project-detail__metadata-icon">
              <CalendarDaysIcon aria-hidden="true" />
            </div>

            <div>
              <span className="project-detail__metadata-label">Created</span>

              <strong className="project-detail__metadata-value">
                {createdDate}
              </strong>
            </div>
          </article>

          <article className="project-detail__metadata-card">
            <div className="project-detail__metadata-icon">
              <ClockIcon aria-hidden="true" />
            </div>

            <div>
              <span className="project-detail__metadata-label">
                Last updated
              </span>

              <strong className="project-detail__metadata-value">
                {updatedDate}
              </strong>
            </div>
          </article>
        </section>

        <section className="project-detail__overview">
          <div className="project-detail__section-heading">
            <p className="project-detail__eyebrow">Project overview</p>

            <h2>About this story</h2>

            <p>
              Review the project’s core information before developing its
              scenes, characters, locations, and story details.
            </p>
          </div>

          <dl className="project-detail__information-list">
            <div className="project-detail__information-row">
              <dt>Project title</dt>
              <dd>{project.title}</dd>
            </div>

            <div className="project-detail__information-row">
              <dt>Status</dt>
              <dd>{status}</dd>
            </div>

            <div className="project-detail__information-row">
              <dt>Genre</dt>
              <dd>
                {genres.length > 0 ? genres.join(", ") : "Genre undecided"}
              </dd>
            </div>

            <div className="project-detail__information-row">
              <dt>Description</dt>
              <dd>
                {project.description ||
                  "No project description has been added yet."}
              </dd>
            </div>
          </dl>
        </section>
      </article>
    </main>
  );
};

export default ProjectDetail;
