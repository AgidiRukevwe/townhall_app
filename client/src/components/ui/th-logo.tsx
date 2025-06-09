import React from "react";
import thLogo from "../../public/assets/th_logo.png"; // Adjust the path as necessary
import { useBreakpoint } from "@/hooks/use-breakpoints";

export const THLogo = ({ className = "" }: { className?: string }) => {
  const isMobile = useBreakpoint();
  return (
    <div className={`flex items-center ${className}`}>
      <div className="h-7 flex items-center justify-center">
        <img
          src={thLogo}
          alt="Townhall Logo"
          className="object-cover"
          width={isMobile ? 56 : 60}
          height={isMobile ? 56 : 60}
        />

        {/* <span className="text-white font-bold text-lg">TH</span> */}
      </div>
    </div>
  );
};
