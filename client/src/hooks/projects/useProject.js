import { useCallback, useEffect, useState } from "react";
import { getProjectById } from "../../services/projectApi";
import { isAbortError, isNotFoundError } from "../../utils/apiErrors";

const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadProject = async () => {
      try {
        setLoading(true);
        setError("");
        setNotFound(false);
        setProject(null);

        const projectData = await getProjectById(projectId, {
          signal: controller.signal,
        });

        if (!projectData) {
          throw new Error("Project not found.");
        }

        setProject(projectData);
      } catch (loadError) {
        if (isAbortError(loadError)) {
          return;
        }

        setProject(null);

        if (isNotFoundError(loadError)) {
          setNotFound(true);
          setError("");
          return;
        }

        setNotFound(false);
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
    notFound,
    retry,
  };
};

export default useProject;
