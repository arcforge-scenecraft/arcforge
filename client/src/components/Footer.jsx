import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand-section">
          <Link
            className="site-footer__brand"
            to="/"
            aria-label="ArcForge home"
          >
            <img
              className="site-footer__logo"
              src="/arcforge-logo.png"
              alt=""
            />
            <span>ArcForge</span>
          </Link>
          <p className="site-footer__description">
            Keep projects, scenes, characters, locations, and story ideas
            connected as your world grows.
          </p>
        </div>

        <nav className="site-footer__navigation" aria-label="Footer navigation">
          <p className="site-footer__heading">Explore</p>
          <Link to="/">Home</Link>
          <Link to="/#features">Features</Link>
          <Link to="/about">About</Link>
          <Link to="/dashboard">Projects</Link>
        </nav>

        <div className="site-footer__action">
          <p className="site-footer__heading">Build your next world</p>
          <p>Start with one idea, then connect every detail in one place.</p>
          <Link className="site-footer__button" to="/projects/new">
            Create a project
          </Link>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© {currentYear} ArcForge</p>
        <p>CodePath WEB103 capstone project</p>
      </div>
    </footer>
  );
}

export default Footer;
