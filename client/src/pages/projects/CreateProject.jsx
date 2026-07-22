import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectForm from "../../components/projects/ProjectForm";
import ProjectFormHeader from "../../components/projects/ProjectFormHeader";
import { createProject } from "../../services/projectApi";

const CreateProject = () => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleCreateProject = async (projectData) => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError("");

      const createdProject = await createProject(projectData);

      if (!createdProject?.id) {
        throw new Error(
          "The project was created, but the API did not return its ID.",
        );
      }

      navigate(`/projects/${createdProject.id}`, {
        replace: true,
        state: {
          message: "Project created successfully.",
        },
      });
    } catch (error) {
      setApiError(error.message || "Unable to create the project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-container">
      <ProjectFormHeader
        eyebrow="New story"
        title="Create a project"
        description="Add the basic information for the story you want to start planning."
      />

      <ProjectForm
        onSubmit={handleCreateProject}
        onCancel={() => navigate("/dashboard")}
        submitLabel="Create Project"
        isSubmitting={isSubmitting}
        apiError={apiError}
      />
    </main>
  );
};

export default CreateProject;
