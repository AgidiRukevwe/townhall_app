import React from "react";

export const THLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="bg-black w-8 h-8 flex items-center justify-center">
        <span className="text-white font-bold text-lg">TH</span>
      </div>
    </div>
  );
};