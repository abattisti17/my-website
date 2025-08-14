import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

interface BackButtonProps {
  to?: string;
  text?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to, text = "Back" }) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <div className="floating-back-link">
      <button onClick={handleBack} className="back-button-link">
        <Icon name="back" size="medium" className="back-button-icon" alt="Back" />
        <span className="back-button-text">{text}</span>
      </button>
    </div>
  );
};

export default BackButton; 