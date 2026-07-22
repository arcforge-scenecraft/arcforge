import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

const ProjectDeleteButton = ({ projectTitle, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${projectTitle}"?\n\nThis permanently removes the project and all of its related story data. This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeleteError("");
    setIsDeleting(true);

    try {
      await onDelete();
    } catch (error) {
      console.error(`Failed to delete "${projectTitle}":`, error);

      setDeleteError(
        error instanceof Error
          ? error.message
          : "Unable to delete the project. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="project-delete">
      <button
        type="button"
        className="project-delete__button"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-busy={isDeleting}
        aria-label={`Delete ${projectTitle}`}
      >
        <TrashIcon className="project-delete__icon" aria-hidden="true" />

        <span>{isDeleting ? "Deleting..." : "Delete"}</span>
      </button>

      {deleteError && (
        <p className="project-delete__error" role="alert">
          {deleteError}
        </p>
      )}
    </div>
  );
};

export default ProjectDeleteButton;
