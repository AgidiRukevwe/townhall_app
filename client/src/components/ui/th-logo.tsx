import React from "react";
import thLogo from "../../public/assets/th_logo.png"; // Adjust the path as necessary

export const THLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="h-7 flex items-center justify-center">
        <img
          src={thLogo}
          alt="Townhall Logo"
          className="object-cover h-full w-full"
          width={32}
          height={32}
        />

        {/* <span className="text-white font-bold text-lg">TH</span> */}
      </div>
    </div>
  );
};
