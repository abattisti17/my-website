import React from 'react';
import { Link } from 'react-router-dom';
import SiteFrame from '../components/SiteFrame';

/** Mango's page. Shown for any URL that doesn't exist. */
const NotFound: React.FC = () => {
  return (
    <SiteFrame>
      <section className="ab-hero ab-404">
        <div className="ab-wrap ab-404-grid">
          <svg className="ab-cat" viewBox="0 0 200 170" role="img" aria-label="A line drawing of a cat sitting">
            <path d="M58 70 L48 28 L80 52" />
            <path d="M142 70 L152 28 L120 52" />
            <path d="M80 52 C92 46 108 46 120 52 C146 62 150 96 132 112 C116 126 84 126 68 112 C50 96 54 62 80 52 Z" />
            <path d="M82 84 C86 80 90 80 94 84" />
            <path d="M106 84 C110 80 114 80 118 84" />
            <path d="M96 96 L100 100 L104 96" />
            <path d="M100 100 L100 104" />
            <path d="M88 100 L60 96 M88 104 L60 106 M112 100 L140 96 M112 104 L140 106" />
            <path d="M70 120 C60 146 74 160 100 160 C126 160 140 146 130 120" />
            <path d="M130 150 C158 150 176 136 170 116" />
          </svg>
          <div>
            <p className="ab-hand ab-404-label">404</p>
            <h1>Mango knocked this page off the table.</h1>
            <p className="ab-lead">There's nothing here. <Link to="/">Back to the main page</Link>.</p>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
};

export default NotFound;
