import React from "react";

export const THLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/attached_assets/image_1747532861391.png"
        alt="TH Logo"
        className="w-8 h-8"
      />
    </div>
  );
};