import React from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';

const Work: React.FC = () => {
  return (
    <>
      <div className="floating-back-link">
        <p>
          <Link to="/" className="link-text">
            &lt;- Back to home
          </Link>
        </p>
      </div>

      <div className="frame">
        <div className="main">
          <img src="/src/assets/images/mywork.png" alt="grid of logos" />
          
          <h2>Examples of work</h2>
          <p>My work has mainly focused on early stage foundational and generative research to inform new products, services, and platforms.</p>
          
          <p>
            <Link to="/project/sensor" className="link-text">
              Understanding user perceptions of ambient sensing tech
            </Link>
            <br /><br />
            <Link to="/project/nudge" className="link-text">
              Nudging customers toward healthy financial behaviors
            </Link>
            <br /><br />
            <Link to="/project/ev" className="link-text">
              Finding product-market fit for a new e-vehicle
            </Link>
            <br /><br />
            <Link to="/project/pos" className="link-text">
              Developing an MVP strategy for a new Point-of-Sale device
            </Link>
          </p>

          {/* CONFIDENTIALITY START */}
          <div className="quote">
            <p>
              <b>A note on confidentiality</b>
              <br />
              <ul>
                <li>Some participant's faces have been blurred to protect their privacy.</li>
                <li>These projects are still under NDA. So specific content has been removed and processes have been made more abstract.</li>
              </ul>
              Questions about a specific project? Get in touch: abattisti {'{at}'} protonmail.com
            </p>
          </div>
          {/* CONFIDENTIALITY END */}
        </div>
      </div>
    </>
  );
};

export default Work; 