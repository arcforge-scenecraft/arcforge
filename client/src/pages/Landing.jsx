import {
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  BookOpenIcon,
  ChartBarIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  RectangleStackIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const PREVIEW_ITEMS = [
  { label: "Characters", value: "12 created", icon: UserGroupIcon },
  { label: "Scenes", value: "24 planned", icon: BookOpenIcon },
  { label: "Locations", value: "8 mapped", icon: MapPinIcon },
  { label: "Progress", value: "68% complete", icon: ChartBarIcon },
];

const FEATURES = [
  {
    title: "Organize projects",
    description:
      "Give every story its own workspace with a title, genre, status, description, and progress overview.",
    icon: RectangleStackIcon,
  },
  {
    title: "Plan detailed scenes",
    description:
      "Track descriptions, scene order, timeline order, notes, status, locations, and character appearances.",
    icon: BookOpenIcon,
  },
  {
    title: "Build character profiles",
    description:
      "Keep character roles, motivations, descriptions, and notes connected to the project they belong to.",
    icon: UserGroupIcon,
  },
  {
    title: "Define story locations",
    description:
      "Create reusable settings and keep the places in your story organized alongside scenes and characters.",
    icon: MapPinIcon,
  },
  {
    title: "Connect the cast",
    description:
      "Assign characters to scenes and keep track of who appears throughout your story.",
    icon: ArrowsRightLeftIcon,
  },
  {
    title: "Find details quickly",
    description:
      "Use search, filtering, sorting, responsive collection pages, and clear status indicators to review your story structure.",
    icon: MagnifyingGlassIcon,
  },
];

const WORKFLOW_STEPS = [
  {
    number: "01",
    title: "Create a project",
    description:
      "Start with the central idea, genre, description, and current planning status.",
  },
  {
    number: "02",
    title: "Build the world",
    description:
      "Add the scenes, characters, and locations that turn the idea into a connected story.",
  },
  {
    number: "03",
    title: "Review and refine",
    description:
      "Search, sort, edit, and track progress as the structure of the story develops.",
  },
];

function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const section = document.querySelector(location.hash);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero__content">
          <p className="landing-hero__eyebrow">
            <SparklesIcon aria-hidden="true" />
            Story planning workspace
          </p>

          <h1>
            Turn scattered story ideas into <span>connected worlds.</span>
          </h1>
          <p className="landing-hero__description">
            ArcForge gives writers, game designers, and creative teams one
            organized place to plan projects, scenes, characters, locations, and
            character appearances.
          </p>

          <div className="landing-hero__actions">
            <Link className="primary-button" to="/dashboard">
              Explore projects
              <ArrowRightIcon aria-hidden="true" />
            </Link>
            <a href="#features" className="secondary-button">
              Explore features
            </a>
          </div>

          <ul className="landing-hero__highlights">
            <li>
              <CheckCircleIcon aria-hidden="true" />
              Create, edit, and manage every major story detail
            </li>
            <li>
              <CheckCircleIcon aria-hidden="true" />
              Review progress with searchable, responsive workspaces
            </li>
          </ul>
        </div>

        <div className="story-preview" aria-label="Story planning preview">
          <div className="story-preview__window-bar">
            <div className="story-preview__window-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span>Project overview</span>
          </div>

          <div className="story-preview__header">
            <div>
              <p>My Fantasy Story</p>
              <span>Adventure · Active project</span>
            </div>
            <span className="story-preview__status">In progress</span>
          </div>

          <div className="story-preview__grid">
            {PREVIEW_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <article className="story-preview__card" key={item.label}>
                  <span className="story-preview__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <strong>{item.label}</strong>
                  <p>{item.value}</p>
                </article>
              );
            })}
          </div>

          <div className="story-preview__progress">
            <div className="story-preview__progress-label">
              <span>Story progress</span>
              <strong>68%</strong>
            </div>
            <div
              className="story-preview__progress-track"
              role="progressbar"
              aria-label="Example story progress"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow="68"
            >
              <span />
            </div>
          </div>
        </div>
      </section>

      <section
        className="landing-section landing-features-section"
        id="features"
        aria-labelledby="features-title"
      >
        <div className="landing-section__header">
          <p className="landing-section__eyebrow">Everything stays connected</p>
          <h2 id="features-title">A clearer workspace for complex stories.</h2>
          <p>
            Move from the first project idea to detailed scenes without losing
            track of the characters, locations, or progress behind it.
          </p>
        </div>

        <div className="landing-features">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className="landing-feature" key={feature.title}>
                <span className="landing-feature__icon" aria-hidden="true">
                  <Icon />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landing-workflow" aria-labelledby="workflow-title">
        <div className="landing-workflow__inner">
          <div className="landing-section__header landing-section__header--left">
            <p className="landing-section__eyebrow">A simple planning flow</p>
            <h2 id="workflow-title">From first idea to organized draft.</h2>
            <p>
              ArcForge keeps the workflow approachable while giving each part of
              the story enough structure to grow.
            </p>
          </div>

          <div className="landing-workflow__steps">
            {WORKFLOW_STEPS.map((step) => (
              <article className="landing-workflow__step" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-capstone" aria-labelledby="capstone-title">
        <div>
          <p className="landing-capstone__eyebrow">CodePath WEB103 capstone</p>
          <h2 id="capstone-title">Designed and built by a six-person team.</h2>
          <p>
            Learn why we created ArcForge, which technologies power it, and how
            each collaborator contributed to the final application.
          </p>
        </div>
        <Link className="landing-capstone__link" to="/about">
          Meet the team
          <ArrowRightIcon aria-hidden="true" />
        </Link>
      </section>

      <section className="landing-cta" aria-labelledby="landing-cta-title">
        <div>
          <p className="landing-section__eyebrow">Start with one idea</p>
          <h2 id="landing-cta-title">Give your next story room to grow.</h2>
          <p>
            Create a project and begin connecting the scenes, people, and places
            that make the world memorable.
          </p>
        </div>
        <Link className="primary-button" to="/projects/new">
          Create a project
          <ArrowRightIcon aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}

export default LandingPage;
