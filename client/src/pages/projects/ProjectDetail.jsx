import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  PencilSquareIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate, useParams } from "react-router-dom";

import LatestLocations from "../../components/locations/LatestLocations";
import ProjectDeleteButton from "../../components/projects/ProjectDeleteButton";
import ProjectOverview from "../../components/projects/ProjectOverview";
import { ErrorState, Loader } from "../../components/ui";
import useProject from "../../hooks/projects/useProject";
import useLocations from "../../hooks/locations/useLocations";
import { deleteProject } from "../../services/projectApi";

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

  const {
    project,
    loading: projectLoading,
    error: projectError,
    retry: retryProject,
  } = useProject(projectId);

  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
    retry: retryLocations,
  } = useLocations(projectId);

  const loading = projectLoading || locationsLoading;
  const error = projectError || locationsError;

  const retry = () => {
    retryProject();
    retryLocations();
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

  if (loading) {
    return (
      <main className="detail-page">
        <section className="detail">
          <Link to="/dashboard" className="detail__back-link">
            <ArrowLeftIcon aria-hidden="true" />
            Back to dashboard
          </Link>

          <div className="detail__state">
            <Loader text="Loading project details..." />
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="detail-page">
        <section className="detail">
          <Link to="/dashboard" className="detail__back-link">
            <ArrowLeftIcon aria-hidden="true" />
            Back to dashboard
          </Link>

          <header className="detail__error-header">
            <p className="detail__eyebrow">Project workspace</p>
            <h1>Unable to open project</h1>
            <p>We could not retrieve the selected story project.</p>
          </header>

          <div className="detail__state">
            <ErrorState message={error} onRetry={retry} />
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
    <main className="detail-page">
      <article className="detail" aria-labelledby="detail-heading">
        <Link to="/dashboard" className="detail__back-link">
          <ArrowLeftIcon aria-hidden="true" />
          Back to dashboard
        </Link>

        <header className="detail__hero">
          <div className="detail__hero-content">
            <div className="detail__heading-row">
              <p className="detail__eyebrow">Story workspace</p>

              <span className="detail__status">{status}</span>
            </div>

            <h1 id="detail-heading">{project.title}</h1>

            <p className="detail__description">
              {project.description ||
                "No project description has been added yet."}
            </p>
          </div>

          <div className="detail__actions">
            <Link
              to={`/projects/${project.id}/edit`}
              className="detail__edit-link"
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

        <section className="detail__metadata" aria-label="Project information">
          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <TagIcon aria-hidden="true" />
            </div>

            <div>
              <span className="detail__metadata-label">Genre</span>

              <div className="detail__genres">
                {genres.length > 0 ? (
                  genres.map((genre) => (
                    <span key={genre} className="detail__genre">
                      {genre}
                    </span>
                  ))
                ) : (
                  <span className="detail__metadata-value">
                    Genre undecided
                  </span>
                )}
              </div>
            </div>
          </article>

          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <CalendarDaysIcon aria-hidden="true" />
            </div>

            <div>
              <span className="detail__metadata-label">Created</span>

              <strong className="detail__metadata-value">{createdDate}</strong>
            </div>
          </article>

          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <ClockIcon aria-hidden="true" />
            </div>

            <div>
              <span className="detail__metadata-label">Last updated</span>

              <strong className="detail__metadata-value">{updatedDate}</strong>
            </div>
          </article>
        </section>

        {/* Project Overview */}
        <ProjectOverview project={project} status={status} genres={genres} />

        {/* Latest Locations */}
        <LatestLocations projectId={projectId} locations={locations} />
      </article>
    </main>
  );
};

export default ProjectDetail;
