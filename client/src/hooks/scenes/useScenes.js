import { useCallback, useEffect, useState } from "react";

import { getScenes } from "../../services/sceneApi";

const useScenes = (projectId) => {
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isActive = true;

    const loadScenes = async () => {
      try {
        setLoading(true);
        setError("");

        const sceneData = await getScenes(projectId);

        if (isActive) {
          setScenes(sceneData || []);
        }
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        console.error("Failed to load project scenes:", loadError);

        setScenes([]);

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load project scenes.",
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadScenes();

    return () => {
      isActive = false;
    };
  }, [projectId, retryCount]);

  const retry = useCallback(() => {
    setRetryCount((currentCount) => currentCount + 1);
  }, []);

  return {
    scenes,
    loading,
    error,
    retry,
  };
};

export default useScenes;
