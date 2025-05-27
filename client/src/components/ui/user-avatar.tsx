import React from "react";
import { ArrowDown2, Logout } from "iconsax-react";
import { Icon } from "./icon";

interface UserAvatarProps {
  username: string;
  onLogout: () => void;
  className?: string;
}

export const UserAvatar = ({
  username,
  onLogout,
  className = "",
}: UserAvatarProps) => {
  const displayName = username || "Guest";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className={`relative group ${className}`}>
      <div className="flex items-center space-x-1 bg-surface-secondary py-1.5 px-2 rounded-full cursor-pointer">
        <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center text-sm font-medium text-[#1476FF]">
          {initials}
        </div>
        <ArrowDown2 size={16} variant="Bold" className="text-gray-500" />
      </div>

      {/* User dropdown menu */}
      <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-sm py-1 px-2 hidden group-hover:block group-hover:rounded-xl z-10 border border-[#EAECF0]">
        <div className="px-4 py-2 border-b border-[#e5e5e5]">
          <p className="text-sm font-medium">{displayName}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full mt-2 text-left px-4 py-2 text-sm rounded-xl text-text-primary hover:bg-gray-100 flex items-center gap-x-2"
        >
          <Icon name="Logout" size={16} color="#737373" /> Log out
        </button>
      </div>
    </div>
  );
};
