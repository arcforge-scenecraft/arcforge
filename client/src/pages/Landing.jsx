import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero__content">
          <p className="landing-hero__eyebrow">
            Build your story, one idea at a time
          </p>

          <h1>Turn scattered story ideas into connected worlds.</h1>

          <p className="landing-hero__description">
            ArcForge helps writers and creators organize characters, scenes,
            locations, relationships, and story details in one place.
          </p>

          <div className="landing-hero__actions">
            <Link className="primary-button" to="/dashboard">
              Start Planning
            </Link>

            <a href="#features" className="secondary-button">
              Explore Features
            </a>
          </div>
        </div>

        <div className="story-preview" aria-label="Story planning preview">
          <div className="story-preview__header">
            <span>My Fantasy Story</span>
            <span className="story-preview__status">In Progress</span>
          </div>

          <div className="story-preview__grid">
            <article className="story-preview__card">
              <span className="story-preview__icon" aria-hidden="true">
                👤
              </span>
              <strong>Characters</strong>
              <p>12 created</p>
            </article>

            <article className="story-preview__card story-preview__card--accent">
              <span className="story-preview__icon" aria-hidden="true">
                📖
              </span>
              <strong>Scenes</strong>
              <p>24 planned</p>
            </article>

            <article className="story-preview__card">
              <span className="story-preview__icon" aria-hidden="true">
                🏰
              </span>
              <strong>Locations</strong>
              <p>8 mapped</p>
            </article>

            <article className="story-preview__card">
              <span className="story-preview__icon" aria-hidden="true">
                🔗
              </span>
              <strong>Relationships</strong>
              <p>16 connected</p>
            </article>
          </div>
        </div>
      </section>

      <section className="landing-features" id="features" aria-label="Features">
        <article className="landing-feature">
          <span className="landing-feature__number">01</span>
          <h2>Organize characters</h2>
          <p>
            Keep character backgrounds, goals, traits, and relationships
            connected.
          </p>
        </article>

        <article className="landing-feature">
          <span className="landing-feature__number">02</span>
          <h2>Plan scenes</h2>
          <p>
            Arrange scenes by timeline, location, status, and participating
            characters.
          </p>
        </article>

        <article className="landing-feature">
          <span className="landing-feature__number">03</span>
          <h2>Build your world</h2>
          <p>
            Track important locations, story details, and connections across
            your project.
          </p>
        </article>
      </section>
    </main>
  );
}

export default LandingPage;
