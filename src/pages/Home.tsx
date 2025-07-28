import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="frame" id="frontpage">
      <div className="main">
        <h2>
          <b>Alessandro Battisti</b>
          <br />Design Researcher & Strategist
        </h2>
        
        <p>Together, we understand & design for people.</p>

        <h2>
          <Link to="/work" className="link-text">
            My Work
          </Link>
          <br />
          <Link to="/about" className="link-text">
            About me
          </Link>
          <br />
          <Link to="/consulting" className="link-text">
            Consulting
          </Link>
        </h2>
      </div>

      <div className="footer">
        <p>
          <i>Let's connect</i>
          <br /><br />
          Twitter: <a className="link-text" href="https://twitter.com/tweetessandro" target="_blank" rel="noopener noreferrer">@tweetessandro</a>
          <br />
          Email: abattisti {'{at}'} protonmail.com
          <br />
          <a className="link-text" href="https://www.linkedin.com/in/alessandrojbattisti/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </p>
        
        <p>
          <br />
          What I'm reading right now:
          <a className="link-text" href="https://en.wikipedia.org/wiki/Seeing_Like_a_State" target="_blank" rel="noopener noreferrer">
            "Seeing Like a State: How Certain Schemes to Improve the Human Condition Have Failed"
          </a> by James C. Scott
        </p>
        
        <p>
          <br />
          <em>"A vision should be judged by the clarity of its values, not the clarity of its implementation path."</em> -Donella Meadows
        </p>
      </div>
    </div>
  );
};

export default Home; 