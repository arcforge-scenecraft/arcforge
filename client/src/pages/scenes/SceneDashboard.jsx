import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import SceneForm from "../../components/scenes/SceneForm";
import ProjectFormHeader from "../../components/projects/ProjectFormHeader";
import { ErrorState, Loader } from "../../components/ui";
import { deleteScene, getScenes } from "../../services/sceneApi";
import SceneCard from "../../components/scenes/SceneCard";

const SceneDashboard = () => {
  const { projectId } = useParams();

  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchScenes = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getScenes(projectId);

        if (isMounted) {
          setScenes(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || "Failed to load scenes. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchScenes();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const handleDeleteScene = async (sceneId) => {
    await deleteScene(projectId, sceneId);

    setScenes((currentScenes) =>
      currentScenes.filter(
        (scene) => String(scene.id) !== String(sceneId),
      ),
    );
  };

  return (
    <main className="detail-page">
      <Link to={`/projects/${projectId}`} className="detail__back-link">
        <ArrowLeftIcon aria-hidden="true" />
        Back to project
      </Link>

      <header className="page-header">
        <p className="eyebrow">Scene library</p>

        <h1 className="page-title">Scenes</h1>

        <p className="page-copy">
          Browse reusable scenes that belong to this story project.
        </p>
      </header>

      <div className="page-actions page-actions--header">
        <Link
          to={`/projects/${projectId}/scenes/new`}
          className="button button--primary"
        >
          Create scene
        </Link>
      </div>

      {loading && (
        <div className="notice-card">
          <p>Loading scenes...</p>
        </div>
      )}

      {!loading && error && (
        <div className="notice-card error-message" role="alert">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && scenes.length === 0 && (
        <div className="notice-card">
          <p>No scenes have been added to this project yet.</p>
        </div>
      )}

      {!loading && !error && scenes.length > 0 && (
        <div className="detail-grid">
            {scenes.map((scene) => (
                <SceneCard
                    key={scene.id}
                    scene={scene}
                    onDelete={handleDeleteScene}
                />
            ))}
            </div>
      )}
    </main>
  );
}

export default SceneDashboard;