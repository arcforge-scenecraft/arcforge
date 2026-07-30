import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SceneForm from "../../components/scenes/SceneForm";
import ProjectFormHeader from "../../components/projects/ProjectFormHeader";
import { createScene } from "../../services/sceneApi";

const CreateScene = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    
    const [apiError, setApiError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateScene = async (sceneData) => {

    if (isSubmitting) {
        return;
    }

    try {
        setIsSubmitting(true);
        setApiError("");

        console.log("About to call createScene for project", projectId, "and sceneData:", sceneData)

        const createdScene = await createScene(projectId, sceneData);

        if (!createdScene?.id) {
        throw new Error(
            "The scene was created, but the API did not return its ID.",
        );
        }

        navigate(`/projects/${projectId}/scenes`, {
        replace: true,
        state: {
            message: "Scene created successfully.",
        },
        });
    } catch (error) {
        setApiError(error.message || "Unable to create the scene.");
    } finally {
        setIsSubmitting(false);
    }
    };

    return (
        <main className="page-container">
            <ProjectFormHeader
            eyebrow="New Scene"
            title="Create a scene"
            description="Add the basic information for your new scene."
            />

            <SceneForm
            onSubmit={handleCreateScene}
            projectId={projectId}
            onCancel={() => navigate(`/projects/${projectId}/scenes`)}
            submitLabel="Create Scene"
            isSubmitting={isSubmitting}
            apiError={apiError}
            />
        </main>
    );
};

export default CreateScene;
