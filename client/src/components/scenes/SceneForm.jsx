import { useEffect, useState } from "react";
import { getCharacters } from "../services/CharactersAPI";
import { getLocations } from "../services/LocationsAPI";

const EMPTY_SCENE = {
    project_id: "",
    title: "",
    summary: "",
    sceneOrder: 0,
    timelineOrder: 0,
    notes: "",
    location: "",
    characters: [],
    status: "Planning",
};

const normalizeSceneValues = (values = {}) => ({
  ...EMPTY_SCENE,
  ...values,

  // Ensures genre is always an array when editing.
  characters: Array.isArray(values.characters) ? values.characters : [],

  status: values.status || "Planning",
});

const SceneForm = ({
  initialValues = EMPTY_SCENE,
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
  const [characterOptions, setCharacterOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);


  useEffect(() => {
    setFormData(normalizeSceneValues(initialValues));
  }, [initialValues]);

  useEffect(() => {
  const fetchOptions = async () => {
    try {
        const [characters, locations] = await Promise.all([
            getCharacters(),
            getLocations(),
        ]);

        setCharacterOptions(...characters, "Undecided");
        setLocationOptions(...locations, "Undecided");
    } catch (err) {
        setCharacterOptions(["Undecided"]);
        setLocationOptions(["Uncdecided"]);
        console.error("Error loading form options:", err);
    }
  };

  fetchOptions();
}, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }
  };

  const handleGenreChange = (selectedCharacter) => {
    setFormData((currentData) => {
      const currentCharacters = Array.isArray(currentData.characters)
        ? currentData.characters
        : [];

      /*
       * Undecided is exclusive:
       * - Selecting it removes all specific characters.
       * - Selecting a specific character removes Undecided.
       */
      if (selectedCharacter === "Undecided") {
        return {
          ...currentData,
          genre: currentCharacters.includes("Undecided") ? [] : ["Undecided"],
        };
      }

      const charactersWithoutUndecided = currentCharacters.filter(
        (character) => character !== "Undecided",
      );

      const isAlreadySelected = charactersWithoutUndecided.includes(selectedCharacter);

      const updatedCharacters = isAlreadySelected
        ? charactersWithoutUndecided.filter((genre) => genre !== selectedCharacter)
        : [...charactersWithoutUndecided, selectedCharacter];

      return {
        ...currentData,
        genre: updatedCharacters,
      };
    });

    if (validationErrors.characters) {
      setValidationErrors((currentErrors) => ({
        ...currentErrors,
        characters: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const trimmedTitle = formData.title.trim();

    if (!trimmedTitle) {
      errors.title = "Scene title is required.";
    } else if (trimmedTitle.length > 255) {
      errors.title = "Scene title must be 255 characters or fewer.";
    }

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

    onSubmit({
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        sceneOrder: parseInt(formData.sceneOrder.trim(), 10),
        timelineOrder: parseInt(formData.timelineOrder.trim(), 10),
        notes: formData.notes.trim(),
        location: formData.location,
        characters: formData.characters,
        status: formData.status
    });
  };

  return (
    <form className="project-form" onSubmit={handleSubmit} noValidate>
      {apiError && (
        <div className="form-api-error" role="alert" aria-live="polite">
          {apiError}
        </div>
      )}

      <fieldset className="project-form-fields" disabled={isSubmitting}>
        <div className="form-field">
          <label htmlFor="title">
            Scene title <span aria-hidden="true">*</span>
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            maxLength={255}
            placeholder="Enter your scene title"
            aria-invalid={Boolean(validationErrors.title)}
            aria-describedby={
              validationErrors.title ? "title-error" : undefined
            }
          />

          {validationErrors.title && (
            <small id="title-error" className="field-error" role="alert">
              {validationErrors.title}
            </small>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="summary">Summary</label>

          <textarea
            id="summary"
            name="summary"
            rows="6"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Describe the main event(s) of the scene."
          />
        </div>

        <div className="form-field">
          <label htmlFor="sceneOrder">Scene Order</label>

          <textarea
            id="sceneOrder"
            name="sceneOrder"
            rows="1"
            value={formData.sceneOrder}
            onChange={handleChange}
            placeholder="0"
          />
        </div>

        <div className="form-field">
          <label htmlFor="timelineOrder">Timeline Order</label>

          <textarea
            id="timelineOrder"
            name="timelineOrder"
            rows="1"
            value={formData.timelineOrder}
            onChange={handleChange}
            placeholder="0"
          />
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

        <fieldset
          className="genre-field"
          aria-describedby="genre-help selected-genres"
        >
          <legend>Characters</legend>

          <p id="genre-help" className="field-hint">
            Select all characters in the scene. Choose Undecided when you are not sure
            yet.
          </p>

          <div className="genre-options">
            {characterOptions.map((character) => {
              const isSelected = formData.characters.includes(character);

              return (
                <label
                  key={characterOption}
                  className={`genre-option ${
                    isSelected ? "genre-option-selected" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    name="characters"
                    value={character}
                    checked={isSelected}
                    onChange={() => handleGenreChange(character)}
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
            id="selected-genres"
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
              <span className="selected-genres-empty">No characters selected</span>
            )}
          </div>

          {validationErrors.characters && (
            <small className="field-error" role="alert">
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
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
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
