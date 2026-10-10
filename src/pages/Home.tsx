import React from 'react';
import { Link } from 'react-router-dom';
import SiteFrame, { EMAIL, LINKEDIN, DESIGN_LAB } from '../components/SiteFrame';

/**
 * One-page site: a little about the work, a CV, and a few personal notes.
 * Case studies are off for now (old pages redirect here).
 */
const Home: React.FC = () => {
  return (
    <SiteFrame>
      <section className="ab-hero">
        <div className="ab-wrap ab-hero-grid">
          <div>
            <h1 className="ab-name-h1">Alessandro Battisti</h1>
            <p className="ab-lead">
              Design researcher. I study how people actually get things done, then help design what they use.
            </p>
            <p className="ab-contact">
              <a href={`mailto:${EMAIL}`}>Email</a>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </p>
          </div>
          <figure className="ab-taped ab-hero-photo">
            <span className="ab-tape" aria-hidden="true" />
            <img className="ab-portrait" src="/aboutme.jpeg" alt="Alessandro on the Brooklyn Bridge" />
          </figure>
        </div>
      </section>

      <section className="ab-section" aria-labelledby="cv-title">
        <div className="ab-wrap">
          <h2 id="cv-title" className="ab-h2 ab-hand">Work</h2>
          <dl className="ab-cv">
            <div>
              <dt>Now</dt>
              <dd>
                <ul>
                  <li><b>Dropbox</b><span>UX research on new AI products</span></li>
                  <li><b><a href={DESIGN_LAB}>Design Lab</a></b><span>My small studio on the side, building software for small professional firms</span></li>
                </ul>
              </dd>
            </div>
            <div>
              <dt>Before</dt>
              <dd>
                <ul>
                  <li><b>Twitter</b><span>Research</span></li>
                  <li><b>Google</b><span>Research, 2020 to 2021</span></li>
                  <li><b>Independent</b><span>Research and strategy for startups, nonprofits and agencies</span></li>
                </ul>
              </dd>
            </div>
          </dl>
          <p className="ab-cv-note">
            Happy to walk through past work on a call. <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
        </div>
      </section>

      <section className="ab-section" aria-labelledby="else-title">
        <div className="ab-wrap">
          <h2 id="else-title" className="ab-h2 ab-hand">Elsewhere</h2>
          <ul className="ab-notes">
            <li>Greenpoint, Brooklyn.</li>
            <li>I run, but I'm not fast.</li>
            <li>I spend too much time on my espresso machine.</li>
            <li>My cat Mango runs the <Link to="/mango">404 page</Link>.</li>
          </ul>
        </div>
      </section>
    </SiteFrame>
  );
};

export default Home;
