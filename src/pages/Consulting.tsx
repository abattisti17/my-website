import React from 'react';
import BackButton from '../components/BackButton';

const Consulting: React.FC = () => {
  return (
    <>
      <BackButton to="/" text="Back to home" />

      <div className="frame">
        <div className="main">
          <h2>Consulting</h2>

          <p>
            <b>How we work together:</b> I've worked with organizations of all types—from sustainability startups to global technology companies to innovative non-profits. Together, we've developed deep understanding and relationships with their communities to launch successful, thoughtful products and services. My work focuses on early stage foundational and generative research to inform new products, services, and platforms. I typically choose a few organizations to work with for the year that I believe have the biggest appetite and potential for impact.
            <br /><br />
          </p>

          {/* TESTIMONIAL START */}
          <div className="quote">
            <p><b>What it's like working together</b></p>
            <h2>"Alessandro helped us optimize our limited funds, reduce our risk, & give our members what they need."</h2>
            <p>
              <i>"Working with Alessandro has not only been one of the greatest experiences I've had since starting my company, but also one of the most critical. We have been working on our startup for a couple of years. While our mission has always been about empowerment and strengthening the system for the arts, we were really struggling to figure out a sustainable business from that. Through his design process, Alessandro helped us optimize our limited funds. We created a step-by-step plan that reduces our risk and makes sure that our intentions match our execution: that we are actually giving our members what they need. He is a clear communicator who is phenomenal at organizing and distilling information to its essence. I could not be happier with our relationship."</i>
              <br /><br />
              Allyson Ditchey, Founder & CEO of <a href="https://www.connectthearts.com" target="_blank" rel="noopener noreferrer">Connect the Arts</a>
            </p>
          </div>
          {/* TESTIMONIAL END */}

          <p>
            <br />
            <b>Partners, not vendors</b>
            <br />
            This isn't your standard client-vendor relationship. When I work with clients, we are trusted partners. We work side-by-side to think through thorny decisions. We uncover near-term impact and dream up long-term strategies for lasting value.
            <br /><br />

            <b>Services (aka. How I can help)</b>
            <br /><br />

            <i>User research</i>
            <br />
            It goes by many names: design research, ethnographic research, market research. Together we understand the population(s) you care about—your customers, audience, users, donors... whoever matters to your organization. We unearth their needs, motivations, and mindsets to drive your new human-centered strategy.
            <br /><br />
            Case study: I worked with an electric vehicle startup to understand the different types of customers it might target, and develop product designs and GTM strategy that resonated with the target market's unique mindsets and perceptions.
            <br /><br />

            <i>Product & Service Strategy</i>
            <br />
            Powered by deep human insight and years of expertise, I design products and services people love. Working across your organization, we'll develop a launch roadmap and viral marketing strategy to set you up for success.
            <br /><br />
            Case study: A community arts organization was building an online multi-sided marketplace. I helped them understand the needs of each side of the market. Together we developed a strategy for their MVP, including initial target users (for each side of the marketplace) and product definition.
            <br /><br />

            <i>Behavior Design</i>
            <br />
            Leveraging insights from social science on habit formation, decision-making, and persuasion, I help your organization design experiences that enable the populations you serve to meet their goals.
            <br /><br />
            Case study: I worked with a national telecom client to help their customers develop healthy financial behaviors—i.e. saving for life's unpredictability. Through qualitative research I developed customer archetypes with different relationships to their finances and interventions ("nudges") that best change their behavior. Collaborating with data science, we were able to deliver targeted experiences to each population, helping them save for the future.
            <br /><br />

            <i>Organizational Culture</i>
            <br />
            I take a considered approach to understanding your organization's internal culture. Through in-depth interviews and participatory design, I uncover the cultural barriers to success and opportunities to catalyze impact.
            <br /><br />
            Case study: A global search engine moves in a new strategic direction with their products. They hired me to understand how their organizational culture impacts their efforts in this new area. Through research, I highlighted the way their cultural biases inhibit their success and the ways their organizational superpowers can be leveraged for unique advantage.
            <br /><br />
          </p>
        </div>
      </div>
    </>
  );
};

export default Consulting; 