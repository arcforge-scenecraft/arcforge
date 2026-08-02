import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

import { DeleteButton } from "./DeleteButton";

export const CollectionCardActions = ({
  viewTo,
  editTo,
  itemName,
  itemType,
  warning,
  onDelete,
}) => {
  return (
    <div className="card-actions">
      <div className="card-primary-actions">
        <Link
          to={viewTo}
          className="card-link"
          aria-label={`View ${itemType} ${itemName}`}
        >
          <EyeIcon aria-hidden="true" />
          View
        </Link>

        <Link
          to={editTo}
          className="card-edit-link"
          aria-label={`Edit ${itemType} ${itemName}`}
        >
          <PencilSquareIcon aria-hidden="true" />
          Edit
        </Link>
      </div>

      <DeleteButton
        variant="compact"
        itemName={itemName}
        itemType={itemType}
        label="Delete"
        warning={warning}
        onDelete={onDelete}
      />
    </div>
  );
};
