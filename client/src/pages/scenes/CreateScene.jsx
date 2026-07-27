import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SceneForm from "../../components/scenes/SceneForm";
import ProjectFormHeader from "../../components/projects/ProjectFormHeader";
import { ErrorState, Loader } from "../../components/ui";

const CreateScene = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [characters, setCharacters] = useState(null); // currently no characters api routes
  const [locations, setLocations] = useState(null);
  const [scene, setScene] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadInfo = async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const projectData = await getProjectById(projectId);
      setProject(projectData);
      const locationData = await getLocations(projectId);
      setLocations(locationData);
      // add real character data from api when available
      const characterData = ["Character 1", "Character 2"]; 
      setCharacters(characterData)
    } catch (error) {
      setLoadError(error.message || "Unable to load the project.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInfo();
  }, [projectId]);

   const handleCreateScene = async (projectData, locationData, characterData) => {
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

export default CreateScene;
