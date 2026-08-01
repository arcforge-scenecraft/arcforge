import { ArrowRightIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useId } from "react";
import { Link } from "react-router-dom";

const OverviewSection = ({
  eyebrow,
  count,
  title,
  description,
  actionTo,
  actionLabel,
  viewAllTo,
  viewAllLabel,
  emptyMessage,
  isEmpty = false,
  children,
}) => {
  const reactId = useId();
  const headingId = `overview-${reactId.replace(/:/g, "")}`;
  const hasCount = Number.isInteger(count);

  return (
    <section className="overview-section" aria-labelledby={headingId}>
      <header className="overview-section__header">
        <div className="overview-section__heading">
          <div className="overview-section__label-row">
            <p className="detail__eyebrow">{eyebrow}</p>

            {hasCount && (
              <span
                className="overview-section__count"
                aria-label={`Total ${eyebrow}: ${count}`}
              >
                {count}
              </span>
            )}
          </div>

          <h2 id={headingId}>{title}</h2>

          <p className="overview-section__description">{description}</p>
        </div>

        {actionTo && actionLabel && (
          <Link to={actionTo} className="overview-section__add-link">
            <PlusIcon aria-hidden="true" />
            {actionLabel}
          </Link>
        )}
      </header>

      {isEmpty ? (
        <div className="overview-section__empty">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        children
      )}

      {viewAllTo && viewAllLabel && !isEmpty && (
        <footer className="overview-section__footer">
          <Link to={viewAllTo} className="overview-section__view-all-link">
            {viewAllLabel}
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </footer>
      )}
    </section>
  );
};

export default OverviewSection;
