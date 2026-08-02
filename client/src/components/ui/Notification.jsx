import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const NOTIFICATION_CONFIG = {
  success: {
    icon: CheckCircleIcon,
    defaultTitle: "Success",
  },
  error: {
    icon: ExclamationCircleIcon,
    defaultTitle: "Something went wrong",
  },
  info: {
    icon: InformationCircleIcon,
    defaultTitle: "Notice",
  },
};

export const Notification = ({
  type = "success",
  title,
  message,
  onDismiss,
}) => {
  if (!message) {
    return null;
  }

  const config = NOTIFICATION_CONFIG[type] || NOTIFICATION_CONFIG.success;

  const Icon = config.icon;
  const notificationTitle = title || config.defaultTitle;

  return (
    <div
      className={`notification notification--${type}`}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      aria-atomic="true"
    >
      <div className="notification__icon" aria-hidden="true">
        <Icon />
      </div>

      <div className="notification__content">
        <p className="notification__title">{notificationTitle}</p>

        <p className="notification__message">{message}</p>
      </div>

      {onDismiss && (
        <button
          type="button"
          className="notification__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss notification"
        >
          <XMarkIcon aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
