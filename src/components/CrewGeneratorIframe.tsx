import React from 'react';

const CrewGeneratorIframe: React.FC = () => {
  // In development, the crew generator runs on port 3001
  // In production/staging, it would be served from the same domain or a different one
    const crewGeneratorUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173' 
    : '/crew';

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      border: 'none',
      overflow: 'hidden',
    }}>
      <iframe
        src={crewGeneratorUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="Crew Generator App"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
};

export default CrewGeneratorIframe;
