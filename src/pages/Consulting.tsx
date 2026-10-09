import React from 'react';
import { Link } from 'react-router-dom';
import SiteFrame, { DESIGN_LAB } from '../components/SiteFrame';

const Consulting: React.FC = () => {
  return (
    <SiteFrame>
      <section className="ab-page-head">
        <div className="ab-wrap">
          <h1>Consulting</h1>
          <p className="ab-lead">
            I'm not taking on consulting projects right now. My independent work goes into{' '}
            <a href={DESIGN_LAB}>Design Lab</a>, a small studio building focused software for small professional firms.
          </p>
          <p><Link to="/work">See past work</Link></p>
        </div>
      </section>
    </SiteFrame>
  );
};

export default Consulting;
