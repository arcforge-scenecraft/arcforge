import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectForm from "../../components/projects/ProjectForm";
import ProjectFormHeader from "../../components/projects/ProjectFormHeader";
import { ErrorState, Loader } from "../../components/ui";
import { getProjectById, updateProject } from "../../services/projectApi";

const getErrorMessage = (error, fallbackMessage) => {
  return error instanceof Error && error.message
    ? error.message
    : fallbackMessage;
};

const EditProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProject = useCallback(
    async (signal) => {
      if (!projectId) {
        setLoadError("A valid project ID is required.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError("");

        const projectData = await getProjectById(projectId, {
          signal,
        });

        if (!projectData) {
          throw new Error("The requested project was not found.");
        }

        setProject(projectData);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setLoadError(getErrorMessage(error, "Unable to load the project."));
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [projectId],
  );

  useEffect(() => {
    const controller = new AbortController();

    loadProject(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadProject]);

  const handleUpdateProject = async (projectData) => {
    if (isSubmitting || !projectId) {
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError("");

      const updatedProject = await updateProject(projectId, projectData);

      // Some PATCH endpoints return the updated object, while others
      // return 204 No Content. The existing route ID is safe as fallback.
      const updatedProjectId = updatedProject?.id ?? projectId;

      navigate(`/projects/${updatedProjectId}`, {
        replace: true,
        state: {
          message: "Project updated successfully.",
        },
      });
    } catch (error) {
      setApiError(getErrorMessage(error, "Unable to update the project."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader text="Loading project..." />;
  }

  if (loadError) {
    return <ErrorState message={loadError} onRetry={() => loadProject()} />;
  }

  if (!project) {
    return (
      <ErrorState
        message="The requested project was not found."
        onRetry={() => loadProject()}
      />
    );
  }

  return (
    <main className="page-container">
      <ProjectFormHeader
        eyebrow="Project settings"
        title={`Edit ${project.title || "project"}`}
        description="Update the basic information for this story project."
      />

      <ProjectForm
        initialValues={project}
        onSubmit={handleUpdateProject}
        onCancel={() => navigate(`/projects/${projectId}`)}
        submitLabel="Save Changes"
        isSubmitting={isSubmitting}
        apiError={apiError}
      />
    </main>
  );
};

export default EditProject;
