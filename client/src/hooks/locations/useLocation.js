import { useEffect, useState } from "react";

import { getLocation } from "../../services/locationApi";

function useLocation(projectId, locationId) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchLocation = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getLocation(projectId, locationId);

        if (isMounted) {
          setLocation(data || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load location.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLocation();

    return () => {
      isMounted = false;
    };
  }, [projectId, locationId]);

  return {
    location,
    loading,
    error,
  };
}

export default useLocation;
