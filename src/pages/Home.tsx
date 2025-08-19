/**
 * HOME PAGE COMPONENT
 * 
 * This is the main landing page of your portfolio website - the first thing 
 * visitors see when they arrive. Think of it like the front door and lobby 
 * of your professional house.
 * 
 * 🎯 Purpose:
 * - Create a strong first impression with your name and title
 * - Provide clear navigation to main sections (Work, About, Consulting)
 * - Set professional tone with clean, focused design
 * - Guide visitors to explore your portfolio
 * 
 * 🏗️ Page Structure:
 * - Header: Your name "Alessandro Battisti" and title "Design Researcher & Strategist"
 * - Navigation: Three main links (My work, About me, Consulting)
 * - Description: Brief value proposition "Together we understand & design for people"
 * 
 * 🎨 Design Philosophy:
 * - Minimal, clean design that puts content first
 * - Typography-focused layout (no distracting elements)
 * - Custom cursor interactions for enhanced UX
 * - Professional color scheme
 * 
 * 💡 Think of it like: A clean, elegant business card that invites people 
 *    to learn more about your work and expertise
 */

import React from 'react';
import { Link } from 'react-router-dom';  // React Router for page navigation

/**
 * Main Home Component Function
 * 
 * This function creates the complete landing page layout with all sections.
 * It's structured like a well-organized magazine cover with contact info.
 */
const Home: React.FC = () => {
  /**
   * RENDER THE HOME PAGE LAYOUT
   * 
   * The layout follows a clean, centered design pattern:
   * 1. Header section with name and title (who you are)
   * 2. Navigation section with main links (where visitors can go)
   * 3. Description section with value proposition (what you offer)
   * 4. Footer section with contact information (how to reach you)
   * 
   * 🎨 All styling is handled via CSS classes defined in global stylesheets
   */
  return (
    <div className="home-container">  {/* Main container for the entire page */}
      
      {/* 
        🏷️ HEADER SECTION - Personal Branding
        
        This section establishes your professional identity at first glance.
        It's like the header of a business card or letterhead.
        
        📍 Contains:
        - Your full name as the main headline
        - Professional title/role as subtitle
        - Clean typography hierarchy (h1 > p)
      */}
      <div className="home-header">
        <h1 className="home-title">Alessandro Battisti</h1>          {/* Primary headline - your name */}
        <p className="home-subtitle">Design Researcher & Strategist</p>  {/* Professional title */}
        {/* Testing new staging banner system */}
      </div>
      
      {/* 
        📖 MAIN CONTENT SECTION
        
        This section contains the primary actions and information visitors need.
        It's organized to guide users through a logical flow from navigation 
        to value proposition to contact information.
      */}
      <div className="home-content">
        
        {/* 
          🧭 NAVIGATION LINKS SECTION
          
          These are the three main paths visitors can take to explore your work.
          Each link has custom cursor styling for enhanced user experience.
          
          🎯 Strategic order:
          1. "My work" - Primary call-to-action (see portfolio)
          2. "About me" - Secondary (learn about you personally)  
          3. "Consulting" - Tertiary (business inquiry)
          
          🖱️ UX Enhancement: Each link has custom cursor styling
          - custom-cursor-work: Visual hint for portfolio browsing
          - custom-cursor-about: Personal touch for about page
          - custom-cursor-consulting: Professional cue for business
        */}
        <div className="nav-links">
          <Link to="/work" className="nav-link custom-cursor-work">
            My work          {/* Primary CTA - showcase portfolio */}
          </Link>
          <Link to="/about" className="nav-link custom-cursor-about">
            About me         {/* Personal connection - build trust */}
          </Link>
          <Link to="/consulting" className="nav-link custom-cursor-consulting">
            Consulting       {/* Business inquiry - monetization */}
          </Link>
        </div>
        
        {/* 
          💬 VALUE PROPOSITION SECTION
          
          This brief statement communicates what you offer and your approach.
          It's written in collaborative language ("Together we...") to:
          - Position you as a partner, not just a service provider
          - Emphasize human-centered design methodology
          - Create an inclusive, approachable tone
          
          🎯 Key messaging:
          - "Together" = Collaborative approach
          - "understand" = Research methodology
          - "design for people" = Human-centered philosophy
        */}
        <p className="home-description">
          Together we understand & design for people.
        </p>
        
        {/* 
          📞 FOOTER/CONTACT SECTION
          
          This section provides essential contact information for potential clients
          and collaborators. It's placed at the bottom but remains easily accessible.
          
          🔗 Contact Methods:
          1. LinkedIn - Professional networking (opens in new tab for convenience)
          2. Email - Direct communication (formatted to avoid spam bots)
          
          🛡️ Security Note: Email is formatted with [at] and [dot] to prevent
          automated spam harvesting while remaining human-readable.
          
          🎯 UX Considerations:
          - LinkedIn opens in new tab (target="_blank") so users don't lose your site
          - rel="noopener noreferrer" for security and performance
          - Clear labeling for accessibility
        */}
        <div className="home-footer">
          <div className="footer-links">
            {/* LinkedIn professional profile link */}
            <a 
              href="https://www.linkedin.com/in/alessandrojbattisti/" 
              target="_blank"           // Opens in new tab
              rel="noopener noreferrer" // Security best practice
              className="footer-link"
            >
              Linkedin
            </a>
            {/* Email contact - formatted to avoid spam bots */}
            <span className="email">email: abattisti [at] protonmail [dot] com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the Home component so it can be imported and used by App.tsx
export default Home; 