import React from 'react';
import { ArrowDown2, Logout } from 'iconsax-react';

interface UserAvatarProps {
  username: string;
  onLogout: () => void;
  className?: string;
}

export const UserAvatar = ({ 
  username, 
  onLogout,
  className = ""
}: UserAvatarProps) => {
  const displayName = username || "Guest";
  const initials = displayName.charAt(0).toUpperCase();
  
  return (
    <div className={`relative group ${className}`}>
      <div className="flex items-center space-x-1 bg-surface-secondary py-1.5 px-2 rounded-full cursor-pointer">
        <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
          {initials}
        </div>
        <ArrowDown2 size={16} variant="Bold" className="text-gray-500" />
      </div>
      
      {/* User dropdown menu */}
      <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
        <div className="px-4 py-2 border-b border-gray-100">
          <p className="text-sm font-medium">{displayName}</p>
        </div>
        <button 
          onClick={onLogout}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <Logout size={18} variant="Bold" className="mr-2" /> Log out
        </button>
      </div>
    </div>
  );
};