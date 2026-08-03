import { useCallback, useEffect, useState } from "react";
import { getSceneCharacters } from "../../services/scene-characterApi";

const useSceneCharacters = (projectId, sceneId) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!projectId || !sceneId) {
      setCharacters([]);
      setError("");
      setLoading(true);
      return undefined;
    }

    const controller = new AbortController();

    const loadSceneCharacters = async () => {
      try {
        setLoading(true);
        setError("");

        const sceneCharacterData = await getSceneCharacters(projectId, sceneId, {
          signal: controller.signal,
        });

        setCharacters(Array.isArray(sceneCharacterData) ? sceneCharacterData : []);
      } catch (loadError) {
        if (loadError.name === "AbortError") {
          return;
        }

        setCharacters([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load project characters.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadSceneCharacters();

    return () => {
      controller.abort();
    };
  }, [projectId, sceneId, retryCount]);

  const retry = useCallback(() => {
    setRetryCount((currentCount) => currentCount + 1);
  }, []);

  return {
    characters,
    setCharacters,
    loading,
    error,
    retry,
  };
};

export default useSceneCharacters;