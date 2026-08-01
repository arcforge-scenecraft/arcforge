import { useEffect, useState } from "react";
import { getCharacters } from "../../services/characterApi.js";
import { getLocations } from "../../services/locationApi.js";

const UNDECIDED = "Undecided";

const STATUS_OPTIONS = ["Planning", "In Progress", "On Hold", "Completed"];

const EMPTY_SCENE = {
  name: "",
  description: "",
  scene_order: "",
  timeline_order: "",
  notes: "",
  location: UNDECIDED,
  characters: [],
  status: "Planning",
};

const normalizeText = (value) => {
  return typeof value === "string" ? value : "";
};

const normalizeOrder = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue >= 0
    ? String(parsedValue)
    : "";
};

const normalizeCharacters = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  const characters = [
    ...new Set(
      value
        .filter((character) => typeof character === "string")
        .map((character) => character.trim())
        .filter(Boolean),
    ),
  ];

  if (characters.includes(UNDECIDED) && characters.length > 1) {
    return characters.filter((character) => character !== UNDECIDED);
  }

  return characters;
};

const normalizeLocation = (value) => {
  const location = normalizeText(value).trim();

  if (!location || location.toLowerCase() === "undefined") {
    return UNDECIDED;
  }

  return location;
};

const normalizeStatus = (value) => {
  return STATUS_OPTIONS.includes(value) ? value : "Planning";
};

const normalizeSceneValues = (values = {}) => {
  const scene = values && typeof values === "object" ? values : {};

  return {
    name: normalizeText(scene.name),
    description: normalizeText(scene.description),
    scene_order: normalizeOrder(scene.scene_order),
    timeline_order: normalizeOrder(scene.timeline_order),
    notes: normalizeText(scene.notes),
    location: normalizeLocation(scene.location),
    characters: normalizeCharacters(scene.characters),
    status: normalizeStatus(scene.status),
  };
};

const SceneForm = ({
  initialValues = EMPTY_SCENE,
  projectId,
  onSubmit,
  onCancel,
  submitLabel = "Save Scene",
  isSubmitting = false,
  apiError = "",
}) => {
  const [formData, setFormData] = useState(() =>
    normalizeSceneValues(initialValues),
  );
  const [validationErrors, setValidationErrors] = useState({});
  const [characterOptions, setCharacterOptions] = useState([UNDECIDED]);
  const [locationOptions, setLocationOptions] = useState([UNDECIDED]);
  const [optionsError, setOptionsError] = useState("");

  useEffect(() => {
    setFormData(normalizeSceneValues(initialValues));
    setValidationErrors({});
  }, [initialValues]);

  useEffect(() => {
    if (!projectId) {
      return undefined;
    }

    const controller = new AbortController();

    const fetchOptions = async () => {
      try {
        setOptionsError("");

        const [characters, locations] = await Promise.all([
          getCharacters(projectId, {
            signal: controller.signal,
          }),
          getLocations(projectId, {
            signal: controller.signal,
          }),
        ]);

        const characterNames = Array.isArray(characters)
          ? characters
              .map((character) => character?.name)
              .filter(
                (name) =>
                  typeof name === "string" &&
                  name.trim() &&
                  name.trim() !== UNDECIDED,
              )
              .map((name) => name.trim())
          : [];

        const locationNames = Array.isArray(locations)
          ? locations
              .map((location) => location?.name)
              .filter(
                (name) =>
                  typeof name === "string" &&
                  name.trim() &&
                  name.trim() !== UNDECIDED,
              )
              .map((name) => name.trim())
          : [];

        setCharacterOptions([UNDECIDED, ...new Set(characterNames)]);

        setLocationOptions([UNDECIDED, ...new Set(locationNames)]);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setOptionsError(
          "Characters and locations could not be loaded. Try refreshing the page.",
        );
      }
    };

    fetchOptions();

    return () => {
      controller.abort();
    };
  }, [projectId]);

  const clearValidationError = (fieldName) => {
    setValidationErrors((currentErrors) => {
      if (!currentErrors[fieldName]) {
        return currentErrors;
      }

      const updatedErrors = { ...currentErrors };
      delete updatedErrors[fieldName];

      return updatedErrors;
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    clearValidationError(name);
  };

  const handleCharacterChange = (selectedCharacter) => {
    setFormData((currentData) => {
      const currentCharacters = Array.isArray(currentData.characters)
        ? currentData.characters
        : [];

      if (selectedCharacter === "Undecided") {
        return {
          ...currentData,
          characters: currentCharacters.includes("Undecided")
            ? []
            : ["Undecided"],
        };
      }

      const charactersWithoutUndecided = currentCharacters.filter(
        (character) => character !== "Undecided",
      );

      const isAlreadySelected =
        charactersWithoutUndecided.includes(selectedCharacter);

      const updatedCharacters = isAlreadySelected
        ? charactersWithoutUndecided.filter(
            (character) => character !== selectedCharacter,
          )
        : [...charactersWithoutUndecided, selectedCharacter];

      return {
        ...currentData,
        characters: updatedCharacters,
      };
    });

    clearValidationError("characters");
  };

  const validateForm = () => {
    const errors = {};
    const trimmedName = normalizeText(formData.name).trim();

    if (!trimmedName) {
      errors.name = "Scene name is required.";
    } else if (trimmedName.length > 255) {
      errors.name = "Scene name must be 255 characters or fewer.";
    }

    const orderFields = [
      {
        name: "scene_order",
        label: "Scene order",
        value: formData.scene_order,
      },
      {
        name: "timeline_order",
        label: "Timeline order",
        value: formData.timeline_order,
      },
    ];

    orderFields.forEach(({ name, label, value }) => {
      if (value === "") {
        return;
      }

      const parsedValue = Number(value);

      if (!Number.isInteger(parsedValue) || parsedValue < 0) {
        errors[name] = `${label} must be a whole number of 0 or greater.`;
      }
    });

    if (!Array.isArray(formData.characters)) {
      errors.characters = "Characters must be provided as a list.";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSubmitting || !validateForm()) {
      return;
    }

    if (typeof onSubmit !== "function") {
      console.error(
        "[Scene Form Error]",
        "An onSubmit function was not provided.",
      );
      return;
    }

    onSubmit({
      name: normalizeText(formData.name).trim(),
      description: normalizeText(formData.description).trim(),
      scene_order:
        formData.scene_order === "" ? 0 : Number(formData.scene_order),
      timeline_order:
        formData.timeline_order === "" ? 0 : Number(formData.timeline_order),
      notes: normalizeText(formData.notes).trim(),
      location: normalizeLocation(formData.location),
      characters: normalizeCharacters(formData.characters),
      status: normalizeStatus(formData.status),
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {apiError && (
        <div className="form-api-error" role="alert" aria-live="polite">
          {apiError}
        </div>
      )}

      {optionsError && (
        <div className="form-api-error" role="alert" aria-live="polite">
          {optionsError}
        </div>
      )}

      <fieldset className="form-fields" disabled={isSubmitting}>
        <div className="form-field">
          <label htmlFor="name">
            Scene name <span aria-hidden="true">*</span>
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            maxLength={255}
            placeholder="Enter your scene name"
            aria-invalid={Boolean(validationErrors.name)}
            aria-describedby={validationErrors.name ? "name-error" : undefined}
          />

          {validationErrors.name && (
            <small id="name-error" className="field-error" role="alert">
              {validationErrors.name}
            </small>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            name="description"
            rows="6"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the main event(s) of the scene."
          />
        </div>

        <div className="form-field">
          <label htmlFor="sceneOrder">Scene order</label>

          <input
            id="sceneOrder"
            name="scene_order"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={formData.scene_order}
            onChange={handleChange}
            placeholder="For example, 3"
            aria-invalid={Boolean(validationErrors.scene_order)}
            aria-describedby={
              validationErrors.scene_order
                ? "scene-order-error"
                : "scene-order-help"
            }
          />

          <small id="scene-order-help" className="field-hint">
            Controls the scene's order in the story.
          </small>

          {validationErrors.scene_order && (
            <small id="scene-order-error" className="field-error" role="alert">
              {validationErrors.scene_order}
            </small>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="timelineOrder">Timeline order</label>

          <input
            id="timelineOrder"
            name="timeline_order"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={formData.timeline_order}
            onChange={handleChange}
            placeholder="For example, 1"
            aria-invalid={Boolean(validationErrors.timeline_order)}
            aria-describedby={
              validationErrors.timeline_order
                ? "timeline-order-error"
                : "timeline-order-help"
            }
          />

          <small id="timeline-order-help" className="field-hint">
            Controls where the scene occurs chronologically.
          </small>

          {validationErrors.timeline_order && (
            <small
              id="timeline-order-error"
              className="field-error"
              role="alert"
            >
              {validationErrors.timeline_order}
            </small>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="notes">Notes</label>

          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any relevant notes about the scene."
          />
        </div>

        <div className="form-field">
          <label htmlFor="location">Location</label>

          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          >
            {locationOptions.map((location) => {
              return (
                <option key={location} value={location}>
                  {location}
                </option>
              );
            })}
          </select>
        </div>

        <fieldset
          className="genre-field"
          aria-invalid={Boolean(validationErrors.characters)}
          aria-describedby={
            validationErrors.characters
              ? "characters-help selected-characters characters-error"
              : "characters-help selected-characters"
          }
        >
          <legend>Characters</legend>

          <p id="characters-help" className="field-hint">
            Select all characters in the scene. Choose Undecided when you are
            not sure yet.
          </p>

          <div className="genre-options">
            {characterOptions.map((character) => {
              const isSelected = formData.characters.includes(character);

              return (
                <label
                  key={character}
                  className={`genre-option ${
                    isSelected ? "genre-option-selected" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    name="characters"
                    value={character}
                    checked={isSelected}
                    onChange={() => handleCharacterChange(character)}
                  />

                  <span className="genre-option-content">
                    <span className="genre-checkmark" aria-hidden="true">
                      {isSelected ? "✓" : ""}
                    </span>

                    {character}
                  </span>
                </label>
              );
            })}
          </div>

          <div
            id="selected-characters"
            className="selected-genres"
            aria-live="polite"
          >
            <span className="selected-genres-label">Selected:</span>

            {formData.characters.length > 0 ? (
              <div className="selected-genre-list">
                {formData.characters.map((character) => (
                  <span key={character} className="selected-genre">
                    {character}
                  </span>
                ))}
              </div>
            ) : (
              <span className="selected-genres-empty">
                No characters selected
              </span>
            )}
          </div>

          {validationErrors.characters && (
            <small id="characters-error" className="field-error" role="alert">
              {validationErrors.characters}
            </small>
          )}
        </fieldset>

        <div className="form-field">
          <label htmlFor="status">Status</label>

          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option key="Planning" value="Planning">
              Planning
            </option>
            <option key="In-Progress" value="In Progress">
              In Progress
            </option>
            <option key="On-Hold" value="On Hold">
              On Hold
            </option>
            <option key="Completed" value="Completed">
              Completed
            </option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default SceneForm;
