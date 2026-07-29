import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

function SceneDeleteButton({ sceneName, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${sceneName}"?\n\nThis permanently removes the scene and all of its related data, but retains all associated characters and locations. This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteError("");
      setIsDeleting(true);

      await onDelete();
    } catch (error) {
      console.error(`Failed to delete scene "${sceneName}":`, error);

      setDeleteError(
        error instanceof Error
          ? error.message
          : "Unable to delete the scene. Please try again.",
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
        aria-label={`Delete scene ${sceneName}`}
      >
        <TrashIcon className="delete__icon" aria-hidden="true" />

        <span>{isDeleting ? "Deleting..." : "Delete scene"}</span>
      </button>

      {deleteError && (
        <p className="delete__error" role="alert">
          {deleteError}
        </p>
      )}
    </div>
  );
}

export default SceneDeleteButton;
