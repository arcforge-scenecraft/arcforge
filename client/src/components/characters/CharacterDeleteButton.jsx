import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

function CharacterDeleteButton({
  characterName,
  onDelete,
  label = "Delete character",
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${characterName}"?\n\nThis also removes the character from every scene they appear in and clears their relationships. This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteError("");
      setIsDeleting(true);

      await onDelete();
    } catch (error) {
      console.error(`Failed to delete character "${characterName}":`, error);

      setDeleteError(
        error instanceof Error
          ? error.message
          : "Unable to delete the character. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="delete">
      <button
        type="button"
        className="delete__button"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-busy={isDeleting}
        aria-label={`Delete ${characterName}`}
      >
        <TrashIcon className="delete__icon" aria-hidden="true" />

        <span>{isDeleting ? "Deleting..." : label}</span>
      </button>

      {deleteError && (
        <p className="delete__error" role="alert">
          {deleteError}
        </p>
      )}
    </div>
  );
}

export default CharacterDeleteButton;
