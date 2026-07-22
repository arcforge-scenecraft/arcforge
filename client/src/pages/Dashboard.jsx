import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/projects/ProjectCard";
import { EmptyState, ErrorState, Loader } from "../components/ui";
import { getProjects } from "../services/projectApi";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const projectData = await getProjects();
      setProjects(projectData);
    } catch (error) {
      console.error("Failed to load projects:", error);

      setError(
        error.message || "Something went wrong while loading your projects.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <main className="dashboard">
      <section
        className="dashboard__section"
        aria-labelledby="projects-heading"
      >
        <header className="dashboard__header">
          <div className="dashboard__header-content">
            <p className="dashboard__eyebrow">Your workspace</p>
            <h1>Story Projects</h1>
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
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
