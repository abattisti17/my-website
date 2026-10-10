import React from 'react';
import { Link } from 'react-router-dom';
import SiteFrame from '../components/SiteFrame';
import PixelIcon from '../components/PixelIcon';

/**
 * Mango's page. Shown for any URL that doesn't exist.
 * The cat is the same 14 x 12 sprite as the icon on the main page, shown big.
 * TODO: swap in a dithered photo of the real Mango once there is one.
 */
const NotFound: React.FC = () => {
  return (
    <SiteFrame>
      <section className="ab-hero ab-404">
        <div className="ab-wrap ab-404-grid">
          <PixelIcon name="cat" className="ab-cat" label="Mango, in pixels" />
          <div>
            <h2 className="ab-label">404</h2>
            <h1 className="ab-404-title">Mango knocked this page off the table.</h1>
            <p className="ab-lead">There's nothing here. <Link to="/">Back to the main page</Link>.</p>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
};

export default NotFound;
