import React from 'react';
import SiteFrame, { EMAIL, LINKEDIN, DESIGN_LAB } from '../components/SiteFrame';

const About: React.FC = () => {
  return (
    <SiteFrame>
      <section className="ab-page-head">
        <div className="ab-wrap">
          <h1>About</h1>
        </div>
      </section>
      <section className="ab-section ab-section-flush">
        <div className="ab-wrap ab-about">
          <figure className="ab-taped ab-about-fig">
            <span className="ab-tape" aria-hidden="true" />
            <img src="/aboutme.jpeg" alt="Alessandro on the Brooklyn Bridge" className="ab-about-photo" />
          </figure>
          <div className="ab-prose">
            <p className="ab-lead">
              I'm a design researcher. I spend my time with the people a product is for, learning how they work and
              what gets in their way, then turning that into decisions a team can build on.
            </p>
            <p>
              Today I'm a UX Researcher at Dropbox, working on new AI products. Before that I did research at Twitter, where I worked on making the
              platform safer, and at Google, where I led research on how people perceive ambient sensing in Google's
              hardware. Along the way I've worked with startups, nonprofits and agencies on new products, services and
              marketplaces.
            </p>
            <p>
              On the side I run <a href={DESIGN_LAB}>Design Lab</a>, a small studio building focused software for small
              professional firms.
            </p>
            <h2 className="ab-hand">How I work</h2>
            <ul>
              <li><strong>Systems thinking</strong> to see how people, tools and organizations affect each other.</li>
              <li><strong>Design thinking</strong> to make progress on problems without a clean answer.</li>
              <li><strong>Behavior design</strong> to help people do what they already want to do.</li>
            </ul>
            <h2 className="ab-hand">Who I've worked with</h2>
            <p>Organizations of every size, from startups to nonprofits to large companies and agencies.</p>
            <img src="/who-ive-worked-w.png" alt="Logos of organizations Alessandro has worked with" className="ab-logos" loading="lazy" />
            <h2 className="ab-hand">Get in touch</h2>
            <p>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or{' '}
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>.
            </p>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
};

export default About;
