import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export const CollectionPageHeader = ({
  backTo,
  backLabel = "Back to project",
  eyebrow,
  title,
  count,
  countLabel,
  description,
  actionTo,
  actionLabel,
}) => {
  return (
    <header className="collection-header">
      <Link to={backTo} className="detail__back-link">
        <ArrowLeftIcon aria-hidden="true" />
        {backLabel}
      </Link>

      <div className="collection-header__panel">
        <div className="collection-header__content">
          <p className="collection-header__eyebrow">{eyebrow}</p>

          <div className="collection-header__title-row">
            <h1>{title}</h1>

            <span
              className="collection-header__count"
              aria-label={`${count} ${countLabel}`}
            >
              {count}
            </span>
          </div>

          <p className="collection-header__description">{description}</p>
        </div>

        <Link
          to={actionTo}
          className="primary-button collection-header__action"
        >
          <PlusIcon aria-hidden="true" />
          {actionLabel}
        </Link>
      </div>
    </header>
  );
};
