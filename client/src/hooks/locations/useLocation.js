import { useEffect, useState } from "react";

import { getLocation } from "../../services/locationApi";

function useLocation(projectId, locationId) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchLocation = async () => {
      try {
        setLoading(true);
        setError("");
        setNotFound(false);
        setLocation(null);

        const data = await getLocation(projectId, locationId);

        if (isMounted) {
          setLocation(data || null);
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }

        if (err.message === "Location not found.") {
          setLocation(null);
          setNotFound(true);
          setError("");
          return;
        }

        console.error("Failed to load location:", err);

        setLocation(null);
        setNotFound(false);
        setError(
          err instanceof Error ? err.message : "Unable to load this location.",
        );
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
  }, [projectId, locationId, retryCount]);

  const retry = () => {
    setRetryCount((currentCount) => currentCount + 1);
  };

  return {
    location,
    loading,
    error,
    notFound,
    retry,
  };
}

export default useLocation;
