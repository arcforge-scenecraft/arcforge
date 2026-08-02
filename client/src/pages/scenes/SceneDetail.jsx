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

import {
  DeleteButton,
  DetailPageState,
  Notification,
} from "../../components/ui";
import useScene from "../../hooks/scenes/useScene";
import useCharacters from "../../hooks/characters/useCharacters";
import { deleteScene, updateScene } from "../../services/sceneApi";
import { assignCharacterToScene, deleteSceneCharacter, updateSceneCharacter } from "../../services/scene-characterApi";
import { getCharacters, getCharacter } from "../../services/characterApi";
import { getLocations } from "../../services/locationApi";
import MiniCard from "../../components/ui/MiniCard";
import useRouteNotification from "../../hooks/useRouteNotification";

const UNDECIDED = "undecided";
const UNDEFINED_TEXT = "undefined";

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const normalizeText = (value, fallback) => {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  return value.trim();
};

const normalizeCharacters = (value) => {
  const characters = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? [value]
      : [];

  return [
    ...new Set(
      characters
        .filter((character) => typeof character === "string")
        .map((character) => character.trim())
        .filter((character) => {
          const normalizedCharacter = character.toLowerCase();

          return (
            character &&
            normalizedCharacter !== UNDECIDED &&
            normalizedCharacter !== UNDEFINED_TEXT
          );
        }),
    ),
  ];
};

const normalizeLocation = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  const location = value.trim();
  const normalizedLocation = location.toLowerCase();

  if (
    !location ||
    normalizedLocation === UNDECIDED ||
    normalizedLocation === UNDEFINED_TEXT
  ) {
    return "";
  }

  return location;
};

const formatOrder = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not set";
  }

  const order = Number(value);

  if (!Number.isInteger(order) || order <= 0) {
    return "Not set";
  }

  return `#${order}`;
};

const SceneDetail = () => {
  const { projectId, sceneId } = useParams();
  const navigate = useNavigate();

  const { notification, dismissNotification } = useRouteNotification();

  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characterOptions, setcharacterOptions] = useState(null);
  const [characterDictionary, setcharacterDictionary] = useState(null);
  const [characterOptionIds, setCharacterOptionIds] = useState(null);
  const [formData, setFormData] = useState(null);

  const [viewLocation, setViewLocation] = useState(false);
  const [addLocation, setAddLocation] = useState(false);
  const [locationOptions, setLocationOptions] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  const {
    scene,
    setScene,
    loading,
    setLoading,
    error,
    notFound,
    retry,
  } = useScene(projectId, sceneId, true);


  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const [characters, locations] = await Promise.all([
          getCharacters(projectId),
          getLocations(projectId),
        ]);

        let characterDict = {};
        characters.forEach(character => characterDict[character.id] = character.name);
        const currentCharacters = Array.isArray(scene.characters) && scene.characters.length > 0 ? scene.characters.map(character => character.character_id) : [-1]
        console.log("Current Characters:", currentCharacters)
        const ids = characters.map(character => character.id).filter(id => !currentCharacters.includes(id));

        setcharacterOptions(characters);
        setcharacterDictionary(characterDict);
        setCharacterOptionIds(ids);

        setLocationOptions(locations);

      } catch (err) {
        console.error("Error loading character options:", err);
      }
      setLoading(false);
    };

    if (scene && !loading && !error) {
      fetchOptions();
    }
  });

  const { characters } = useCharacters(projectId);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...formData,
      [name]: value,
    }));
  };

  const handleCharacterChange = (event) => {
    const { name, value } = event.target;

    const newCharacter = characterOptions.find(c => c.id == value);

    setFormData((currentData) => ({
      ...formData,
      [name]: value,
      name: newCharacter.name,
      description: newCharacter.description,
      story_role: newCharacter.story_role,
      goal: newCharacter.goal,
      knowledge_notes: newCharacter.knowledge_notes,
    }));
  };

  const handleLocationChange = (event) => {
    const { name, value } = event.target;

    const newLocation = locationOptions.find(l => l.id == value);

    setFormData((currentData) => ({
      [name]: value,
      name: newLocation.name,
      description: newLocation.description,
      atmosphere: newLocation.atmosphere,
    }));
  };

  const handleDeleteScene = async () => {
    try {
      setIsDeleting(true);
      await deleteScene(projectId, scene.id);

      navigate(`/projects/${projectId}/scenes`, {
        replace: true,
        state: {
          notification: {
            type: "success",
            title: "Scene Deleted",
            message: `"${sceneName}" was deleted successfully.`,
          },
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
      console.log("Character to delete", selectedCharacter, "from", scene.characters)
      console.log("Name list w/o character", scene.characters.filter(c => c != selectedCharacter.name))


      await deleteSceneCharacter(projectId, scene.id, selectedCharacter.character_id);

      if (scene.characters.length == 1) {
        await updateScene(projectId, scene.id, { ...scene, location: scene.location[1], characters: ["Undecided"] })
        setScene({ ...scene, characters: [{ character_id: -1, name: "Undecided", role_in_scene: "", knowledge_gained: "" }] })
      } else {
        await updateScene(projectId, scene.id, { ...scene, location: scene.location[1], characters: scene.characters.map(c => c.name).filter(c => c != selectedCharacter.name) })
        setScene({ ...scene, characters: scene.characters.filter(c => c.character_id != selectedCharacter.character_id) });
      }

      setSelectedCharacter(null);
      setIsEditing(false);
    } catch (error) {
      console.log("Failed to remove scene character:", error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSceneLocation = async () => {
    try {
      setIsDeleting(true);
      await updateScene(projectId, scene.id, { ...scene, location: "Undecided" })
      setViewLocation(false);
      setScene({ ...scene, location: [-1, "Undecided", "", ""] });
    } catch (error) {
      console.log("Failed to remove scene location:", error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateNotes = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      await updateScene(
        projectId, sceneId,
        {
          ...scene,
          characters: scene.characters.map(c => c.name),
          location: scene.location[1],
          notes: formData.notes,
        }
      );

      console.log("Updated scene notes:", formData.notes);

      setIsEditing(false);
      setFormData(null);
      setScene({ ...scene, notes: formData.notes });
    } catch (error) {
      console.log(error.message || "Unable to update the scene notes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSceneCharacter = async (event) => {
    console.log("Calling handleUpdateSceneCharacter", formData);
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const updatedSceneCharacter = { ...selectedCharacter, role_in_scene: formData.role_in_scene.trim(), knowledge_gained: formData.knowledge_gained.trim() };
      await updateSceneCharacter(
        projectId, sceneId,
        selectedCharacter.character_id,
        {
          role_in_scene: formData.role_in_scene.trim(),
          knowledge_gained: formData.knowledge_gained.trim()
        });

      console.log("Updated scene-character:", updatedSceneCharacter);

      setIsEditing(false);
      setSelectedCharacter(updatedSceneCharacter);

      setScene({ ...scene, characters: scene.characters.map(c => c.character_id == selectedCharacter.character_id ? updatedSceneCharacter : c) })
    } catch (error) {
      console.log(error.message || "Unable to update the scene or scene-character connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSceneCharacter = async (event) => {
    console.log("Calling handleAddSceneCharacter", formData);

    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (formData.character_id == null || formData.character_id == -1 || formData.character_id == "") {
      setIsEditing(false);
      setSelectedCharacter(null);
      setFormData(null);
      console.log("Unable to add scene-character connection.")
      return;
    } else {
      try {
        setIsSubmitting(true);

        const characterData = await getCharacter(projectId, formData.character_id);

        const addSceneCharacter = await assignCharacterToScene(
          projectId, sceneId,
          {
            character_id: formData.character_id,
            role_in_scene: formData.role_in_scene.trim(),
            knowledge_gained: formData.knowledge_gained.trim()
          });

        if (scene.characters.map(c => c.character_id).includes(-1)) {
          await updateScene(projectId, sceneId, {
            ...scene,
            location: scene.location[1],
            characters: [characterData.name]
          })
          setScene({ ...scene, characters: [{ ...addSceneCharacter, ...characterData }] })
        } else {
          await updateScene(projectId, sceneId, {
            ...scene,
            location: scene.location[1],
            characters: [...scene.characters.map(c => c.name), characterData.name]
          })
          setScene({ ...scene, characters: [...scene.characters, { ...addSceneCharacter, ...characterData }] });
        }

        setIsEditing(false);
        setSelectedCharacter({ ...addSceneCharacter, ...characterData });

      } catch (error) {
        console.log(error.message || "Unable to update the scene or add the scene-character connections.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleAddLocation = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (formData.location_id == null || formData.location_id == "") {
      console.log("Unable to add scene location.")
      setIsEditing(false);
      setAddLocation(false);
      setFormData(null);
      return;
    } else {
      try {
        setIsSubmitting(true);

        await updateScene(
          projectId, sceneId,
          {
            ...scene,
            characters: scene.characters.map(c => c.name),
            location: formData.name,
          }
        );

        console.log("Added scene location:", formData.name);

        setIsEditing(false);
        setAddLocation(false);
        setViewLocation(true);

        setScene({ ...scene, location: [formData.location_id, formData.name, formData.description || "", formData.atmosphere || ""] });
      } catch (error) {
        console.log(error.message || "Unable to update the scene or scene-character connections.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <DetailPageState
        state="loading"
        resourceName="Scene"
        loadingText="Loading scene details..."
        backTo={`/projects/${projectId}/scenes`}
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

  if (!scene) {
    return (
      <DetailPageState
        state="not-found"
        resourceName="Scene"
        description="The selected scene could not be found."
        backTo={`/projects/${projectId}/scenes`}
        backLabel="Back to scenes"
      />
    );
  }

  const sceneName = normalizeText(scene.name, "Untitled scene");

  const sceneDescription = normalizeText(
    scene.description,
    "No description has been added for this scene yet.",
  );

  const sceneStatus = normalizeText(scene.status, "Planning");

  const sceneNotes = normalizeText(
    scene.notes,
    "No planning notes have been added for this scene yet.",
  );

  const sceneCharacters = normalizeCharacters(scene.characters);

  const sceneLocation = normalizeLocation(scene.location);

  // const hasSceneElements = Boolean(sceneLocation) || sceneCharacters.length > 0;

  return (
    <main className="detail-page">
      <article className="detail" aria-labelledby="scene-detail-heading">
        <Link
          to={`/projects/${projectId}/scenes`}
          className="detail__back-link"
        >
          <ArrowLeftIcon aria-hidden="true" />
          Back to scenes
        </Link>

        {notification && (
          <Notification {...notification} onDismiss={dismissNotification} />
        )}

        <header className="detail__hero detail__hero--scene">
          <div className="detail__hero-content">
            <div className="detail__heading-row">
              <p className="detail__eyebrow">Scene workspace</p>

              <span className="detail__status">{sceneStatus}</span>
            </div>

            <h1 id="scene-detail-heading">{sceneName}</h1>

            <p className="detail__description">{sceneDescription}</p>
          </div>

          <div className="detail__actions">
            <Link
              to={`/projects/${projectId}/scenes/${sceneId}/edit`}
              className="detail__edit-link"
            >
              <PencilSquareIcon aria-hidden="true" />
              Edit scene
            </Link>

            <DeleteButton
              variant="detail"
              itemName={sceneName}
              itemType="scene"
              label="Delete scene"
              warning="This permanently removes the scene and its related scene data, but retains associated characters and locations."
              onDelete={handleDeleteScene}
            />
          </div>
        </header>

        <section className="detail__metadata" aria-label="Scene information">
          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <PencilSquareIcon aria-hidden="true" />
            </div>

            <div>
              <span className="detail__metadata-label">Status</span>

              <strong className="detail__metadata-value">{sceneStatus}</strong>
            </div>
          </article>

          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <CalendarDaysIcon aria-hidden="true" />
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
              <ClockIcon aria-hidden="true" />
            </div>

            <div>
              <span className="detail__metadata-label">Last updated</span>

              <strong className="detail__metadata-value">
                {formatDate(scene.updated_at)}
              </strong>
            </div>
          </article>
        </section>

        <section
          className="detail__overview"
          aria-labelledby="scene-structure-heading"
        >
          <div className="detail__section-heading">
            <p className="detail__eyebrow">Overview</p>

            <h2>About this scene</h2>

            <p>
              Review the scene's core information, and compare where this scene appears in the written story with where
              it occurs chronologically.
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
                      key={`Character${character.character_id}`}
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
              <dt>Scene order</dt>
              <dd>{formatOrder(scene.scene_order)}</dd>
            </div>

            <div className="detail__information-row">
              <dt>Timeline order</dt>
              <dd>{formatOrder(scene.timeline_order)}</dd>
            </div>
          </dl>
        </section>

        <section
          className="detail__overview-single"
          aria-labelledby="scene-elements-heading"
        >
          <div className="detail__section-heading">
            <p className="detail__eyebrow">Elements</p>

            <h2 id="scene-elements-heading">Location and characters</h2>

            <p>Review the setting and cast connected to this scene.</p>
          </div>

          <div className="detail__related-grid">
            {scene.location && scene.location[0] != -1 ?
              <button
                key={`LocationCard${scene.location[0]}`}
                type="button"
                className="detail__related-card"
                onClick={() => {
                  setViewLocation(true);
                  setFormData({ location_id: scene.location[0], name: scene.location[1], description: scene.location[2], atmosphere: scene.location[3] })
                }}
              >
                <MapPinIcon className="detail__related-icon" />

                <span className="detail__related-label">Location</span>

                <strong className={scene.location && scene.location[1] != "Undecided" ? "detail__related-title" : "detail__related-title2"}>{scene.location[1]}</strong>
              </button> : ""
            }

            {Array.isArray(scene.characters) && scene.characters?.filter(item => item.name !== "Undecided").map((character) => (
              <button
                key={`CharacterCard${character.character_id}`}
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
            {!scene.location || scene.location[0] == -1 ?
              <button
                key="Location"
                type="button"
                className="detail__related-card2"
                onClick={() => {
                  setAddLocation(true);
                  setFormData({ location_id: "" })
                }}
              >
                <MapPinIcon className="detail__related-icon" />

                <span className="detail__related-label">Location</span>

                <strong className="detail__related-title2">Add Location</strong>
              </button> : ""
            }

            {characterOptionIds && characterOptionIds.length > 0 ?
              <button
                key="Character"
                type="button"
                className="detail__related-card2"
                onClick={() => {
                  setSelectedCharacter({ name: "", character_id: -1, role_in_scene: "", knowledge_gained: "" });
                  setFormData({ character_id: "", role_in_scene: "", knowledge_gained: "" })
                  setIsEditing(true);
                }
                }
              >
                <UserGroupIcon className="detail__related-icon" />

                <span className="detail__related-label">Character</span>

                <strong className="detail__related-title2">Add Character</strong>

              </button> : ""
            }
          </div>
        </section>

        <section className="detail__overview-single">
          <div className="detail__section-heading detail__section-header">
            <div>
              <p className="detail__eyebrow">Planning</p>
              <h2>Creator&apos;s Notes</h2>
              <p>
                Keep planning details, reminders, and development ideas connected
                to this scene.
              </p>
            </div>

            {!isEditing || !formData.notes ? (
              <div className="detail__notes-buttons">
                <button
                  className="detail__edit-link"
                  onClick={() => {
                    setFormData({ notes: scene.notes });
                    setIsEditing(true);
                  }}
                >
                  <PencilSquareIcon />
                  Edit
                </button>
              </div>

            ) :
              <div className="detail__notes-buttons">
                <button
                  className="detail__edit-link"
                  type="submit"
                  onClick={handleUpdateNotes}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(null);
                  }}
                >
                  Cancel
                </button>
              </div>}
          </div>

          {!isEditing || !formData.notes ? (
            <textarea
              className="detail__notes"
              value={scene.notes || "No notes have been added for this scene."}
              readOnly
              rows={6}
            />
          ) : (
            <div className="form-field">
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any relevant notes about the scene."
                rows={6}
              />
            </div>
          )}
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
                <p className="detail__eyebrow">{!isEditing ? "Character" : selectedCharacter.character_id != -1 ? "Edit Character" : "Add Character"}</p>
                <h2>{selectedCharacter.character_id != -1 ? selectedCharacter.name : "Select character"}</h2>
              </div>

              {selectedCharacter.description ? <p>{selectedCharacter.description}</p> : ""}

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
                <form onSubmit={scene.characters && scene.characters.map(c => c.character_id).includes(selectedCharacter.character_id) && !scene.characters.map(c => c.character_id).includes(-1) ? handleUpdateSceneCharacter : handleAddSceneCharacter}>
                  <fieldset className="form-fields" disabled={isSubmitting}>
                    <label></label>

                    {selectedCharacter.character_id == -1 ?
                      <>
                        <div className="genre-options">
                          {characterOptionIds.map((id) => {
                            const isSelected = formData.character_id == id;

                            return (
                              <label
                                key={`CharacterOption${id}`}
                                className={`genre-option ${isSelected ? "genre-option-selected" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  name="character_id"
                                  value={id}
                                  checked={isSelected}
                                  onChange={handleCharacterChange}
                                />

                                <span className="genre-option-content">
                                  <span className="genre-checkmark" aria-hidden="true">
                                    {isSelected ? "✓" : ""}
                                  </span>

                                  {characterDictionary[id]}
                                </span>
                              </label>
                            )
                          }
                          )}
                        </div>

                        {formData.character_id && formData.character_id != "" ?
                          < MiniCard
                            heading={`${formData.name} | ${formData.story_role}`}
                            fields={["Description", "goal"]}
                            data={formData}
                          /> : ""}
                      </> : ""
                    }

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
                        {selectedCharacter.character_id != -1 ? (isSubmitting ? "Saving..." : "Save") : (isSubmitting ? "Adding..." : "Add")}
                      </button>

                      <button className="secondary-button"
                        onClick={() => {
                          setIsEditing(false);
                          if (selectedCharacter.character_id == -1) {
                            setSelectedCharacter(null);
                          }
                        }}
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

        {addLocation && (
          <div
            className="popup__overlay"
            onClick={() => setAddLocation(false)}
          >
            <div
              className="popup"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="popup__close"
                onClick={() => setAddLocation(false)}
              >
                ×
              </button>

              <div className="detail__section-heading">
                <p className="detail__eyebrow">{isEditing ? "Edit Location" : "Add Location"}</p>
                <h2>Select Location</h2>
              </div>
              <form onSubmit={handleAddLocation}>
                <fieldset className="form-fields">
                  <label></label>

                  <div className="genre-options">
                    {locationOptions.map((location) => {
                      const isSelected = formData.location_id == location.id;

                      return (
                        <label
                          key={`LocationOption${location.id}`}
                          className={`genre-option ${isSelected ? "genre-option-selected" : ""}`}
                        >
                          <input
                            type="checkbox"
                            name="location_id"
                            value={location.id}
                            checked={isSelected}
                            onChange={handleLocationChange}
                          />

                          <span className="genre-option-content">
                            <span className="genre-checkmark" aria-hidden="true">
                              {isSelected ? "✓" : ""}
                            </span>

                            {location.name}
                          </span>
                        </label>
                      )
                    }
                    )}
                  </div>

                  {formData.location_id ?
                    <>
                      < MiniCard
                        heading={formData.name}
                        fields={["Description", "Atmosphere"]}
                        data={formData}
                      />
                    </> : ""
                  }

                  <div className="popup__actions">
                    <button className="detail__edit-link"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isEditing ? (isSubmitting ? "Saving..." : "Save") : (isSubmitting ? "Adding..." : "Add")}
                    </button>

                    <button className="secondary-button"
                      onClick={() => {
                        setIsEditing(false);
                        setAddLocation(null);
                        if (scene.location[0] != -1) {
                          setViewLocation(true);
                        }
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>)}

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
                  <button className="detail__edit-link"
                    onClick={() => {
                      setFormData({ location_id: scene.location[0], name: scene.location[1], description: scene.location[2], atmosphere: scene.location[3] })
                      setIsEditing(true)
                      setAddLocation(true)
                      setViewLocation(false)
                    }}
                  >
                    <PencilSquareIcon />
                    Edit
                  </button>

                  <Link to={`/projects/${scene.project_id}/locations/${scene.location[0]}`} className="secondary-button">
                    Explore
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
        <footer className="detail__footer-navigation">
          <Link
            to={`/projects/${projectId}`}
            className="button button--secondary"
          >
            Back to project
          </Link>

          <Link
            to={`/projects/${projectId}/scenes`}
            className="button button--secondary"
          >
            View all scenes
          </Link>
        </footer>
      </article>
    </main >
  );
};

export default SceneDetail;
