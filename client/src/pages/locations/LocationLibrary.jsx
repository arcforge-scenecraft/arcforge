import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import LocationList from "../../components/locations/LocationList";
import { getLocations } from "../../services/locationApi";

function LocationLibrary() {
  const { projectId } = useParams();

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getLocations(projectId);

        if (isMounted) {
          setLocations(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || "Failed to load locations. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLocations();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  return (
    <main className="page-shell">
      <Link to={`/projects/${projectId}`} className="back-link">
        ← Back to project
      </Link>

      <header className="page-header">
        <p className="eyebrow">Location library</p>

        <h1 className="page-title">Locations</h1>

        <p className="page-copy">
          Browse reusable locations that belong to this story project.
        </p>
      </header>

      {loading && (
        <div className="notice-card">
          <p>Loading locations...</p>
        </div>
      )}

      {!loading && error && (
        <div className="notice-card error-message" role="alert">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && locations.length === 0 && (
        <div className="notice-card">
          <p>No locations have been added to this project yet.</p>
        </div>
      )}

      {!loading && !error && locations.length > 0 && (
        <LocationList locations={locations} projectId={projectId} />
      )}
    </main>
  );
}

export default LocationLibrary;
