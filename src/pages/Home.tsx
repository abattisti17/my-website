import React from 'react';
import { Link } from 'react-router-dom';
import SiteFrame, { EMAIL, LINKEDIN, DESIGN_LAB } from '../components/SiteFrame';
import { projects } from '../data/projects';

const fieldwork = [
  { src: '/me-postits.png', caption: 'Synthesis: sorting interview notes into patterns', to: '/work' },
  { src: '/nu_inhome.png', caption: 'In-home interview with a wireless customer', to: '/project/nudge' },
  { src: '/ps_truck.png', caption: 'Watching a food truck run its point of sale', to: '/project/pos' },
  { src: '/ps_interview.png', caption: 'Interviewing small business owners', to: '/project/pos' },
];

const Home: React.FC = () => {
  return (
    <SiteFrame>
      <section className="ab-hero">
        <div className="ab-wrap ab-hero-grid">
          <div>
            <h1>I study how people actually get things done, then help design what they use.</h1>
            <p className="ab-lead">
              Design researcher. Currently a UX Researcher at Dropbox. Before that, research at Google and Twitter,
              and independent work with startups, nonprofits and agencies.
            </p>
            <p className="ab-contact">
              <a href={`mailto:${EMAIL}`}>Email me</a>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </p>
          </div>
          <figure className="ab-taped ab-hero-photo">
            <span className="ab-tape" aria-hidden="true" />
            <img className="ab-portrait" src="/aboutme.jpeg" alt="Alessandro on the Brooklyn Bridge" />
            <figcaption className="ab-sticky">Hi, I'm Alessandro</figcaption>
          </figure>
        </div>
      </section>

      <section className="ab-section" aria-labelledby="fieldwork-title">
        <div className="ab-wrap">
          <h2 id="fieldwork-title" className="ab-h2 ab-hand">From the field</h2>
          <ul className="ab-strip">
            {fieldwork.map((f) => (
              <li key={f.src}>
                <Link to={f.to} className="ab-taped">
                  <span className="ab-tape" aria-hidden="true" />
                  <img src={f.src} alt="" loading="lazy" />
                  <span className="ab-caption">{f.caption}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ab-section" aria-labelledby="work-title">
        <div className="ab-wrap">
          <h2 id="work-title" className="ab-h2 ab-hand">Selected work</h2>
          <ol className="ab-projects">
            {projects.map((p) => (
              <li key={p.id}>
                <Link to={`/project/${p.id}`}>
                  <span className="ab-proj-context">{p.context}</span>
                  <span className="ab-proj-title">{p.title}</span>
                  <span className="ab-proj-summary">{p.problem}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ab-section" aria-labelledby="now-title">
        <div className="ab-wrap ab-now">
          <h2 id="now-title" className="ab-h2 ab-hand">On the side</h2>
          <div>
            <p className="ab-now-title">Design Lab</p>
            <p>
              A small studio I run, building focused software for small professional firms. First up: fee tracking
              and invoicing for architecture practices of 1 to 20 people.
            </p>
            <a className="ab-button" href={DESIGN_LAB}>Visit designlab.fyi</a>
          </div>
        </div>
      </section>

      <section className="ab-section" aria-label="What clients say">
        <div className="ab-wrap">
          <figure className="ab-quote ab-taped">
            <span className="ab-tape" aria-hidden="true" />
            <blockquote>
              <p><mark>Alessandro helped us optimize our limited funds, reduce our risk, and give our members what they need.</mark></p>
            </blockquote>
            <figcaption>
              Allyson Ditchey, founder and CEO of{' '}
              <a href="https://www.connectthearts.com" target="_blank" rel="noopener noreferrer">Connect the Arts</a>
            </figcaption>
          </figure>
        </div>
      </section>
    </SiteFrame>
  );
};

export default Home;
