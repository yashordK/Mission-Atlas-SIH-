import React from 'react';

interface TopBarProps {
  userName: string;
}

const TopBar: React.FC<TopBarProps> = ({ userName }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: '64px',
      background: 'rgba(10,10,10,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid #2A2A2A',
      zIndex: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>⚡</span>
        <span style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.3px' }}>
          <span style={{ color: '#2563EB' }}>Mission</span>
          <span style={{ color: '#FFFFFF' }}> Atlas</span>
        </span>
        <span style={{
          background: 'rgba(37,99,235,0.15)',
          color: '#3B82F6',
          fontSize: '11px',
          padding: '2px 8px',
          borderRadius: '999px',
          border: '1px solid rgba(37,99,235,0.3)',
          fontWeight: 500,
        }}>
          SevenShield
        </span>
      </div>

      {/* Right: user info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Hello, {userName}</span>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '14px', fontWeight: 600,
          flexShrink: 0,
        }}>
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
