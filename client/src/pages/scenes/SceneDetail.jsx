import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  PencilSquareIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DeleteButton, DetailPageState } from "../../components/ui";
import useScene from "../../hooks/scenes/useScene";
import { deleteScene } from "../../services/sceneApi";

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const SceneDetail = () => {
  const { projectId, sceneId } = useParams();
  const navigate = useNavigate();

  const { scene, loading, error, notFound, retry } = useScene(
    projectId,
    sceneId,
  );

  const handleDeleteScene = async () => {
    await deleteScene(projectId, scene.id);

    navigate(`/projects/${projectId}/scenes`, {
      replace: true,
      state: {
        message: `"${scene.name}" was deleted successfully.`,
      },
    });
  };

  if (loading) {
    return (
      <DetailPageState
        state="loading"
        resourceName="Scene"
        loadingText="Loading scene details..."
        backTo={`/projects/${projectId}/scene`}
        backLabel="Back to scenes"
      />
    );
  }

  if (notFound) {
    return (
      <DetailPageState
        state="not-found"
        resourceName="Scene"
        description="The selected scene or its project does not exist."
        backTo={`/projects/${projectId}/scenes`}
        backLabel="Back to scenes"
      />
    );
  }

  if (error) {
    return (
      <DetailPageState
        state="error"
        resourceName="Scene"
        message={error}
        onRetry={retry}
        backTo={`/projects/${projectId}/scenes`}
        backLabel="Back to scenes"
      />
    );
  }

  return (
    <main className="detail-page">
      <article className="detail">
        <Link
          to={`/projects/${projectId}/scenes`}
          className="detail__back-link"
        >
          <ArrowLeftIcon />
          Back to scenes
        </Link>

        <header className="detail__hero">
          <div className="detail__hero-content">
            <div className="detail__heading-row">
              <p className="detail__eyebrow">Scene Workspace</p>

              <span className="detail__status">{scene.status}</span>
            </div>

            <h1>{scene.name}</h1>

            <p className="detail__description">
              {scene.description || "No scene description has been added."}
            </p>
          </div>

          <div className="detail__actions">
            <Link
              to={`/projects/${projectId}/scenes/${scene.id}/edit`}
              className="detail__edit-link"
            >
              <PencilSquareIcon />
              Edit scene
            </Link>

            <DeleteButton
              itemName={scene.name}
              itemType="scene"
              warning="This permanently removes the scene and its related scene data, but retains associated characters and locations."
              onDelete={handleDeleteScene}
            />
          </div>
        </header>

        <section className="detail__metadata">
          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <PencilSquareIcon />
            </div>

            <div>
              <span className="detail__metadata-label">Status</span>

              <strong className="detail__metadata-value">{scene.status}</strong>
            </div>
          </article>

          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <CalendarDaysIcon />
            </div>

            <div>
              <span className="detail__metadata-label">Created</span>

              <strong className="detail__metadata-value">
                {formatDate(scene.created_at)}
              </strong>
            </div>
          </article>

          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <ClockIcon />
            </div>

            <div>
              <span className="detail__metadata-label">Last Updated</span>

              <strong className="detail__metadata-value">
                {formatDate(scene.updated_at)}
              </strong>
            </div>
          </article>
        </section>

        <section className="detail__overview">
          <div className="detail__section-heading">
            <p className="detail__eyebrow">Overview</p>

            <h2>About this scene</h2>

            <p>
              Review the scene's core information before, during, and after
              development.
            </p>
          </div>

          <dl className="detail__information-list">
            <div className="detail__information-row">
              <dt>Location</dt>
              <dd className="detail__genres">
                <span
                  className={
                    scene.location && scene.location != "Undecided"
                      ? "detail__genre"
                      : ""
                  }
                >
                  {scene.location || "Undecided"}
                </span>
              </dd>
            </div>
            <div className="detail__information-row">
              <dt>Characters</dt>
              <dd className="detail__genres">
                {scene.characters?.length ? (
                  scene.characters.map((character) => (
                    <span
                      key={character}
                      className={
                        character != "Undecided" ? "detail__genre" : ""
                      }
                    >
                      {character}
                    </span>
                  ))
                ) : (
                  <span className="detail__metadata-value">No characters</span>
                )}
              </dd>
            </div>

            <div className="detail__information-row">
              <dt>Scene Order</dt>
              <dd>#{scene.scene_order}</dd>
            </div>

            <div className="detail__information-row">
              <dt>Timeline Order</dt>
              <dd>#{scene.timeline_order}</dd>
            </div>
          </dl>
        </section>

        <section className="detail__overview-single">
          <div className="detail__section-heading">
            <p className="detail__eyebrow">Elements</p>
            <h2>Location & Characters</h2>
          </div>

          {scene.characters == ["Undecided"] ? (
            <div className="detail__related-grid">
              {scene.location && scene.location != "Undecided" ? (
                <div className="detail__related-card">
                  <MapPinIcon className="detail__related-icon" />

                  <span className="detail__related-label">Location</span>

                  <strong className="detail__related-title">
                    {scene.location}
                  </strong>
                </div>
              ) : (
                ""
              )}
              {scene.characters !=
                ["Undecided"]?.map((character) => (
                  <div className="detail__related-card">
                    <UserGroupIcon className="detail__related-icon" />

                    <span className="detail__related-label">Character</span>

                    <strong className="detail__related-title">
                      {character}
                    </strong>
                  </div>
                  // </Link>
                ))}
            </div>
          ) : (
            <span className="detail__metadata-value">
              No characters or locations have been selected for this scene.
            </span>
          )}
        </section>

        <section className="detail__overview-single">
          <div className="detail__section-heading">
            <p className="detail__eyebrow">Planning</p>

            <h2>Creator's Notes</h2>
            <textarea
              className="detail__notes"
              value={scene.notes || "No notes have been added for this scene."}
              readOnly
              rows={6}
              style={{ height: "auto" }}
              ref={(el) => {
                if (el) {
                  el.style.height = "auto";
                  el.style.height = `${el.scrollHeight}px`;
                }
              }}
            />
          </div>
        </section>
      </article>
    </main>
  );
};

export default SceneDetail;
