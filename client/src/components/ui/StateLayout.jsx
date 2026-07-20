export const StateLayout = ({
  icon,
  title,
  description,
  action,
  variant = "default",
  role,
}) => {
  return (
    <div className={`ui-state ui-state--${variant}`} role={role}>
      {icon && (
        <div className="ui-state__icon" aria-hidden="true">
          {icon}
        </div>
      )}

      <div className="ui-state__content">
        {title && <h3 className="ui-state__title">{title}</h3>}

        {description && <p className="ui-state__description">{description}</p>}
      </div>

      {action && <div className="ui-state__action">{action}</div>}
    </div>
  );
};
