import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

const Work: React.FC = () => {
  return (
    <>
      <BackButton />

      <div className="page-container">
        <div className="page-content">
          <img src="/mywork.png" alt="grid of logos" className="page-image" />
          <div className="page-header">
            <h1 className="page-title">Examples of work</h1>
            <p>My work has mainly focused on early stage foundational and generative research to inform new products, services, and platforms.</p>
          </div>
          
          <div className="project-links">
            <Link to="/project/sensor" className="link-text project-link">
              Understanding user perceptions of ambient sensing tech
            </Link>
            
            <Link to="/project/nudge" className="link-text project-link">
              Nudging customers toward healthy financial behaviors
            </Link>
            
            <Link to="/project/ev" className="link-text project-link">
              Finding product-market fit for a new e-vehicle
            </Link>
            
            <Link to="/project/pos" className="link-text project-link">
              Developing an MVP strategy for a new Point-of-Sale device
            </Link>
          </div>

          {/* CONFIDENTIALITY START */}
          <div className="quote">
            <p><b>A note on confidentiality</b></p>
            <br />
            <ul>
              <li>Some participant's faces have been blurred to protect their privacy.</li>
              <li>These projects are still under NDA. So specific content has been removed and processes have been made more abstract.</li>
            </ul>
            <p>Questions about a specific project? Get in touch: abattisti {'{at}'} protonmail.com</p>
          </div>
          {/* CONFIDENTIALITY END */}
        </div>
      </div>
    </>
  );
};

export default Work; 