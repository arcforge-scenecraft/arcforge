import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  DocumentTextIcon,
  MapPinIcon,
  PencilSquareIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  DeleteButton,
  DetailPageState,
  Notification,
} from "../../components/ui";
import useScene from "../../hooks/scenes/useScene";
import useRouteNotification from "../../hooks/useRouteNotification";
import { deleteScene } from "../../services/sceneApi";

const UNDECIDED = "undecided";
const UNDEFINED_TEXT = "undefined";

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const normalizeText = (value, fallback) => {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  return value.trim();
};

const normalizeCharacters = (value) => {
  const characters = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? [value]
      : [];

  return [
    ...new Set(
      characters
        .filter((character) => typeof character === "string")
        .map((character) => character.trim())
        .filter((character) => {
          const normalizedCharacter = character.toLowerCase();

          return (
            character &&
            normalizedCharacter !== UNDECIDED &&
            normalizedCharacter !== UNDEFINED_TEXT
          );
        }),
    ),
  ];
};

const normalizeLocation = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  const location = value.trim();
  const normalizedLocation = location.toLowerCase();

  if (
    !location ||
    normalizedLocation === UNDECIDED ||
    normalizedLocation === UNDEFINED_TEXT
  ) {
    return "";
  }

  return location;
};

const formatOrder = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not set";
  }

  const order = Number(value);

  if (!Number.isInteger(order) || order <= 0) {
    return "Not set";
  }

  return `#${order}`;
};

const SceneDetail = () => {
  const { projectId, sceneId } = useParams();
  const navigate = useNavigate();

  const { notification, dismissNotification } = useRouteNotification();

  const { scene, loading, error, notFound, retry } = useScene(
    projectId,
    sceneId,
  );

  if (loading) {
    return (
      <DetailPageState
        state="loading"
        resourceName="Scene"
        loadingText="Loading scene details..."
        backTo={`/projects/${projectId}/scenes`}
        backLabel="Back to scenes"
      />
    );
  }

  if (notFound) {
    return (
      <DetailPageState
        state="not-found"
        resourceName="Scene"
        description="The selected scene or its project does not exist."
        backTo={`/projects/${projectId}/scenes`}
        backLabel="Back to scenes"
      />
    );
  }

  if (error) {
    return (
      <DetailPageState
        state="error"
        resourceName="Scene"
        message={error}
        onRetry={retry}
        backTo={`/projects/${projectId}/scenes`}
        backLabel="Back to scenes"
      />
    );
  }

  if (!scene) {
    return (
      <DetailPageState
        state="not-found"
        resourceName="Scene"
        description="The selected scene could not be found."
        backTo={`/projects/${projectId}/scenes`}
        backLabel="Back to scenes"
      />
    );
  }

  const sceneName = normalizeText(scene.name, "Untitled scene");

  const sceneDescription = normalizeText(
    scene.description,
    "No description has been added for this scene yet.",
  );

  const sceneStatus = normalizeText(scene.status, "Planning");

  const sceneNotes = normalizeText(
    scene.notes,
    "No planning notes have been added for this scene yet.",
  );

  const sceneCharacters = normalizeCharacters(scene.characters);

  const sceneLocation = normalizeLocation(scene.location);

  const hasSceneElements = Boolean(sceneLocation) || sceneCharacters.length > 0;

  const handleDeleteScene = async () => {
    await deleteScene(projectId, sceneId);

    navigate(`/projects/${projectId}/scenes`, {
      replace: true,
      state: {
        notification: {
          type: "success",
          title: "Scene Deleted",
          message: `"${sceneName}" was deleted successfully.`,
        },
      },
    });
  };

  return (
    <main className="detail-page">
      <article className="detail" aria-labelledby="scene-detail-heading">
        <Link
          to={`/projects/${projectId}/scenes`}
          className="detail__back-link"
        >
          <ArrowLeftIcon aria-hidden="true" />
          Back to scenes
        </Link>

        {notification && (
          <Notification {...notification} onDismiss={dismissNotification} />
        )}

        <header className="detail__hero detail__hero--scene">
          <div className="detail__hero-content">
            <div className="detail__heading-row">
              <p className="detail__eyebrow">Scene workspace</p>

              <span className="detail__status">{sceneStatus}</span>
            </div>

            <h1 id="scene-detail-heading">{sceneName}</h1>

            <p className="detail__description">{sceneDescription}</p>
          </div>

          <div className="detail__actions">
            <Link
              to={`/projects/${projectId}/scenes/${sceneId}/edit`}
              className="detail__edit-link"
            >
              <PencilSquareIcon aria-hidden="true" />
              Edit scene
            </Link>

            <DeleteButton
              variant="detail"
              itemName={sceneName}
              itemType="scene"
              label="Delete scene"
              warning="This permanently removes the scene and its related scene data, but retains associated characters and locations."
              onDelete={handleDeleteScene}
            />
          </div>
        </header>

        <section className="detail__metadata" aria-label="Scene information">
          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <PencilSquareIcon aria-hidden="true" />
            </div>

            <div>
              <span className="detail__metadata-label">Status</span>

              <strong className="detail__metadata-value">{sceneStatus}</strong>
            </div>
          </article>

          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <CalendarDaysIcon aria-hidden="true" />
            </div>

            <div>
              <span className="detail__metadata-label">Created</span>

              <strong className="detail__metadata-value">
                {formatDate(scene.created_at)}
              </strong>
            </div>
          </article>

          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <ClockIcon aria-hidden="true" />
            </div>

            <div>
              <span className="detail__metadata-label">Last updated</span>

              <strong className="detail__metadata-value">
                {formatDate(scene.updated_at)}
              </strong>
            </div>
          </article>
        </section>

        <section
          className="detail__overview"
          aria-labelledby="scene-structure-heading"
        >
          <div className="detail__section-heading">
            <p className="detail__eyebrow">Structure</p>

            <h2 id="scene-structure-heading">Story and timeline order</h2>

            <p>
              Compare where this scene appears in the written story with where
              it occurs chronologically.
            </p>
          </div>

          <dl className="detail__information-list">
            <div className="detail__information-row">
              <dt>Scene order</dt>
              <dd>{formatOrder(scene.scene_order)}</dd>
            </div>

            <div className="detail__information-row">
              <dt>Timeline order</dt>
              <dd>{formatOrder(scene.timeline_order)}</dd>
            </div>
          </dl>
        </section>

        <section
          className="detail__overview-single"
          aria-labelledby="scene-elements-heading"
        >
          <div className="detail__section-heading">
            <p className="detail__eyebrow">Elements</p>

            <h2 id="scene-elements-heading">Location and characters</h2>

            <p>Review the setting and cast connected to this scene.</p>
          </div>

          {hasSceneElements ? (
            <div className="detail__related-grid">
              {sceneLocation && (
                <article className="detail__related-card">
                  <MapPinIcon
                    className="detail__related-icon"
                    aria-hidden="true"
                  />

                  <span className="detail__related-label">Location</span>

                  <strong className="detail__related-title">
                    {sceneLocation}
                  </strong>
                </article>
              )}

              {sceneCharacters.map((character) => (
                <article key={character} className="detail__related-card">
                  <UserGroupIcon
                    className="detail__related-icon"
                    aria-hidden="true"
                  />

                  <span className="detail__related-label">Character</span>

                  <strong className="detail__related-title">{character}</strong>
                </article>
              ))}
            </div>
          ) : (
            <div className="detail__prose">
              <p>
                No characters or locations have been selected for this scene.
              </p>
            </div>
          )}
        </section>

        <section
          className="detail__overview-single"
          aria-labelledby="scene-notes-heading"
        >
          <div className="detail__section-heading">
            <p className="detail__eyebrow">Planning</p>

            <h2 id="scene-notes-heading">Creator&apos;s notes</h2>

            <p>
              Keep planning details, reminders, and development ideas connected
              to this scene.
            </p>
          </div>

          <div className="detail__feature-card detail__feature-card--notes">
            <div className="detail__feature-icon">
              <DocumentTextIcon aria-hidden="true" />
            </div>

            <div className="detail__feature-content">
              <span className="detail__feature-label">Scene notes</span>

              <p className="detail__feature-value">{sceneNotes}</p>
            </div>
          </div>
        </section>

        <footer className="detail__footer-navigation">
          <Link
            to={`/projects/${projectId}`}
            className="button button--secondary"
          >
            Back to project
          </Link>

          <Link
            to={`/projects/${projectId}/scenes`}
            className="button button--secondary"
          >
            View all scenes
          </Link>
        </footer>
      </article>
    </main>
  );
};

export default SceneDetail;
