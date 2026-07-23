import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SceneForm from "../../components/scenes/SceneForm";
import ProjectFormHeader from "../../components/projects/ProjectFormHeader";
import { ErrorState, Loader } from "../../components/ui";

const CreateScene = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProject = async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const projectData = await getProjectById(projectId);
      setProject(projectData);
    } catch (error) {
      setLoadError(error.message || "Unable to load the project.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const handleUpdateProject = async (projectData) => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError("");

      const updatedProject = await updateProject(projectId, projectData);

      console.log("Updated project:", updatedProject);

      if (!updatedProject?.id) {
        throw new Error(
          "The project was updated, but the API did not return its ID.",
        );
      }

      navigate(`/projects/${updatedProject.id}`, {
        replace: true,
        state: {
          message: "Project updated successfully.",
        },
      });
    } catch (error) {
      setApiError(error.message || "Unable to update the project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader text="Loading project..." />;
  }

  if (loadError) {
    return <ErrorState message={loadError} onRetry={loadProject} />;
  }

  return (
    <main className="page-container">
      <ProjectFormHeader
        eyebrow="Project settings"
        title={`Edit ${project.title}`}
        description="Update the basic information for this story project."
      />

      <SceneForm
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

export default CreateScene;
