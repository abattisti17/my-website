import React from 'react';
import Trace from './Trace';

export const EMAIL = 'abattisti@protonmail.com';
export const LINKEDIN = 'https://www.linkedin.com/in/alessandrojbattisti/';
export const DESIGN_LAB = 'https://designlab.fyi/';

/**
 * Shared wrapper for the one-page site and Mango's 404 page:
 * the cursor trail, the closing "say hi" email, and the footer.
 * Styles live in src/personal.css, scoped under .ab. Rules in DESIGN.md.
 */
const SiteFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="ab">
      <Trace wanderId="wander" />
      <main id="main">{children}</main>
      <div className="ab-band" aria-hidden="true" />
      <section className="ab-end" aria-label="Contact">
        <div className="ab-wrap">
          <p className="ab-wander" id="wander">Might as well say hi:</p>
          <a className="ab-bigmail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
      </section>
      <footer className="ab-footer">
        <div className="ab-wrap ab-footer-row">
          <p>&copy; 2026 Alessandro Battisti</p>
          <p><a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
        </div>
      </footer>
    </div>
  );
};

export default SiteFrame;
