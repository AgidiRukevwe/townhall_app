import { toTitleCase } from "@/helpers/to-title-case";
import { Official } from "@shared/schema";
import React from "react";

interface ProfileHeaderProps {
  official: Official;
}

function ProfileHeader({ official }: ProfileHeaderProps) {
  return (
    <div className="flex flex-row md:flex-col items-center gap-x-2">
      {official.imageUrl ? (
        <div className="w-24 h-24 bg-red- md:w-40 md:h-40 rounded-full overflow-hidden relative bg-[#e6f4ff] mb-3 border-4 border-white shadow-sm">
          <img
            src={official.imageUrl ?? ""}
            alt={official.name}
            className="absolute w-[150%] h-[150%] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 object-cover md:mx-auto"
          />
        </div>
      ) : (
        <div className="w-32 h-32 rounded-full bg-[#e6f4ff] flex items-center justify-center mb-3 border-4 border-white shadow-sm">
          <span className="text-[#1476FF] text-2xl font-bold">
            {official.name}
          </span>
        </div>
      )}

      {/* Official name and position */}
      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-900">
          {toTitleCase(official.name)}
        </h2>
        <p className="text-text-secondary mb-6 text-sm">{official.location}</p>
      </div>
    </div>
  );
}

export default ProfileHeader;
