import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import SceneForm from "../../components/scenes/SceneForm";
import ProjectFormHeader from "../../components/projects/ProjectFormHeader";
import { ErrorState, Loader } from "../../components/ui";
import { deleteScene, getScenes } from "../../services/sceneApi";
import SceneCard from "../../components/scenes/SceneCard";
import { getProjectById } from "../../services/projectApi";
import { getLocations } from "../../services/locationApi";
import { getCharacters } from "../../services/characterApi";

const SceneDashboard = () => {
  const { projectId } = useParams();

  const [project, setProject] = useState([]);
  const [scenes, setScenes] = useState([]);
  // const [locations, setLocations] = useState([]);
  // const [characters, setCharacters] = useState([]);

  // const [sortBy, setSortBy] = useState("scene_order");
  // const [locationFilter, setLocationFilter] = useState("");
  // const [characterFilter, setCharacterFilter] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchScenes = async () => {
      try {
        setLoading(true);
        setError("");

        const sceneData = await getScenes(projectId);

        const projectData = await getProjectById(projectId);
        setProject(projectData);

        // const locationData = await getLocations(projectId);
        // setLocations(locationData);

        // const characterData = await getCharacters(projectId);
        // setCharacters(characterData);

        if (isMounted) {
          setScenes(Array.isArray(sceneData) ? sceneData : []);
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

      <header className="detail__hero">
          <div className="detail__hero-content">

            <div className="detail__heading-row">
              <p className="detail__eyebrow">{project.title}</p>
            </div>

            <h1>Scene Library</h1>

            <p className="detail__description">
              Browse the scenes that belong to this story project.
            </p>

          </div>

          <div className="detail__actions">

            <Link
              to={`/projects/${projectId}/scenes/new`}
              className="detail__edit-link"
            >
              Create scene
            </Link>
          </div>
        </header>

      {/* <section className="detail__controls">
        <div className="detail__controls-group">
          <label htmlFor="sortBy">Sort by</label>

          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="scene_order">Scene Order</option>
            <option value="timeline_order">Timeline Order</option>
            <option value="created_at">Created Date</option>
            <option value="updated_at">Last Updated</option>
          </select>
        </div>

        <div className="detail__controls-group">
          <label htmlFor="locationFilter">Location</label>

          <select
            id="locationFilter"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>

            {locations.map((location) => (
              <option key={location.id} value={location.name}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        <div className="detail__controls-group detail__controls-group--wide">
          <label htmlFor="characterFilter">Characters</label>

          <select
            id="characterFilter"
            multiple
            value={characterFilter}
            onChange={(e) =>
              setCharacterFilter(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
          >
            {characters.map((character) => (
              <option key={character.id} value={character.name}>
                {character.name}
              </option>
            ))}
          </select>
        </div>
      </section> */}

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