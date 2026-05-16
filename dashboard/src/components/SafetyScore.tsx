import React from 'react';

interface SafetyScoreProps {
  score: number;
}

const SafetyScore: React.FC<SafetyScoreProps> = ({ score }) => {
  const color = score >= 70 ? '#2563EB' : score >= 40 ? '#D97706' : '#DC2626';
  const label = score >= 70 ? 'Safe Zone' : score >= 40 ? 'Elevated Risk' : 'Danger Zone';

  return (
    <div style={{
      backgroundColor: '#141414',
      border: '1px solid #2A2A2A',
      borderRadius: '16px',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    }}>
      {/* Score number */}
      <div style={{ flexShrink: 0 }}>
        <span style={{ fontSize: '48px', fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: '16px', color: '#4B5563', marginLeft: '2px' }}>/100</span>
      </div>

      {/* Info + bar */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '15px' }}>Safety Score</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color }}>{label}</span>
        </div>
        {/* Progress bar */}
        <div style={{ backgroundColor: '#2A2A2A', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
          <div style={{
            width: `${score}%`, height: '100%',
            backgroundColor: color,
            borderRadius: '4px',
            transition: 'width 0.6s ease',
          }} />
        </div>
        <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '6px' }}>
          Average across all tracked tourists
        </p>
      </div>
    </div>
  );
};

export default SafetyScore;
