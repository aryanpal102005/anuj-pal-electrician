import React from 'react';

function ClickToCall() {
  const handleCall = () => {
    window.location.href = 'tel:+919012675213';
  };

  return (
    <button 
      onClick={handleCall}
      className="floating-call" 
      style={{ 
        textDecoration: 'none', 
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        background: 'none',
        fontSize: '1.5rem'
      }}
      title="Call us"
    >
      📞
    </button>
  );
}

export default ClickToCall;
