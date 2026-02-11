import React, { useState, useEffect } from 'react';

interface FakeForbiddenProps {
  onUnlock: () => void;
}

const FakeForbidden: React.FC<FakeForbiddenProps> = ({ onUnlock }) => {
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (clickCount >= 3) {
      onUnlock();
    }
    
    // Reset click count if inactive for 2 seconds to prevent accidental triggers
    const timer = setTimeout(() => {
      setClickCount(0);
    }, 2000);

    return () => clearTimeout(timer);
  }, [clickCount, onUnlock]);

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
  };

  return (
    <div 
      onClick={handleClick}
      className="min-h-screen bg-white text-black font-serif p-4 cursor-default select-none"
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      <div className="max-w-screen-lg mx-auto mt-10">
        <h1 className="text-4xl font-bold mb-4">403 Forbidden</h1>
        <hr className="border-t border-gray-400 mb-4" />
        <p className="text-base">nginx/1.18.0 (Ubuntu)</p>
      </div>
    </div>
  );
};

export default FakeForbidden;