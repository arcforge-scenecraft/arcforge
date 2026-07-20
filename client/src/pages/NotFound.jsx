import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page-shell" style={{ textAlign: "center" }}>
      <div className="page-header">
        <p className="eyebrow">404</p>
        <h1 className="page-title">Page not found</h1>
        <p className="page-copy">The story timeline or path you followed does not exist.</p>
      </div>
      <Link to="/dashboard" className="project-link">
        Return to dashboard →
      </Link>
    </div>
  );
}

export default NotFound;