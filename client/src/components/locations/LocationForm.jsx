import { useEffect, useState } from "react";

const EMPTY_LOCATION = {
  name: "",
  description: "",
  atmosphere: "",
};

const normalizeLocationValues = (values = {}) => ({
  name: values.name || "",
  description: values.description || "",
  atmosphere: values.atmosphere || "",
});

const LocationForm = ({
  initialValues = EMPTY_LOCATION,
  onSubmit,
  onCancel,
  submitLabel = "Save Location",
  isSubmitting = false,
  apiError = "",
}) => {
  const [formData, setFormData] = useState(() =>
    normalizeLocationValues(initialValues),
  );
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    setFormData(normalizeLocationValues(initialValues));
    setValidationErrors({});
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

  const validateForm = () => {
    const errors = {};
    const trimmedName = formData.name.trim();
    const trimmedAtmosphere = formData.atmosphere.trim();

    if (!trimmedName) {
      errors.name = "Location name is required.";
    } else if (trimmedName.length > 255) {
      errors.name = "Location name must be 255 characters or fewer.";
    }

    if (trimmedAtmosphere.length > 255) {
      errors.atmosphere = "Atmosphere must be 255 characters or fewer.";
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
      name: formData.name.trim(),
      description: formData.description.trim(),
      atmosphere: formData.atmosphere.trim(),
    });
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
            Location name <span aria-hidden="true">*</span>
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            maxLength={255}
            placeholder="Enter the location name"
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
            placeholder="Describe what this location looks like and how it is used in the story."
          />
        </div>

        <div className="form-field">
          <label htmlFor="atmosphere">Atmosphere</label>

          <input
            id="atmosphere"
            name="atmosphere"
            type="text"
            value={formData.atmosphere}
            onChange={handleChange}
            maxLength={255}
            placeholder="For example: tense, peaceful, mysterious"
            aria-invalid={Boolean(validationErrors.atmosphere)}
            aria-describedby={
              validationErrors.atmosphere ? "atmosphere-error" : undefined
            }
          />

          {validationErrors.atmosphere && (
            <small id="atmosphere-error" className="field-error" role="alert">
              {validationErrors.atmosphere}
            </small>
          )}
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

export default LocationForm;
