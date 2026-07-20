import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/projects/ProjectCard";
import { EmptyState, ErrorState, Loader } from "../components/ui";
import { getProjects } from "../services/projectApi";
import "../styles/Dashboard.css";

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
      <header className="dashboard__header">
        <div>
          <p className="dashboard__eyebrow">Story workspace</p>
          <h1>Dashboard</h1>
          <p className="dashboard__subtitle">
            Manage your projects and continue building your stories.
          </p>
        </div>

        <Link to="/projects/new" className="button button--primary">
          Create Project
        </Link>
      </header>

      <section
        className="dashboard__section"
        aria-labelledby="projects-heading"
      >
        <div className="dashboard__section-header">
          <div>
            <h2 id="projects-heading">Your Projects</h2>
            <p>Choose a project to continue working on your story.</p>
          </div>

          {!isLoading && !error && projects.length > 0 && (
            <span className="dashboard__project-count">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </span>
          )}
        </div>

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
