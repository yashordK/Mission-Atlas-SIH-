// src/components/TopBar.tsx
import React from 'react';

interface TopBarProps {
  userName: string;
}

const TopBar: React.FC<TopBarProps> = ({ userName }) => {
  return (
    <div className="h-16 bg-white shadow-md flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-20">
      <h1 className="text-xl font-bold">Tourist Safety Dashboard</h1>
      <div className="font-medium">Hello, {userName}</div>
    </div>
  );
};

export default TopBar;
