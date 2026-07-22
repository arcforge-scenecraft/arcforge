import { useEffect, useState } from "react";

const EMPTY_PROJECT = {
  title: "",
  description: "",
  genre: [],
  status: "Planning",
};

const GENRE_OPTIONS = [
  "Undecided",
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Romance",
  "Horror",
  "Thriller",
  "Adventure",
  "Drama",
  "Comedy",
  "Historical",
  "Slice of Life",
  "Other",
];

const normalizeProjectValues = (values = {}) => ({
  ...EMPTY_PROJECT,
  ...values,

  // Ensures genre is always an array when editing.
  genre: Array.isArray(values.genre) ? values.genre : [],

  status: values.status || "Planning",
});

const ProjectForm = ({
  initialValues = EMPTY_PROJECT,
  onSubmit,
  onCancel,
  submitLabel = "Save Project",
  isSubmitting = false,
  apiError = "",
}) => {
  const [formData, setFormData] = useState(() =>
    normalizeProjectValues(initialValues),
  );

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    setFormData(normalizeProjectValues(initialValues));
  }, [initialValues]);

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

  const handleGenreChange = (selectedGenre) => {
    setFormData((currentData) => {
      const currentGenres = Array.isArray(currentData.genre)
        ? currentData.genre
        : [];

      /*
       * Undecided is exclusive:
       * - Selecting it removes all specific genres.
       * - Selecting a specific genre removes Undecided.
       */
      if (selectedGenre === "Undecided") {
        return {
          ...currentData,
          genre: currentGenres.includes("Undecided") ? [] : ["Undecided"],
        };
      }

      const genresWithoutUndecided = currentGenres.filter(
        (genre) => genre !== "Undecided",
      );

      const isAlreadySelected = genresWithoutUndecided.includes(selectedGenre);

      const updatedGenres = isAlreadySelected
        ? genresWithoutUndecided.filter((genre) => genre !== selectedGenre)
        : [...genresWithoutUndecided, selectedGenre];

      return {
        ...currentData,
        genre: updatedGenres,
      };
    });

    if (validationErrors.genre) {
      setValidationErrors((currentErrors) => ({
        ...currentErrors,
        genre: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const trimmedTitle = formData.title.trim();

    if (!trimmedTitle) {
      errors.title = "Project title is required.";
    } else if (trimmedTitle.length > 255) {
      errors.title = "Project title must be 255 characters or fewer.";
    }

    if (!Array.isArray(formData.genre)) {
      errors.genre = "Genres must be provided as a list.";
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
      description: formData.description.trim(),
      genre: formData.genre,
      status: formData.status,
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
            Project title <span aria-hidden="true">*</span>
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            maxLength={255}
            placeholder="Enter your story project title"
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
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            name="description"
            rows="6"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the story, setting, characters, or main idea."
          />
        </div>

        <fieldset
          className="genre-field"
          aria-describedby="genre-help selected-genres"
        >
          <legend>Genres</legend>

          <p id="genre-help" className="field-hint">
            Select all genres that apply. Choose Undecided when you are not sure
            yet.
          </p>

          <div className="genre-options">
            {GENRE_OPTIONS.map((genreOption) => {
              const isSelected = formData.genre.includes(genreOption);

              return (
                <label
                  key={genreOption}
                  className={`genre-option ${
                    isSelected ? "genre-option-selected" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    name="genre"
                    value={genreOption}
                    checked={isSelected}
                    onChange={() => handleGenreChange(genreOption)}
                  />

                  <span className="genre-option-content">
                    <span className="genre-checkmark" aria-hidden="true">
                      {isSelected ? "✓" : ""}
                    </span>

                    {genreOption}
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

            {formData.genre.length > 0 ? (
              <div className="selected-genre-list">
                {formData.genre.map((genre) => (
                  <span key={genre} className="selected-genre">
                    {genre}
                  </span>
                ))}
              </div>
            ) : (
              <span className="selected-genres-empty">No genres selected</span>
            )}
          </div>

          {validationErrors.genre && (
            <small className="field-error" role="alert">
              {validationErrors.genre}
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

export default ProjectForm;
