import {
  ArrowLeftIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ClockIcon,
  FlagIcon,
  IdentificationIcon,
  PencilSquareIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  DeleteButton,
  DetailPageState,
  Notification,
} from "../../components/ui";
import useCharacter from "../../hooks/characters/useCharacter";
import useRouteNotification from "../../hooks/useRouteNotification";
import { deleteCharacter } from "../../services/characterApi";

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

function CharacterDetail() {
  const { projectId, characterId } = useParams();
  const navigate = useNavigate();

  const { notification, dismissNotification } = useRouteNotification();

  const { character, loading, error, notFound, retry } = useCharacter(
    projectId,
    characterId,
  );

  if (loading) {
    return (
      <DetailPageState
        state="loading"
        resourceName="Character"
        loadingText="Loading character details..."
        backTo={`/projects/${projectId}/characters`}
        backLabel="Back to characters"
      />
    );
  }

  if (notFound) {
    return (
      <DetailPageState
        state="not-found"
        resourceName="Character"
        description="The selected character or its project does not exist."
        backTo={`/projects/${projectId}/characters`}
        backLabel="Back to characters"
      />
    );
  }

  if (error) {
    return (
      <DetailPageState
        state="error"
        resourceName="Character"
        message={error}
        onRetry={retry}
        backTo={`/projects/${projectId}/characters`}
        backLabel="Back to characters"
      />
    );
  }

  if (!character) {
    return (
      <DetailPageState
        state="not-found"
        resourceName="character"
        description="The selected character could not be found."
        backTo={`/projects/${projectId}/characters`}
        backLabel="Back to characters"
      />
    );
  }

  const characterName = normalizeText(character.name, "Untitled character");

  const storyRole = normalizeText(character.story_role, "Role not specified");

  const description = normalizeText(
    character.description,
    "No description has been added for this character yet.",
  );

  const goal = normalizeText(
    character.goal,
    "No goal has been recorded for this character yet.",
  );

  const knowledgeNotes = normalizeText(
    character.knowledge_notes,
    "No knowledge notes have been recorded for this character yet.",
  );

  const handleDeleteCharacter = async () => {
    await deleteCharacter(projectId, characterId);

    navigate(`/projects/${projectId}/characters`, {
      replace: true,
      state: {
        notification: {
          type: "success",
          title: "Character deleted",
          message: `"${characterName}" was deleted successfully.`,
        },
      },
    });
  };

  return (
    <main className="detail-page">
      <article className="detail" aria-labelledby="character-detail-heading">
        <Link
          to={`/projects/${projectId}/characters`}
          className="detail__back-link"
        >
          <ArrowLeftIcon aria-hidden="true" />
          Back to characters
        </Link>

        {notification && (
          <Notification {...notification} onDismiss={dismissNotification} />
        )}

        <header className="detail__hero detail__hero--character">
          <div className="detail__hero-content">
            <div className="detail__heading-row">
              <p className="detail__eyebrow">Character workspace</p>

              <span className="detail__badge">
                <UserCircleIcon aria-hidden="true" />
                Character profile
              </span>
            </div>

            <h1 id="character-detail-heading">{characterName}</h1>

            <p className="detail__description">
              Review this character&apos;s role, motivation, development notes,
              and knowledge within the story.
            </p>
          </div>

          <div className="detail__actions">
            <Link
              to={`/projects/${projectId}/characters/${characterId}/edit`}
              className="detail__edit-link"
            >
              <PencilSquareIcon aria-hidden="true" />
              Edit character
            </Link>

            <DeleteButton
              variant="detail"
              itemName={characterName}
              itemType="character"
              label="Delete character"
              warning="This also removes the character from every scene they appear in and clears their relationships."
              onDelete={handleDeleteCharacter}
            />
          </div>
        </header>

        <section
          className="detail__metadata"
          aria-label="Character information"
        >
          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <IdentificationIcon aria-hidden="true" />
            </div>

            <div>
              <span className="detail__metadata-label">Story role</span>

              <strong className="detail__metadata-value">{storyRole}</strong>
            </div>
          </article>

          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <CalendarDaysIcon aria-hidden="true" />
            </div>

            <div>
              <span className="detail__metadata-label">Created</span>

              <strong className="detail__metadata-value">
                {formatDate(character.created_at)}
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
                {formatDate(character.updated_at)}
              </strong>
            </div>
          </article>
        </section>

        <section className="detail__overview">
          <div className="detail__section-heading">
            <p className="detail__eyebrow">Overview</p>

            <h2>About this character</h2>

            <p>
              Capture this character&apos;s personality, background, behavior,
              and place within the story.
            </p>
          </div>

          <div className="detail__prose">
            <p>{description}</p>
          </div>
        </section>

        <section className="detail__overview">
          <div className="detail__section-heading">
            <p className="detail__eyebrow">Motivation</p>

            <h2>Character goal</h2>

            <p>
              Define what this character wants and what drives their choices
              throughout the story.
            </p>
          </div>

          <div className="detail__feature-card detail__feature-card--goal">
            <div className="detail__feature-icon">
              <FlagIcon aria-hidden="true" />
            </div>

            <div className="detail__feature-content">
              <span className="detail__feature-label">Primary goal</span>

              <p className="detail__feature-value">{goal}</p>
            </div>
          </div>
        </section>

        <section className="detail__overview">
          <div className="detail__section-heading">
            <p className="detail__eyebrow">Perspective</p>

            <h2>Knowledge notes</h2>

            <p>
              Track what this character knows, suspects, misunderstands, or has
              not learned yet.
            </p>
          </div>

          <div className="detail__feature-card detail__feature-card--knowledge">
            <div className="detail__feature-icon">
              <BookOpenIcon aria-hidden="true" />
            </div>

            <div className="detail__feature-content">
              <span className="detail__feature-label">Current knowledge</span>

              <p className="detail__feature-value">{knowledgeNotes}</p>
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
            to={`/projects/${projectId}/characters`}
            className="button button--secondary"
          >
            View all characters
          </Link>
        </footer>
      </article>
    </main>
  );
}

export default CharacterDetail;
