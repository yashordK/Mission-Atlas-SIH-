// src/components/PanicButton.tsx
import React from 'react';

interface PanicButtonProps {
  onPanic: (location: { lat: number; lng: number }) => void;
}

const PanicButton: React.FC<PanicButtonProps> = ({ onPanic }) => {
  return (
    <button 
      className="fixed bottom-6 right-6 bg-red-600 text-white w-16 h-16 rounded-full shadow-lg hover:bg-red-700 active:scale-95 transition-transform duration-200 flex items-center justify-center text-lg font-bold z-50"
      onClick={() => onPanic({ lat: 26.1445, lng: 91.7362 })}
      title="Emergency Panic Button"
    >
      PANIC
    </button>
  );
};

export default PanicButton;
