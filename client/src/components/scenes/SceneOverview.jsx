import { useParams, Link } from "react-router-dom";

const SceneOverview = ({projectId, scenes = []}) => {
    const latestScenes = [...scenes]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 2);
    
    return (
        <section className="detail__overview">
          <div className="detail__section-heading">
            <p className="detail__eyebrow">Scenes</p>
    
            <h2>Recent scenes</h2>
    
            <p>Explore the newest scenes created for this story project.</p>
            <Link
              to={`/projects/${projectId}/scenes/new`}
              className="detail__edit-link"
            >
              Create scene
            </Link>
          </div>
    
          {latestScenes.length > 0 ? (
            <div className="detail__location-grid detail__location-grid--compact">
              {latestScenes.map((scene) => (
                <Link
                  key={scene.id}
                  to={`/projects/${projectId}/scenes/${scene.id}`}
                  className="detail__related-card--compact detail__location-card detail__location-card--compact"
                >
                  <h3>{scene.name}</h3>
    
                  <p className="detail__location-description">
                    {scene.description || "No description has been added yet."}
                  </p>

                  <div className="card-genres">
                    {scene.location && scene.location != "Undefined"?
                      <span className="detail__genre">{scene.location}</span>
                    : ""}

                    {scene.characters.length > 0 ? (
                      scene.characters.slice(0,2).map((character) => (character != "Undecided"?
                        <span key={character} className="detail__genre">
                          {character}
                        </span>: ""
                      ))
                    ) : ""}
                  </div>

                  <p></p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="detail__empty">No scenes have been added yet.</p>
          )}
    
          <div className="detail__section-actions">
            <Link
              to={`/projects/${projectId}/scenes`}
              className="detail__view-all-link"
            >
              View all scenes
            </Link>
          </div>
        </section>
    );   
}

export default SceneOverview;