// src/pages/ProjectDetail.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProjectById } from "../services/projectApi";

function ProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create an abort controller to prevent state updates on unmounted components
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchProjectData() {
      try {
        setLoading(true);
        setError(null);
        
        const projectData = await getProjectById(projectId, { signal });

        setProject(projectData);

      } catch (err) {
        if (err.name !== 'AbortError') {
          // err.message comes from the backend or the apiClient's fallback
          setError(err.message || "Failed to load project details.");
          console.error("Error fetching project:", err);
        }
      } finally {
        // Only toggle loading off if the request wasn't aborted midway
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProjectData();

    // Cleanup function runs when the component unmounts or projectId changes
    return () => {
      controller.abort();
    };
  }, [projectId]);

  if (loading) {
    return (
      <div className="page-shell project-detail">
        <Link to="/dashboard" className="back-link">
          ← Back to dashboard
        </Link>
        <div className="page-header">
          <p className="eyebrow">Project detail</p>
          <h1 className="page-title">Loading workspace...</h1>
          <p className="page-copy">Fetching the selected story project by route ID.</p>
        </div>
        <div className="detail-grid">
          <div className="detail-panel">
            <span className="skeleton-line" />
            <span className="skeleton-line" />
          </div>
          <div className="detail-panel">
            <span className="skeleton-line" />
            <span className="skeleton-line" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell project-detail">
        <Link to="/dashboard" className="back-link">
          ← Back to dashboard
        </Link>
        <div className="page-header">
          <p className="eyebrow">Project detail</p>
          <h1 className="page-title">Unable to open project</h1>
        </div>
        <div className="notice-card error-message">{error}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page-shell project-detail">
        <Link to="/dashboard" className="back-link">
          ← Back to dashboard
        </Link>
        <div className="notice-card">Project not found.</div>
      </div>
    );
  }

  return (
    <div className="page-shell project-detail">
      <Link to="/dashboard" className="back-link">
        ← Back to dashboard
      </Link>

      <div className="page-header">
        <p className="eyebrow">Project detail</p>
        <h1 className="page-title">{project.title}</h1>
        <p className="page-copy">{project.description}</p>
      </div>

      <div className="project-hero-grid">
        <article className="detail-stat">
          <span>Route ID</span>
          <strong>{project.id}</strong>
        </article>
        <article className="detail-stat">
          <span>Status</span>
          <strong>In progress</strong>
        </article>
        <article className="detail-stat">
          <span>Workspace</span>
          <strong>Story planning</strong>
        </article>
      </div>

      <div className="detail-grid">
        <section className="detail-panel">
          <h3>What this route confirms</h3>
          <p>
            This page reads <strong>/projects/:projectId</strong>, fetches the selected project,
            and stays functional on refresh because the server returns the SPA shell.
          </p>
        </section>

        <section className="detail-panel">
          <h3>Navigation</h3>
          <p>
            Use the back link to return to the dashboard. The dashboard cards link here with
            client-side navigation.
          </p>
        </section>
      </div>
    </div>
  );
}

export default ProjectDetail;