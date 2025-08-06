import React from 'react';
import BackButton from '../components/BackButton';

const About: React.FC = () => {
  return (
    <>
      <BackButton />

      <div className="page-container">
        <div className="page-content">
          <img src="/aboutme.jpeg" alt="Alessandro Battisti" className="page-image" />
          <div className="page-header">
            <h1 className="page-title">About me</h1>
            <p>I'm a design researcher & strategist passionate about creating ethical products & services. I'm currently working at Twitter on making the Twitter community a safer place for everyone.</p>
          </div>

          <p>
            <b>My philosophy:</b> I believe in the power of participatory behavior design to empower communities.
            <br /><br />
            Lenses I bring to my work:
          </p>

          <ul>
            <li><i><a className="link-text" href="https://en.wikipedia.org/wiki/Systems_theory#Systems_thinking" target="_blank" rel="noopener noreferrer">systems thinking</a></i> as a way of understanding relationships and identifying leverage points.</li>
            <li><i><a className="link-text" href="https://en.wikipedia.org/wiki/Design_thinking#Wicked_problems" target="_blank" rel="noopener noreferrer">design thinking</a></i> as a way to approach tackling wicked problems.</li>
            <li><i><a className="link-text" href="https://en.wikipedia.org/wiki/Behavioural_design" target="_blank" rel="noopener noreferrer">behavior design</a></i> as a way to empower by giving them the tools to nudge themselves toward better outcomes.</li>
          </ul>

          <br />
          <p>
            <b>Who I've worked with</b>
            <br />
            I've worked with organizations of all sizes, from startups to non-profits to big corporations to agencies.
          </p>

          <img className="content-image" src="/who-ive-worked-w.png" alt="grid of logos" />
        </div>
      </div>
    </>
  );
};

export default About; 