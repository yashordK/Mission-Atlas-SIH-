// src/components/SafetyScore.tsx
import React from 'react';

interface SafetyScoreProps {
  score: number;
}

const SafetyScore: React.FC<SafetyScoreProps> = ({ score }) => {
  return (
    <div className="bg-green-50 border-l-4 border-green-500 shadow p-4 rounded-lg">
      <h2 className="font-bold text-green-700 text-lg">Safety Score</h2>
      <p className="text-gray-700 mt-1">Current area safety: <span className="font-semibold">{score}%</span></p>
    </div>
  );
};

export default SafetyScore;
