import React from 'react';
import { Link } from 'react-router-dom';


interface BackButtonProps {
  to: string;
  text?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to, text = "Back to home" }) => {
  return (
    <div className="floating-back-link">
      <Link to={to} className="back-button-link">
        <img src="/back-button.svg" alt="Back" className="back-button-icon" />
        <span className="back-button-text">{text}</span>
      </Link>
    </div>
  );
};

export default BackButton; 