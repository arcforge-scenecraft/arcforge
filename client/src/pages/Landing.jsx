import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="app">
      <header className="navbar">
        <Link className="brand" to="/">
          <img src="/arcforge-logo.png" alt="ArcForge logo" />
          <span>ArcForge</span>
        </Link>

        <nav>
          <a href="#features">Features</a>

          <Link className="primary-button" to="/dashboard">
            Get Started
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">Build your story, one idea at a time</p>

            <h1>Turn scattered story ideas into connected worlds.</h1>

            <p className="hero-description">
              ArcForge helps writers and creators organize characters, scenes,
              locations, relationships, and story details in one place.
            </p>

            <div className="hero-actions">
              <Link className="primary-button" to="/dashboard">
                Start Planning
              </Link>

              <a href="#features" className="secondary-button">
                Explore Features
              </a>
            </div>
          </div>

          <div className="story-preview" aria-label="Story planning preview">
            <div className="preview-header">
              <span>My Fantasy Story</span>
              <span className="status">In Progress</span>
            </div>

            <div className="preview-grid">
              <article>
                <span className="icon">👤</span>
                <strong>Characters</strong>
                <p>12 created</p>
              </article>

              <article>
                <span className="icon">📖</span>
                <strong>Scenes</strong>
                <p>24 planned</p>
              </article>

              <article>
                <span className="icon">🏰</span>
                <strong>Locations</strong>
                <p>8 mapped</p>
              </article>

              <article>
                <span className="icon">🔗</span>
                <strong>Relationships</strong>
                <p>16 connected</p>
              </article>
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <div>
            <span>01</span>
            <h2>Organize characters</h2>
            <p>
              Keep character backgrounds, goals, traits, and relationships
              connected.
            </p>
          </div>

          <div>
            <span>02</span>
            <h2>Plan scenes</h2>
            <p>
              Arrange scenes by timeline, location, status, and participating
              characters.
            </p>
          </div>

          <div>
            <span>03</span>
            <h2>Build your world</h2>
            <p>
              Track important locations, story details, and connections across
              your project.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <p>ArcForge — Forge ideas into stories.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
