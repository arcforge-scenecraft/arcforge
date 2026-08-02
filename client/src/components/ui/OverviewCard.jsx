import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const OverviewCard = ({
  to,
  title,
  meta,
  subheading,
  description,
  badges = [],
  footerText,
  detailLabel = "View details",
}) => {
  const visibleBadges = badges.filter(Boolean);

  return (
    <article className="overview-card">
      <Link
        to={to}
        className="overview-card__link"
        aria-label={`${detailLabel}: ${title}`}
      >
        <div className="overview-card__header">
          <h3>{title}</h3>

          {meta && <span className="overview-card__meta">{meta}</span>}
        </div>

        {subheading && (
          <p className="overview-card__subheading">{subheading}</p>
        )}

        <p className="overview-card__description">
          {description || "No description has been added yet."}
        </p>

        {visibleBadges.length > 0 && (
          <div
            className="overview-card__badges"
            aria-label="Additional information"
          >
            {visibleBadges.map((badge, index) => (
              <span key={`${badge}-${index}`} className="overview-card__badge">
                {badge}
              </span>
            ))}
          </div>
        )}

        {footerText && (
          <p className="overview-card__supporting-text">{footerText}</p>
        )}

        <span className="overview-card__details">
          {detailLabel}
          <ArrowUpRightIcon aria-hidden="true" />
        </span>
      </Link>
    </article>
  );
};

export default OverviewCard;
