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
import { getLocations } from "../../services/locationApi";

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
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadProject = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [projectData, locationData] = await Promise.all([
          getProjectById(projectId, {
            signal: controller.signal,
          }),
          getLocations(projectId),
        ]);

        if (!projectData) {
          throw new Error("Project not found.");
        }

        setProject(projectData);
        setLocations(locationData || []);
      } catch (loadError) {
        if (loadError.name === "AbortError") {
          return;
        }

        console.error("Failed to load project:", loadError);

        setProject(null);
        setLocations([]);

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

  const latestLocations = [...locations]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 2);

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
        <section className="detail__overview">
          <div className="detail__section-heading">
            <p className="detail__eyebrow">Project overview</p>

            <h2>About this story</h2>

            <p>
              Review the project’s core information before developing its
              scenes, characters, locations, and story details.
            </p>
          </div>

          <dl className="detail__information-list">
            <div className="detail__information-row">
              <dt>Project title</dt>
              <dd>{project.title}</dd>
            </div>

            <div className="detail__information-row">
              <dt>Status</dt>
              <dd>{status}</dd>
            </div>

            <div className="detail__information-row">
              <dt>Genre</dt>
              <dd>
                {genres.length > 0 ? genres.join(", ") : "Genre undecided"}
              </dd>
            </div>

            <div className="detail__information-row">
              <dt>Description</dt>
              <dd>
                {project.description ||
                  "No project description has been added yet."}
              </dd>
            </div>
          </dl>
        </section>

        {/* Latest Locations */}
        <section className="detail__overview">
          <div className="detail__section-heading">
            <p className="detail__eyebrow">Locations</p>

            <h2>Latest locations</h2>

            <p>Explore the latest locations created for this story project.</p>
          </div>

          {latestLocations.length > 0 ? (
            <div className="detail__location-grid">
              {latestLocations.map((location) => (
                <article key={location.id} className="detail__location-card">
                  <h3>{location.name}</h3>

                  <p>
                    {location.description ||
                      "No description has been added yet."}
                  </p>

                  {location.atmosphere && (
                    <p className="detail__location-atmosphere">
                      <strong>Atmosphere:</strong> {location.atmosphere}
                    </p>
                  )}

                  <Link
                    to={`/projects/${projectId}/locations/${location.id}`}
                    className="detail__location-link"
                  >
                    View location
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="detail__empty">No locations have been added yet.</p>
          )}

          <div className="detail__section-actions">
            <Link
              to={`/projects/${projectId}/locations`}
              className="detail__view-all-link"
            >
              View all locations
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
};

export default ProjectDetail;
