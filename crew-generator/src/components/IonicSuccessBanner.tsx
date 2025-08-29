import React from 'react';
import { IonCard, IonCardContent, IonButton } from '@ionic/react';
import './IonicSuccessBanner.css';

const IonicSuccessBanner: React.FC = () => {
  const handleButtonClick = () => {
    // Simple action to demonstrate the button works
    alert('🎉 Ionic integration successful! Button clicked!');
  };

  return (
    <IonCard className="ionic-success-banner">
      <IonCardContent className="ionic-success-content">
        <div className="ionic-success-text">
          <span className="ionic-success-emoji">🎉</span>
          <span className="ionic-success-title">Ionic Success!</span>
        </div>
        <IonButton
          onClick={handleButtonClick}
          className="ionic-success-button"
          fill="clear"
        >
          Celebrate! ✨
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default IonicSuccessBanner;
