/* Shared form field primitives.

These components wrap the existing .form-field markup so every form can render
labels, hints, validation errors, and accessibility attributes the same way. */

const FieldShell = ({ id, label, required, hint, error, children }) => {
  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label} {required && <span aria-hidden="true">*</span>}
      </label>

      {hint && (
        <p className="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}

      {children}

      {error && (
        <small id={`${id}-error`} className="field-error" role="alert">
          {error}
        </small>
      )}
    </div>
  );
};

const describedBy = (id, hint, error) => {
  const ids = [];

  if (hint) {
    ids.push(`${id}-hint`);
  }

  if (error) {
    ids.push(`${id}-error`);
  }

  return ids.length > 0 ? ids.join(" ") : undefined;
};

export const TextField = ({
  id,
  name = id,
  label,
  value,
  onChange,
  required = false,
  hint = "",
  error = "",
  maxLength,
  placeholder = "",
  suggestions = [],
}) => {
  const listId = suggestions.length > 0 ? `${id}-suggestions` : undefined;

  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
    >
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        list={listId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, hint, error)}
      />

      {listId && (
        <datalist id={listId}>
          {suggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      )}
    </FieldShell>
  );
};

export const TextAreaField = ({
  id,
  name = id,
  label,
  value,
  onChange,
  required = false,
  hint = "",
  error = "",
  rows = 6,
  maxLength,
  placeholder = "",
}) => {
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
    >
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, hint, error)}
      />
    </FieldShell>
  );
};

export const FormApiError = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="form-api-error" role="alert" aria-live="polite">
      {message}
    </div>
  );
};

export const FormActions = ({
  onCancel,
  submitLabel,
  isSubmitting = false,
  cancelLabel = "Cancel",
}) => {
  return (
    <div className="form-actions">
      <button type="button" className="secondary-button" onClick={onCancel}>
        {cancelLabel}
      </button>

      <button type="submit" className="primary-button" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </div>
  );
};
