// src/components/ui/error-state.jsx
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export const ErrorState = ({ message = "An error occurred", onRetry }) => (
  <article className="center-box">
    <ExclamationCircleIcon style={{ width: '48px', color: 'var(--del-color)' }} />
    <h3>Oops!</h3>
    <p>{message}</p>
    {onRetry && <button onClick={onRetry} className="outline secondary">Try Again</button>}
  </article>
);