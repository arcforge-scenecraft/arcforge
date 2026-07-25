/*useLocations.js is responsible for fetching all locations belonging to a project using only projectId. It is used by the Project Detail and Location Library pages.*/

import { useCallback, useEffect, useState } from "react";

import { getLocations } from "../../services/locationApi";

const useLocations = (projectId) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isActive = true;

    const loadLocations = async () => {
      try {
        setLoading(true);
        setError("");

        const locationData = await getLocations(projectId);

        if (isActive) {
          setLocations(locationData || []);
        }
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        console.error("Failed to load project locations:", loadError);

        setLocations([]);

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load project locations.",
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadLocations();

    return () => {
      isActive = false;
    };
  }, [projectId, retryCount]);

  const retry = useCallback(() => {
    setRetryCount((currentCount) => currentCount + 1);
  }, []);

  return {
    locations,
    loading,
    error,
    retry,
  };
};

export default useLocations;
