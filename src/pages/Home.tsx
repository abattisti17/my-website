import React from 'react';
import { Link } from 'react-router-dom';
import SiteFrame, { EMAIL, LINKEDIN, DESIGN_LAB } from '../components/SiteFrame';
import PixelIcon, { IconName } from '../components/PixelIcon';
import portrait from '../img/portrait.png';

/**
 * One-page site: who I am, a short CV, a few personal notes.
 * Case studies are off for now (old pages redirect here).
 */
const NOTES: { icon: IconName; text: React.ReactNode }[] = [
  { icon: 'pin', text: 'Greenpoint, Brooklyn.' },
  { icon: 'shoe', text: "I run, but I'm not fast." },
  { icon: 'cup', text: 'I spend too much time on my espresso machine.' },
  { icon: 'cat', text: <>My cat Mango runs the <Link to="/mango">404&nbsp;page</Link>.</> },
];

const Home: React.FC = () => {
  return (
    <SiteFrame>
      <section className="ab-hero">
        <div className="ab-wrap ab-hero-grid">
          <div>
            <h1 className="ab-name">Alessandro Battisti.</h1>
            <p className="ab-lead">
              Design researcher. I study how people actually get things done, then help design what they use.
            </p>
            <p className="ab-hello">
              <a className="ab-hello-mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </p>
          </div>
          <figure className="ab-portrait">
            <img src={portrait} width={260} height={325} alt="Alessandro on the Brooklyn Bridge, in blue pixels" />
          </figure>
        </div>
      </section>

      <div className="ab-band" aria-hidden="true" />

      <section className="ab-section" aria-labelledby="cv-title">
        <div className="ab-wrap">
          <h2 id="cv-title" className="ab-label">Work</h2>
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
                  <li><b>Google</b><span>Research</span></li>
                  <li><b><a href="/fern/">Fern</a></b><span>Co-founder of a social impact design studio, working with nonprofits and community organizations</span></li>
                </ul>
              </dd>
            </div>
          </dl>
          <p className="ab-ask">
            <a href={`mailto:${EMAIL}?subject=Case%20studies`}>Ask me about case studies</a>
          </p>
        </div>
      </section>

      <div className="ab-band" aria-hidden="true" />

      <section className="ab-section" aria-labelledby="else-title">
        <div className="ab-wrap">
          <h2 id="else-title" className="ab-label">Elsewhere</h2>
          <ul className="ab-notes">
            {NOTES.map((n) => (
              <li key={n.icon}><PixelIcon name={n.icon} className={n.icon === 'cat' ? 'ab-ic ab-mango' : 'ab-ic'} /><span>{n.text}</span></li>
            ))}
          </ul>
        </div>
      </section>
    </SiteFrame>
  );
};

export default Home;
