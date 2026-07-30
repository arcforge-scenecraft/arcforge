import { useEffect, useState } from "react";

import { getSceneById } from "../../services/sceneApi";

function useScene(projectId, sceneId) {
  const [scene, setScene] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchScene = async () => {
      try {
        setLoading(true);
        setError("");
        setNotFound(false);
        setScene(null);

        const data = await getSceneById(projectId, sceneId);
        console.log(data.location);
        console.log(data.characters.length)

        if (isMounted) {
          setScene(data || null);
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }

        if (err.message === "Scene not found.") {
          setScene(null);
          setNotFound(true);
          setError("");
          return;
        }

        console.error("Failed to load scene:", err);

        setScene(null);
        setNotFound(false);
        setError(
          err instanceof Error ? err.message : "Unable to load this scene.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchScene();

    return () => {
      isMounted = false;
    };
  }, [projectId, sceneId, retryCount]);

  const retry = () => {
    setRetryCount((currentCount) => currentCount + 1);
  };

  return {
    scene,
    loading,
    error,
    notFound,
    retry,
  };
}

export default useScene;
