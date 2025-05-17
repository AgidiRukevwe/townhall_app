import React from "react";

export function THLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-[#262626] text-white font-bold flex items-center justify-center w-10 h-10 ${className}`}>
      TH
    </div>
  );
}