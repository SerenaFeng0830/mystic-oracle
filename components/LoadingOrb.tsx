import React from 'react';

const LoadingOrb: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <div className="relative w-16 h-16">
        {/* Pixelated Spinner using borders */}
        <div className="absolute inset-0 border-4 border-slate-700 border-t-amber-400 border-r-amber-400 border-b-purple-600 border-l-purple-600 animate-[spin_1.5s_steps(8)_infinite] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]"></div>
        
        {/* Inner static pixel */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white animate-pulse"></div>
      </div>
      <p className="text-amber-300 font-pixel text-xs animate-pulse tracking-widest uppercase pixel-text-shadow">
        Loading Fate...
      </p>
    </div>
  );
};

export default LoadingOrb;