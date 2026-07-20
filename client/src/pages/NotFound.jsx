import { Link, useNavigate } from "react-router-dom";
import { NotFoundState } from "../components/ui";
import "../styles/NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <div className="not-found-page__content">
        <p className="not-found-page__code" aria-hidden="true">
          404
        </p>

        <NotFoundState
          title="This page is off the map"
          description="The story path you followed does not exist, may have moved, or is no longer available."
          action={
            <div className="not-found-page__actions">
              <Link to="/dashboard" className="button button--primary">
                Return to Dashboard
              </Link>

              <button
                type="button"
                className="button button--secondary"
                onClick={() => navigate(-1)}
              >
                Go Back
              </button>
            </div>
          }
        />
      </div>
    </main>
  );
}

export default NotFound;
