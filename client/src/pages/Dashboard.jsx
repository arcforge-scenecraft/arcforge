import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProjectCard from "../components/projects/ProjectCard";
import { EmptyState, ErrorState, Loader } from "../components/ui";
import { deleteProject, getProjects } from "../services/projectApi";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const projectData = await getProjects();
      setProjects(Array.isArray(projectData) ? projectData : []);
    } catch (loadError) {
      console.error("Failed to load projects:", loadError);

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Something went wrong while loading your projects.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    const message = location.state?.message;

    if (!message) {
      return;
    }

    setDeleteMessage(message);

    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [location.pathname, location.state, navigate]);

  const handleDeleteProject = useCallback(async (projectId, projectTitle) => {
    await deleteProject(projectId);

    setProjects((currentProjects) =>
      currentProjects.filter(
        (project) => String(project.id) !== String(projectId),
      ),
    );

    setDeleteMessage(`"${projectTitle}" was deleted successfully.`);
  }, []);

  return (
    <main className="dashboard">
      <section className="dashboard__section" aria-labelledby="projects-heading">
        <header className="dashboard__header">
          <div className="dashboard__header-content">
            <p className="dashboard__eyebrow">Your workspace</p>

            <h1 id="projects-heading">Story Projects</h1>

            <p className="dashboard__header-description">
              Create, organize, and continue building your story worlds.
            </p>

            {!isLoading && !error && projects.length > 0 && (
              <span className="dashboard__project-count">
                You have {projects.length}{" "}
                {projects.length === 1 ? "project" : "projects"}
              </span>
            )}
          </div>

          <div className="dashboard__actions">
            <Link to="/projects/new" className="dashboard__create-link">
              Create Project
            </Link>
          </div>
        </header>

        {deleteMessage && (
          <div className="dashboard__message" role="status">
            <span>{deleteMessage}</span>

            <button
              type="button"
              className="dashboard__message-close"
              onClick={() => setDeleteMessage("")}
              aria-label="Dismiss deletion message"
            >
              ×
            </button>
          </div>
        )}

        {isLoading && <Loader text="Loading your projects..." />}

        {!isLoading && error && (
          <ErrorState
            title="Unable to load projects"
            message={error}
            onRetry={loadProjects}
          />
        )}

        {!isLoading && !error && projects.length === 0 && (
          <EmptyState
            title="No projects yet"
            description="Create your first story project to start building characters, scenes, and locations."
            action={
              <Link to="/projects/new" className="button button--primary">
                Create Your First Project
              </Link>
            }
          />
        )}

        {!isLoading && !error && projects.length > 0 && (
          <div className="dashboard__project-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
