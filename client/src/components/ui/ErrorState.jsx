import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { StateLayout } from "./StateLayout";

export const ErrorState = ({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  onRetry,
}) => {
  const retryButton = onRetry ? (
    <button
      type="button"
      className="button button--secondary"
      onClick={onRetry}
    >
      Try Again
    </button>
  ) : null;

  return (
    <StateLayout
      variant="error"
      role="alert"
      icon={<ExclamationCircleIcon />}
      title={title}
      description={message}
      action={retryButton}
    />
  );
};
