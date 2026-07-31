import { useEffect, useState } from "react";

import {
  FormActions,
  FormApiError,
  TextAreaField,
  TextField,
} from "../forms/FormFields";

const EMPTY_CHARACTER = {
  name: "",
  story_role: "",
  description: "",
  goal: "",
  knowledge_notes: "",
};

const STORY_ROLE_SUGGESTIONS = [
  "Protagonist",
  "Antagonist",
  "Deuteragonist",
  "Mentor",
  "Ally",
  "Foil",
  "Love interest",
  "Supporting",
  "Narrator",
];

const NAME_MAX_LENGTH = 255;
const STORY_ROLE_MAX_LENGTH = 100;

const normalizeCharacterValues = (values = {}) => ({
  name: values.name || "",
  story_role: values.story_role || "",
  description: values.description || "",
  goal: values.goal || "",
  knowledge_notes: values.knowledge_notes || "",
});

const CharacterForm = ({
  initialValues = EMPTY_CHARACTER,
  onSubmit,
  onCancel,
  submitLabel = "Save Character",
  isSubmitting = false,
  apiError = "",
}) => {
  const [formData, setFormData] = useState(() =>
    normalizeCharacterValues(initialValues),
  );
  const [validationErrors, setValidationErrors] = useState({});

  // Keeps the edit form in sync once the character finishes loading.
  useEffect(() => {
    setFormData(normalizeCharacterValues(initialValues));
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
    const trimmedStoryRole = formData.story_role.trim();

    if (!trimmedName) {
      errors.name = "Character name is required.";
    } else if (trimmedName.length > NAME_MAX_LENGTH) {
      errors.name = `Character name must be ${NAME_MAX_LENGTH} characters or fewer.`;
    }

    if (trimmedStoryRole.length > STORY_ROLE_MAX_LENGTH) {
      errors.story_role = `Story role must be ${STORY_ROLE_MAX_LENGTH} characters or fewer.`;
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
      story_role: formData.story_role.trim(),
      description: formData.description.trim(),
      goal: formData.goal.trim(),
      knowledge_notes: formData.knowledge_notes.trim(),
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <FormApiError message={apiError} />

      <fieldset className="form-fields" disabled={isSubmitting}>
        <TextField
          id="name"
          label="Character name"
          value={formData.name}
          onChange={handleChange}
          error={validationErrors.name}
          maxLength={NAME_MAX_LENGTH}
          placeholder="Enter the character name"
          required
        />

        <TextField
          id="story_role"
          label="Story role"
          value={formData.story_role}
          onChange={handleChange}
          error={validationErrors.story_role}
          maxLength={STORY_ROLE_MAX_LENGTH}
          placeholder="For example: protagonist, mentor, rival"
          hint="Pick one of the suggestions or write your own role."
          suggestions={STORY_ROLE_SUGGESTIONS}
        />

        <TextAreaField
          id="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          error={validationErrors.description}
          placeholder="Describe who this character is, how they behave, and what makes them memorable."
        />

        <TextAreaField
          id="goal"
          label="Goal"
          value={formData.goal}
          onChange={handleChange}
          error={validationErrors.goal}
          rows={4}
          placeholder="What is this character trying to achieve in the story?"
        />

        <TextAreaField
          id="knowledge_notes"
          label="Knowledge notes"
          value={formData.knowledge_notes}
          onChange={handleChange}
          error={validationErrors.knowledge_notes}
          rows={4}
          placeholder="Track what this character knows, suspects, or has not learned yet."
          hint="Useful for keeping track of secrets and reveals across scenes."
        />

        <FormActions
          onCancel={onCancel}
          submitLabel={submitLabel}
          isSubmitting={isSubmitting}
        />
      </fieldset>
    </form>
  );
};

export default CharacterForm;
