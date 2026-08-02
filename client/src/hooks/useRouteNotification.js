import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VALID_NOTIFICATION_TYPES = ["success", "error", "info"];

const normalizeNotification = (value) => {
  if (typeof value === "string") {
    const message = value.trim();

    return message
      ? {
          type: "success",
          message,
        }
      : null;
  }

  if (
    !value ||
    typeof value !== "object" ||
    typeof value.message !== "string"
  ) {
    return null;
  }

  const message = value.message.trim();

  if (!message) {
    return null;
  }

  return {
    type: VALID_NOTIFICATION_TYPES.includes(value.type)
      ? value.type
      : "success",
    title:
      typeof value.title === "string" && value.title.trim()
        ? value.title.trim()
        : undefined,
    message,
  };
};

const getNotificationFromRouteState = (state) => {
  if (!state || typeof state !== "object") {
    return null;
  }

  /*
   * Supports the new structured notification and the
   * existing state: { message: "..." } format.
   */
  return normalizeNotification(state.notification ?? state.message);
};

const useRouteNotification = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const routeNotification = getNotificationFromRouteState(location.state);

    if (!routeNotification) {
      return;
    }

    setNotification(routeNotification);

    /*
     * Remove the notification from browser history so
     * refreshing or returning to this route does not show
     * the same message again.
     */
    const remainingState =
      location.state && typeof location.state === "object"
        ? { ...location.state }
        : {};

    delete remainingState.notification;
    delete remainingState.message;

    const nextState =
      Object.keys(remainingState).length > 0 ? remainingState : null;

    navigate(`${location.pathname}${location.search}${location.hash}`, {
      replace: true,
      state: nextState,
    });
  }, [
    location.hash,
    location.pathname,
    location.search,
    location.state,
    navigate,
  ]);

  const showNotification = useCallback((value) => {
    setNotification(normalizeNotification(value));
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    notification,
    showNotification,
    dismissNotification,
  };
};

export default useRouteNotification;
