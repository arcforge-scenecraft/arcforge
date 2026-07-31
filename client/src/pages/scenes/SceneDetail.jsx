import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  PencilSquareIcon,
  UserGroupIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import SceneDeleteButton from "../../components/scenes/SceneDeleteButton";
import { ErrorState, Loader } from "../../components/ui";
import useScene from "../../hooks/scenes/useScene";
import { deleteScene, updateScene } from "../../services/sceneApi";
import { deleteSceneCharacter, updateSceneCharacter } from "../../services/scene-characterApi";
// import { getCharacters } from "../../services/characterApi";
// import { getSceneCharacterById } from "../../services/scene-characterApi";

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

  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [formData, setFormData] = useState(null);

  const [viewLocation, setViewLocation] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    scene,
    loading,
    error,
    retry,
  } = useScene(projectId, sceneId);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...formData,
      [name]: value,
    }));
  };

  const handleDeleteScene = async () => {
    try {
      setIsDeleting(true);
      await deleteScene(projectId, scene.id);

      navigate(`/projects/${projectId}/scenes`, {
        replace: true,
        state: {
          message: `"${scene.name}" was deleted successfully.`,
        },
      });
    } catch (error) {
      console.log(error.message || "Unable to delete the scene or scene-character connections.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSceneCharacter = async () => {
    try {
      setIsDeleting(true);
      await deleteSceneCharacter(projectId, scene.id, selectedCharacter.character_id);
      await updateScene(projectId, scene.id, { ...scene, location: scene.location[1], characters: scene.characters.filter(c => c === selectedCharacter.name) })
      setSelectedCharacter(null);
      setIsEditing(false);
      retry();
    } catch (error) {
      console.log("Failed to remove scene character:", error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSceneLocation = async () => {
    try {
      setIsDeleting(true);
      await updateScene(projectId, scene.id, { ...scene, location: "Undefined"})
      setViewLocation(false);
      retry();
    } catch (error) {
      console.log("Failed to remove scene location:", error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const updatedSceneCharacter = await updateSceneCharacter(
        projectId, sceneId,
        selectedCharacter.character_id,
        {
          role_in_scene: formData.role_in_scene.trim(),
          knowledge_gained: formData.knowledge_gained.trim()
        });

      console.log("Updated scene-character:", updateSceneCharacter);

      setIsEditing(false);
      setSelectedCharacter(updatedSceneCharacter);

      retry();
    } catch (error) {
      console.log(error.message || "Unable to update the scene or scene-character connections.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="detail-page">
        <section className="detail">
          <Link
            to={`/projects/${projectId}/scenes`}
            className="detail__back-link"
          >
            <ArrowLeftIcon />
            Back to scenes
          </Link>

          <div className="detail__state">
            <Loader text="Loading scene..." />
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="detail-page">
        <section className="detail">
          <Link
            to={`/projects/${projectId}/scenes`}
            className="detail__back-link"
          >
            <ArrowLeftIcon />
            Back to scenes
          </Link>

          <header className="detail__error-header">
            <p className="detail__eyebrow">Scene</p>
            <h1>Unable to open scene</h1>
          </header>

          <div className="detail__state">
            <ErrorState message={error} onRetry={retry} />
          </div>
        </section>
      </main>
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

              <span className="detail__status">
                {scene.status}
              </span>
            </div>

            <h1>{scene.name}</h1>

            <p className="detail__description">
              {scene.description ||
                "No scene description has been added."}
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

            <SceneDeleteButton
              sceneName={scene.name}
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
              <span className="detail__metadata-label">
                Status
              </span>

              <strong className="detail__metadata-value">
                {scene.status}
              </strong>
            </div>
          </article>

          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <CalendarDaysIcon />
            </div>

            <div>
              <span className="detail__metadata-label">
                Created
              </span>

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
              <span className="detail__metadata-label">
                Last Updated
              </span>

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
              Review the scene's core information before, during, and after development.
            </p>
          </div>

          <dl className="detail__information-list">
            <div className="detail__information-row">
              <dt>Location</dt>
              <dd className="detail__genres">
                {scene.location && scene.location[1] != "Undecided" ?
                  <span className="detail__genre">{scene.location[1]}</span>
                : "No location"}
              </dd>
            </div>
            <div className="detail__information-row">
              <dt>Characters</dt>
              <dd className="detail__genres">
                {scene.characters?.length ? (
                  scene.characters.map(character => (
                    <span
                      key={character.character_id}
                      className={character.name != "Undecided" ? "detail__genre" : ""}
                    >
                      {character.name}
                    </span>
                  ))
                ) : (
                  <span className="detail__metadata-value">
                    No characters
                  </span>
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

          {scene.characters.find(c => c === "Undecided") === undefined && scene.location[1] != "Undecided" ? <div className="detail__related-grid">
            {scene.location && scene.location[1] != "Undecided" ?
              <button
                key={scene.location[0]}
                type="button"
                className="detail__related-card"
                onClick={() => {
                  setViewLocation(true);
                }}
              >
                <MapPinIcon className="detail__related-icon" />

                <span className="detail__related-label">Location</span>

                <strong className="detail__related-title">
                  {scene.location[1]}
                </strong>
              </button> : ""
            }

            {scene.characters?.filter(item => item.name !== "Undecided").map((character) => (
              <button
                key={character.character_id}
                type="button"
                className="detail__related-card"
                onClick={() => {
                  setSelectedCharacter(character);
                  setFormData({ role_in_scene: character.role_in_scene || "", knowledge_gained: character.knowledge_gained || "" })
                  setIsEditing(false);
                }}
              >
                <UserGroupIcon className="detail__related-icon" />

                <span className="detail__related-label">Character</span>

                <strong className="detail__related-title">{character.name}</strong>
              </button>
            ))}
          </div> : <span className="detail__metadata-value">This scene has no associated location or characters.</span>}
        </section>

        <section className="detail__overview-single">
          <div className="detail__section-heading">
            <p className="detail__eyebrow">Planning</p>

            <h2>Creator's Notes</h2>

            {/* <p>{scene.notes}</p> */}
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

        {selectedCharacter && (
          <div
            className="popup__overlay"
            onClick={() => setSelectedCharacter(null)}
          >
            <div
              className="popup"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="popup__close"
                onClick={() => setSelectedCharacter(null)}
              >
                ×
              </button>

              <div className="detail__section-heading">
                <p className="detail__eyebrow">{!isEditing ? "Character" : "Edit Character"}</p>
                <h2>{selectedCharacter.name}</h2>
              </div>

              {selectedCharacter.description? <p>{selectedCharacter.description}</p> : ""}

              {!isEditing ? (
                <fieldset className="form-fields">
                  <label></label>

                  <div className="form-field">
                    <label>Role in Scene</label>

                    <input
                      // className="detail__notes"
                      value={selectedCharacter.role_in_scene || "No role has been added."}
                      readOnly
                    />
                  </div>

                  <div className="form-field">
                    <label>Knowledge Gained</label>

                    <textarea
                      value={selectedCharacter.knowledge_gained ||
                        "Nothing recorded."}
                      rows="6"
                      readOnly
                    />
                  </div>

                  <div className="popup__actions">
                    <button className="detail__edit-link"
                      onClick={() => setIsEditing(true)}
                    >
                      <PencilSquareIcon />
                      Edit
                    </button>

                    <Link to={`/projects/${scene.project_id}/characters/${selectedCharacter.character_id}`} className="secondary-button">
                      Explore
                    </Link>

                    <button className="delete__button"
                      onClick={() => handleDeleteSceneCharacter()}
                      disabled={isDeleting}
                      aria-busy={isDeleting}
                    >
                      <TrashIcon className="delete__icon" aria-hidden="true" />
                      <span>{isDeleting ? "Removing..." : "Remove from scene"}</span>
                    </button>
                  </div>
                </fieldset>
              ) : (
                <form onSubmit={handleSubmit}>
                  <fieldset className="form-fields" disabled={isSubmitting}>
                    <label></label>

                    <div className="form-field">
                      <label>Role</label>
                      <input
                        id="role_in_scene"
                        name="role_in_scene"
                        type="text"
                        value={formData.role_in_scene || ""}
                        maxLength={255}
                        onChange={handleChange}
                        placeholder="Enter the character's scene role (eg. protagonist, mentor, rival)"
                      />
                    </div>

                    <div className="form-field">
                      <label>Knowledge Gained</label>
                      <textarea
                        id="knowledge_gained"
                        name="knowledge_gained"
                        rows="6"
                        value={formData.knowledge_gained || ""}
                        onChange={handleChange}
                        placeholder="What does the character learn in this scene, if anything?"
                      />
                    </div>

                    <div className="popup__actions">
                      <button className="detail__edit-link"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save"}
                      </button>

                      <button className="secondary-button"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </fieldset>
                </form>
              )}
            </div>
          </div>
        )}

        {viewLocation && (
          <div
            className="popup__overlay"
            onClick={() => setViewLocation(false)}
          >
            <div
              className="popup"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="popup__close"
                onClick={() => setViewLocation(false)}
              >
                ×
              </button>

              <div className="detail__section-heading">
                <p className="detail__eyebrow">Location</p>
                <h2>{scene.location[1]}</h2>
              </div>
                <fieldset className="form-fields">
                  <label></label>

                  <div className="form-field">
                    <label>Description</label>

                    <p>{scene.location[2] || "No description listed."}</p>

                    <label>Atmosphere</label>

                    <p>{scene.location[3] || "No atmosphere listed."}</p>
                  </div>

                  <div className="popup__actions">
                    <Link to={`/projects/${scene.project_id}/locations/${scene.location[0]}`} className="secondary-button">
                      View
                    </Link>

                    <button className="delete__button"
                      onClick={() => handleDeleteSceneLocation()}
                      disabled={isDeleting}
                      aria-busy={isDeleting}
                    >
                      <TrashIcon className="delete__icon" aria-hidden="true" />
                      <span>{isDeleting ? "Removing..." : "Remove from scene"}</span>
                    </button>
                  </div>
                </fieldset>
              </div>
            </div>)}
      </article>
    </main>
  );
};

export default SceneDetail;