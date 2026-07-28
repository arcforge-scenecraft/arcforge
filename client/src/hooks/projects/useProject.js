import { useCallback, useEffect, useState } from "react";

import { getProjectById } from "../../services/projectApi";

const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadProject = async () => {
      try {
        setLoading(true);
        setError("");

        const projectData = await getProjectById(projectId, {
          signal: controller.signal,
        });

        if (!projectData) {
          throw new Error("Project not found.");
        }

        setProject(projectData);
      } catch (loadError) {
        if (loadError.name === "AbortError") {
          return;
        }

        console.error("Failed to load project:", loadError);

        setProject(null);

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load this project.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      controller.abort();
    };
  }, [projectId, retryCount]);

  const retry = useCallback(() => {
    setRetryCount((currentCount) => currentCount + 1);
  }, []);

  return {
    project,
    loading,
    error,
    retry,
  };
};

export default useProject;
