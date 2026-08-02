import { useEffect, useState } from "react";

import { getSceneById } from "../../services/sceneApi";
import { getSceneCharacters } from "../../services/scene-characterApi";
import { getLocations } from "../../services/locationApi";

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

        const sceneCharacters = await getSceneCharacters(projectId, sceneId);

        const sceneLocations = await getLocations(projectId);

        const sceneLocation = sceneLocations.find(location => location.name === data.location);

        const normalizedData = {
          ...data,
          characters: sceneCharacters && sceneCharacters.length != 0 ? sceneCharacters : [{character_id: -1, name: "Undecided", role_in_scene: "", knowledge_gained: ""}],
          location: sceneLocation ? [sceneLocation.id, sceneLocation.name, sceneLocation.description, sceneLocation.atmosphere] : [-1, "Undecided", "", ""]
        }

        console.log("Normalized scene data:", normalizedData)

        if (isMounted) {
          setScene(normalizedData || null);
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }

        const isMissingResource =
          err?.status === 404 ||
          err?.message === "Scene not found." ||
          err?.message === "Project not found.";

        if (isMissingResource) {
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
    setScene,
    loading,
    setLoading,
    error,
    notFound,
    retry,
  };
}

export default useScene;
