import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

import { ErrorState } from "./ErrorState";
import { Loader } from "./Loader";
import { NotFoundState } from "./NotFoundState";

export const DetailPageState = ({
  state,
  resourceName,
  loadingText,
  description,
  message,
  onRetry,
  backTo,
  backLabel,
}) => {
  const normalizedName = resourceName.toLowerCase();

  let content = null;

  if (state === "loading") {
    content = <Loader text={loadingText || `Loading ${normalizedName}...`} />;
  }

  if (state === "not-found") {
    content = (
      <NotFoundState
        title={`${resourceName} not found`}
        description={
          description ||
          `The selected ${normalizedName} does not exist or may have been deleted.`
        }
        action={
          <Link to={backTo} className="button button--primary">
            {backLabel}
          </Link>
        }
      />
    );
  }

  if (state === "error") {
    content = (
      <ErrorState
        title={`Unable to open ${normalizedName}`}
        message={message || `The ${normalizedName} could not be loaded.`}
        onRetry={onRetry}
      />
    );
  }

  return (
    <main className="detail-page">
      <section className="detail">
        <Link to={backTo} className="detail__back-link">
          <ArrowLeftIcon aria-hidden="true" />
          {backLabel}
        </Link>

        <div className="detail__state">{content}</div>
      </section>
    </main>
  );
};
