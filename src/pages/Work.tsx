import React from 'react';
import { Link } from 'react-router-dom';
import SiteFrame, { EMAIL } from '../components/SiteFrame';
import { projects } from '../data/projects';

const Work: React.FC = () => {
  return (
    <SiteFrame>
      <section className="ab-page-head">
        <div className="ab-wrap">
          <h1>Work</h1>
          <p className="ab-lead">
            Mostly early-stage, generative research: figuring out who a new product is for, what they need, and what
            to build first.
          </p>
        </div>
      </section>

      <section className="ab-section">
        <div className="ab-wrap">
          <ul className="ab-work-list">
            {projects.map((p) => (
              <li key={p.id}>
                <Link to={`/project/${p.id}`}>
                  <img src={p.image} alt={p.imageAlt} loading="lazy" />
                  <span className="ab-proj-context">{p.context}</span>
                  <span className="ab-proj-title">{p.title}</span>
                  <span className="ab-proj-summary">{p.problem}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="ab-note">
            <p><strong>A note on confidentiality.</strong> Some participants' faces are blurred to protect their privacy. Several projects are under NDA, so specifics are removed and processes are described more abstractly.</p>
            <p>Questions about a project? <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
};

export default Work;
