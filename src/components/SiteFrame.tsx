import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export const EMAIL = 'abattisti@protonmail.com';
export const LINKEDIN = 'https://www.linkedin.com/in/alessandrojbattisti/';
export const DESIGN_LAB = 'https://designlab.fyi/';

interface SiteFrameProps {
  children: React.ReactNode;
}

/**
 * Shared header and footer for the portfolio pages.
 * Styles live in src/personal.css, scoped under .ab.
 */
const SiteFrame: React.FC<SiteFrameProps> = ({ children }) => {
  return (
    <div className="ab">
      <a className="ab-skip" href="#main">Skip to content</a>
      <header className="ab-header">
        <div className="ab-wrap ab-header-row">
          <Link to="/" className="ab-name">Alessandro Battisti</Link>
          <nav className="ab-nav" aria-label="Main">
            <NavLink to="/work">Work</NavLink>
            <NavLink to="/about">About</NavLink>
            <a href={DESIGN_LAB}>Design Lab</a>
          </nav>
        </div>
      </header>

      <main id="main">{children}</main>

      <footer className="ab-footer">
        <div className="ab-wrap ab-footer-row">
          <p>Alessandro Battisti, design researcher in New York</p>
          <p className="ab-footer-links">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SiteFrame;
