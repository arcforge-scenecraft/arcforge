import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

function LocationDeleteButton({ locationName, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${locationName}"?\n\nScenes using this location will remain, but their location will be cleared. This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteError("");
      setIsDeleting(true);

      await onDelete();
    } catch (error) {
      console.error(`Failed to delete location "${locationName}":`, error);

      setDeleteError(
        error instanceof Error
          ? error.message
          : "Unable to delete the location. Please try again.",
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
        aria-label={`Delete ${locationName}`}
      >
        <TrashIcon className="delete__icon" aria-hidden="true" />

        <span>{isDeleting ? "Deleting..." : "Delete location"}</span>
      </button>

      {deleteError && (
        <p className="delete__error" role="alert">
          {deleteError}
        </p>
      )}
    </div>
  );
}

export default LocationDeleteButton;
