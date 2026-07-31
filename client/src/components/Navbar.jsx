import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isProjectSection =
    location.pathname === "/dashboard" ||
    location.pathname.startsWith("/projects/");

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const navLinkClass = ({ isActive }) =>
    `site-navbar__link${isActive ? " site-navbar__link--active" : ""}`;

  return (
    <header className="site-navbar">
      <div className="site-navbar__inner">
        <Link
          className="site-navbar__brand"
          to="/"
          aria-label="ArcForge home"
          onClick={closeMenu}
        >
          <img className="site-navbar__logo" src="/arcforge-logo.png" alt="" />
          <span>ArcForge</span>
        </Link>

        <button
          className="site-navbar__toggle"
          type="button"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>

        <nav
          id="primary-navigation"
          className={`site-navbar__nav${
            isMenuOpen ? " site-navbar__nav--open" : ""
          }`}
          aria-label="Primary navigation"
        >
          <NavLink end className={navLinkClass} to="/" onClick={closeMenu}>
            Home
          </NavLink>

          <Link
            className="site-navbar__link"
            to="/#features"
            onClick={closeMenu}
          >
            Features
          </Link>

          <Link
            className={`site-navbar__link${
              isProjectSection ? " site-navbar__link--active" : ""
            }`}
            to="/dashboard"
            onClick={closeMenu}
          >
            Projects
          </Link>

          <Link
            className="site-navbar__cta"
            to="/projects/new"
            onClick={closeMenu}
          >
            New Project
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
