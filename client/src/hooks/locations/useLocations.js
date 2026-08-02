import { useCallback, useEffect, useState } from "react";
import { getLocations } from "../../services/locationApi";

const useLocations = (projectId) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!projectId) {
      setLocations([]);
      setError("");
      setLoading(true);
      return undefined;
    }

    const controller = new AbortController();

    const loadLocations = async () => {
      try {
        setLoading(true);
        setError("");

        const locationData = await getLocations(projectId, {
          signal: controller.signal,
        });

        setLocations(Array.isArray(locationData) ? locationData : []);
      } catch (loadError) {
        if (loadError.name === "AbortError") {
          return;
        }

        setLocations([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load project locations.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadLocations();

    return () => {
      controller.abort();
    };
  }, [projectId, retryCount]);

  const retry = useCallback(() => {
    setRetryCount((currentCount) => currentCount + 1);
  }, []);

  const removeLocation = useCallback((locationId) => {
    setLocations((currentLocations) =>
      currentLocations.filter(
        (location) => String(location.id) !== String(locationId),
      ),
    );
  }, []);

  return {
    locations,
    loading,
    error,
    retry,
    removeLocation,
  };
};

export default useLocations;
