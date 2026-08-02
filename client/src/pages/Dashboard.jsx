import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProjectCard from "../components/projects/ProjectCard";
import { EmptyState, ErrorState, Loader, Notification } from "../components/ui";
import useRouteNotification from "../hooks/useRouteNotification";
import { deleteProject, getProjects } from "../services/projectApi";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { notification, showNotification, dismissNotification } =
    useRouteNotification();

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const projectData = await getProjects();

      setProjects(Array.isArray(projectData) ? projectData : []);
    } catch (loadError) {
      setProjects([]);

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

  const handleDeleteProject = useCallback(
    async (projectId, projectTitle) => {
      await deleteProject(projectId);

      setProjects((currentProjects) =>
        currentProjects.filter(
          (project) => String(project.id) !== String(projectId),
        ),
      );

      showNotification({
        type: "success",
        title: "Project deleted",
        message: `"${projectTitle}" was deleted successfully.`,
      });
    },
    [showNotification],
  );

  const projectCountLabel = projects.length === 1 ? "project" : "projects";

  return (
    <main className="dashboard">
      <section
        className="dashboard__section"
        aria-labelledby="projects-heading"
      >
        <header className="dashboard__header">
          <div className="dashboard__header-content">
            <p className="dashboard__eyebrow">Your workspace</p>

            <h1 id="projects-heading">Story Projects</h1>

            <p className="dashboard__header-description">
              Create, organize, and continue building your story worlds.
            </p>

            {!isLoading && !error && projects.length > 0 && (
              <span className="dashboard__project-count">
                You have {projects.length} {projectCountLabel}
              </span>
            )}
          </div>

          <div className="dashboard__actions">
            <Link to="/projects/new" className="dashboard__create-link">
              Create project
            </Link>
          </div>
        </header>

        {notification && (
          <Notification {...notification} onDismiss={dismissNotification} />
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
                Create your first project
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
