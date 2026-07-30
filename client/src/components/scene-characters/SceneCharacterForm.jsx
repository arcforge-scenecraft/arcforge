import { useEffect, useState } from "react";
import { getCharacters } from "../../services/characterApi.js";
import { getLocations } from "../../services/locationApi.js";

const EMPTY_SCENE_CHARACTER = {
    scene_id: "",
    character_id: "",
    role_in_scene: "",
    knowledge_gained: "",
};

// const normalizeSceneValues = (values = {}) => ({
//   ...EMPTY_SCENE,
//   ...values,

//   // Ensures characters variable is always an array when editing.
//   characters: Array.isArray(values.characters) ? values.characters : [],

//   status: values.status || "Planning",
// });

const SceneCharacterForm = ({
  initialValues = EMPTY_SCENE_CHARACTER,
  sceneId,
  onSubmit,
  onCancel,
  submitLabel = "Save Scene Character",
  isSubmitting = false,
  apiError = "",
}) => {
  const [formData, setFormData] = useState(() => initialValues);
  
  const [validationErrors, setValidationErrors] = useState({});
  const [characterOptions, setCharacterOptions] = useState({});
  const [characterIds, setCharacterIds] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);


  useEffect(() => {
    setFormData(normalizeSceneValues(initialValues));
  }, [initialValues]);

  useEffect(() => {
    const fetchOptions = async () => {
        try {
            const [characters, locations] = await Promise.all([
                getCharacters(projectId),
                getLocations(projectId),
            ]);

            let updatedCharacters = {};
            updatedCharacters[-1] = "Undecided"
            characters.forEach(character => updatedCharacters[character.id] = character.name);
            const updatedCharacterIds = [...characters.map(character => character.id), -1];
            const updatedLocations = ["Undecided", ...locations.map((location) => location.name)];

            setCharacterOptions(updatedCharacters);
            setCharacterIds(updatedCharacterIds);
            setLocationOptions(updatedLocations);
            
            console.log("Characters:", updatedCharacters)
            console.log("CharacterIds:", updatedCharacterIds)
            console.log("Locations:", updatedLocations)
        } catch (err) {
            console.error("Error loading form options:", err);
        }
    };

    fetchOptions();
  }, [projectId]);

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

  const handleCharacterChange = (selectedCharacter) => {
    setFormData((currentData) => {
      const currentCharacters = Array.isArray(currentData.characters)
        ? currentData.characters
        : [];

      /*
       * Undecided is exclusive:
       * - Selecting it removes all specific characters.
       * - Selecting a specific character removes Undecided.
       */
      if (selectedCharacter === -1) {
        return {
          ...currentData,
          characters: currentCharacters.includes(-1) ? [] : [-1],
        };
      }

      const charactersWithoutUndecided = currentCharacters.filter(
        (character) => character !== -1,
      );

      const isAlreadySelected = charactersWithoutUndecided.includes(selectedCharacter);

      const updatedCharacters = isAlreadySelected
        ? charactersWithoutUndecided.filter((character) => character !== selectedCharacter)
        : [...charactersWithoutUndecided, selectedCharacter];

      return {
        ...currentData,
        characters: updatedCharacters,
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
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      errors.name = "Scene name is required.";
    } else if (trimmedName.length > 255) {
      errors.name = "Scene name must be 255 characters or fewer.";
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

    // let characterNameList = [];

    console.log("Selected characters' ids:", formData.characters)

    // formData.characters.forEach(id => characterNameList.push(characterOptions[id]));

    console.log(formData.characters.map(id => characterOptions[id]))

    onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim(),
        scene_order: parseInt(formData.scene_order, 10),
        timeline_order: parseInt(formData.timeline_order, 10),
        notes: formData.notes.trim(),
        location: formData.location,
        characters: formData.characters.map(id => characterOptions[id]),
        status: formData.status
    }, formData.characters);
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {apiError && (
        <div className="form-api-error" role="alert" aria-live="polite">
          {apiError}
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
            aria-describedby={
              validationErrors.name ? "name-error" : undefined
            }
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
          <label htmlFor="sceneOrder">Scene Order</label>

          <input
            id="sceneOrder"
            name="scene_order"
            type="text"
            value={formData.scene_order}
            onChange={handleChange}
            maxLength={255}
            placeholder="Where does this happen in the story?"
          />
        </div>

        <div className="form-field">
          <label htmlFor="timelineOrder">Timeline Order</label>

          <input
            id="timelineOrder"
            name="timeline_order"
            type="text"
            value={formData.timeline_order}
            onChange={handleChange}
            maxLength={255}
            placeholder="Where does this happen in the timeline?"
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

        <div className="form-field">
          <label htmlFor="status">Location</label>

          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          >
            {locationOptions.map((location) => {
                return(<option key={location} value={location}>{location}</option>)
            })}
          </select>
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
            {characterIds.map((id) => {
              const isSelected = formData.characters.includes(id);

              return (
                <label
                  key={id}
                  className={`genre-option ${
                    isSelected ? "genre-option-selected" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    name="characters"
                    value={characterOptions[id]}
                    checked={isSelected}
                    onChange={() => handleCharacterChange(id)}
                  />

                  <span className="genre-option-content">
                    <span className="genre-checkmark" aria-hidden="true">
                      {isSelected ? "✓" : ""}
                    </span>

                    {characterOptions[id]}
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
                {formData.characters.map((id) => (
                  <span key={id} className="selected-genre">
                    {characterOptions[id]}
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
            <option key="Planning" value="Planning">Planning</option>
            <option key="In-Progress" value="In Progress">In Progress</option>
            <option key="On-Hold" value="On Hold">On Hold</option>
            <option key="Completed" value="Completed">Completed</option>
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