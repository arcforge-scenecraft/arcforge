import { TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export const DeleteButton = ({
  itemName,
  itemType,
  onDelete,
  warning,
  label,
  variant = "detail",
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const buttonLabel = label || `Delete ${itemType}`;

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${itemName}"?\n\n${warning}\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeleteError("");
    setIsDeleting(true);

    try {
      await onDelete();
    } catch (error) {
      console.error(`Failed to delete ${itemType} "${itemName}":`, error);

      setDeleteError(
        error instanceof Error
          ? error.message
          : `Unable to delete the ${itemType}. Please try again.`,
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`delete delete--${variant}`}>
      <button
        type="button"
        className="delete__button"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-busy={isDeleting}
        aria-label={`Delete ${itemType} ${itemName}`}
      >
        <TrashIcon className="delete__icon" aria-hidden="true" />

        <span>{isDeleting ? "Deleting..." : buttonLabel}</span>
      </button>

      {deleteError && (
        <p className="delete__error" role="alert">
          {deleteError}
        </p>
      )}
    </div>
  );
};
