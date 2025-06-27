import React from "react";
import thLogo from "../../public/assets/townhall_logo.svg"; // Adjust the path as necessary
import { useBreakpoint } from "@/hooks/util-hooks/use-breakpoints";

export const THLogo = ({ className = "" }: { className?: string }) => {
  const isMobile = useBreakpoint();
  return (
    <div className={`flex items-center ${className}`}>
      <div className="h-10 flex items-center justify-center">
        <img
          src={thLogo}
          alt="Townhall Logo"
          className="object-cover"
          width={isMobile ? 150 : 150}
          height={isMobile ? 150 : 150}
        />

        {/* <span className="text-white font-bold text-lg">TH</span> */}
      </div>
    </div>
  );
};
