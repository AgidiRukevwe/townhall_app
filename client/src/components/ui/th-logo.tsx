import React from "react";

export const THLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="bg-black p-2 w-10 h-10 flex items-center justify-center">
        <span className="text-white font-bold text-xl">TH</span>
      </div>
    </div>
  );
};