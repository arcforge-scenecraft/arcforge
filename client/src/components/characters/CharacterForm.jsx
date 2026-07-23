import { useState } from "react";

const FIELDS = [
  {
    name: "name",
    label: "Name",
    required: true,
    type: "input",
    placeholder: "e.g. Mira Ashgrove",
  },
  {
    name: "story_role",
    label: "Story Role",
    type: "input",
    placeholder: "e.g. Protagonist, Antagonist, Mentor",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Who is this character? Appearance, personality, background...",
  },
  {
    name: "goal",
    label: "Goal",
    type: "textarea",
    placeholder: "What does this character want?",
  },
  {
    name: "knowledge_notes",
    label: "Knowledge Notes",
    type: "textarea",
    placeholder: "What does this character know (and when do they learn it)?",
  },
];

const buildInitialValues = (character) => ({
  name: character?.name ?? "",
  story_role: character?.story_role ?? "",
  description: character?.description ?? "",
  goal: character?.goal ?? "",
  knowledge_notes: character?.knowledge_notes ?? "",
});

const CharacterForm = ({
  character,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save Character",
  error,
}) => {
  const [values, setValues] = useState(() => buildInitialValues(character));
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (fieldName) => (event) => {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, [fieldName]: value }));
    setFieldErrors((prev) => ({ ...prev, [fieldName]: undefined }));
  };

  const validate = () => {
    const errors = {};
    if (!values.name || values.name.trim() === "") {
      errors.name = "Character name is required.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      name: values.name.trim(),
      story_role: values.story_role.trim() || null,
      description: values.description.trim() || null,
      goal: values.goal.trim() || null,
      knowledge_notes: values.knowledge_notes.trim() || null,
    });
  };

  return (
    <form className="character-form" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="notice-card error-message" role="alert">
          {error}
        </div>
      )}

      {FIELDS.map((field) => (
        <div className="character-form__field" key={field.name}>
          <label htmlFor={`character-${field.name}`}>
            {field.label}
            {field.required && <span aria-hidden="true"> *</span>}
          </label>

          {field.type === "textarea" ? (
            <textarea
              id={`character-${field.name}`}
              name={field.name}
              rows={4}
              value={values[field.name]}
              onChange={handleChange(field.name)}
              placeholder={field.placeholder}
              disabled={isSubmitting}
            />
          ) : (
            <input
              id={`character-${field.name}`}
              name={field.name}
              type="text"
              value={values[field.name]}
              onChange={handleChange(field.name)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={isSubmitting}
            />
          )}

          {fieldErrors[field.name] && (
            <p className="character-form__field-error" role="alert">
              {fieldErrors[field.name]}
            </p>
          )}
        </div>
      ))}

      <div className="character-form__actions">
        <button
          type="button"
          className="button button--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="button button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default CharacterForm;
