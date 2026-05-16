import React from 'react';

interface PanicButtonProps {
  onPanic: (location: { lat: number; lng: number }) => void;
}

const PanicButton: React.FC<PanicButtonProps> = ({ onPanic }) => {
  return (
    <button
      onClick={() => onPanic({ lat: 26.1445, lng: 91.7362 })}
      title="Emergency Panic Button — activates SOS"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#DC2626',
        border: 'none',
        cursor: 'pointer',
        animation: 'panic-pulse 2s infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        color: 'white',
        fontWeight: 700,
        fontSize: '11px',
        letterSpacing: '0.5px',
        flexDirection: 'column' as const,
        gap: '2px',
        boxShadow: '0 4px 24px rgba(220,38,38,0.4)',
      }}
    >
      <span style={{ fontSize: '20px', lineHeight: 1 }}>🚨</span>
      <span>SOS</span>
    </button>
  );
};

export default PanicButton;
