import { useCallback, useEffect, useState } from "react";
import { getScenes } from "../../services/sceneApi";

const useScenes = (projectId) => {
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!projectId) {
      setScenes([]);
      setError("");
      setLoading(true);
      return undefined;
    }

    const controller = new AbortController();

    const loadScenes = async () => {
      try {
        setLoading(true);
        setError("");

        const sceneData = await getScenes(projectId, {
          signal: controller.signal,
        });

        setScenes(Array.isArray(sceneData) ? sceneData : []);
      } catch (loadError) {
        if (loadError.name === "AbortError") {
          return;
        }

        setScenes([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load project scenes.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadScenes();

    return () => {
      controller.abort();
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
