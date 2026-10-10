import React from 'react';

export const EMAIL = 'abattisti@protonmail.com';
export const LINKEDIN = 'https://www.linkedin.com/in/alessandrojbattisti/';
export const DESIGN_LAB = 'https://designlab.fyi/';

interface SiteFrameProps {
  children: React.ReactNode;
}

/**
 * Shared wrapper for the one-page site and the 404 page.
 * Styles live in src/personal.css, scoped under .ab.
 */
const SiteFrame: React.FC<SiteFrameProps> = ({ children }) => {
  return (
    <div className="ab">
      <main id="main">{children}</main>
      <footer className="ab-footer">
        <div className="ab-wrap ab-footer-row">
          <p>Alessandro Battisti, Greenpoint, Brooklyn</p>
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
