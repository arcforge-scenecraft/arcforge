// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function getAllProjects() {
      try {
        setLoading(true);
        const response = await fetch('/api/projects', { signal: controller.signal });
        
        if (!response.ok) throw new Error("Could not fetch projects.");
        
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError("Unable to load project dashboard.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    getAllProjects();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-header">
          <p className="eyebrow">Dashboard</p>
          <h1 className="page-title">Loading your projects...</h1>
          <p className="page-copy">Fetching the latest story workspaces from the API.</p>
        </div>
        <div className="projects-grid">
          <div className="notice-card">
            <span className="skeleton-line" />
            <span className="skeleton-line" />
            <span className="skeleton-line" style={{ width: "70%" }} />
          </div>
          <div className="notice-card">
            <span className="skeleton-line" />
            <span className="skeleton-line" />
            <span className="skeleton-line" style={{ width: "60%" }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell">
        <div className="page-header">
          <p className="eyebrow">Dashboard</p>
          <h1 className="page-title">Project loading failed</h1>
        </div>
        <div className="notice-card error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <p className="eyebrow">Dashboard</p>
        <h1 className="page-title">ArcForge projects</h1>
        <p className="page-copy">
          Open a project workspace to review the selected story world.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <h2 style={{ marginTop: 0 }}>No story projects yet</h2>
          <p>Start by creating one in the API or database, then it will appear here.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <article key={project.id} className="project-card">
              <span className="badge">Project {project.id}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-meta">
                <span className="meta-pill">Scenes ready</span>
                <span className="meta-pill">Draft status</span>
              </div>
              <Link to={`/projects/${project.id}`} className="project-link">
                Open project workspace →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;