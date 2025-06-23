// import React, { useEffect } from "react";
// import { ArrowDown2, Logout } from "iconsax-react";
// import { Icon } from "./icon";
// import { handleLogout } from "@/utils/handle-logout";
// import { useAuthStore } from "@/store/auth-store";
// import { useAuth } from "@/hooks/auth-hooks/use-auth-updated";

// interface UserAvatarProps {
//   // onLogout: () => void;
//   className?: string;
// }

// export const UserAvatar = ({
//   // onLogout,
//   className = "",
// }: UserAvatarProps) => {
//   const { user } = useAuthStore();
//   const { logout } = useAuth();
//   const displayName = user?.username || "Guest";

//   useEffect(() => {
//     console.log(user?.avatar_url, "is logged in");
//   });
//   // const initials = displayName.charAt(0).toUpperCase();

//   const initials = displayName.charAt(0).toUpperCase();
//   return (
//     <div className={`relative group ${className}`}>
//       <div className="flex items-center space-x-1 bg-surface-secondary py-1.5 px-2 rounded-full cursor-pointer">
//         <div className="h-7 w-7 rounded-full bg-white overflow-hidden">
//           {user?.avatar_url ? (
//             <img
//               src={user?.avatar_url}
//               alt={user?.username}
//               className="h-full w-full"
//             />
//           ) : (
//             <div className="flex h-7 w-7 items-center justify-center text-sm font-medium text-[#1476FF]">
//               {initials}
//             </div>
//           )}
//         </div>
//         <ArrowDown2 size={16} variant="Bold" className="text-gray-500" />
//       </div>

//       {/* User dropdown menu */}
//       <div className="absolute top-full right-0 mt-1 w-48 bg-surface-secondary/90 backdrop-blur-md rounded-xl shadow-sm py-1 px-2 hidden group-hover:block group-hover:rounded-xl z-10">
//         <div className="px-4 py-2 border-b border-[#D9D9D9]/50">
//           <p className="text-sm text-text-primary font-medium">{displayName}</p>
//         </div>
//         <button
//           // onClick={handleLogout}
//           onClick={logout}
//           className="w-full mt-2 text-left px-4 py-2 text-sm rounded-xl text-text-primary hover:bg-gray-100 flex items-center gap-x-2"
//         >
//           <Icon name="Logout" size={16} color="#737373" /> Log out
//         </button>
//       </div>
//     </div>
//   );
// };

import React, { useEffect } from "react";
import { ArrowDown2, Logout } from "iconsax-react";
import { Icon } from "./icon";
import { handleLogout } from "@/utils/handle-logout";
import { useAuthStore } from "@/store/auth-store";
import { useAuth } from "@/hooks/auth-hooks/use-auth-updated";

interface UserAvatarProps {
  // onLogout: () => void;
  className?: string;
}

export const UserAvatar = ({
  // onLogout,
  className = "",
}: UserAvatarProps) => {
  // const { user } = useAuthStore();
  const { user } = useAuth();
  const { logout } = useAuth();
  const displayName = user?.username || "Guest";

  // const initials = displayName.charAt(0).toUpperCase();

  const initials = displayName.charAt(0).toUpperCase();
  return (
    <div className={`relative group ${className}`}>
      <div className="flex items-center space-x-1 bg-surface-secondary py-1.5 px-2 rounded-full cursor-pointer">
        <div className="h-7 w-7 rounded-full bg-white overflow-hidden">
          {user?.avatar_url ? (
            <img
              src={user?.avatar_url}
              alt={user?.username}
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center text-sm font-medium text-[#1476FF]">
              {initials}
            </div>
          )}
        </div>
        <ArrowDown2 size={16} variant="Bold" className="text-gray-500" />
      </div>

      {/* User dropdown menu */}
      <div className="absolute top-full right-0 mt-1 w-48 bg-surface-secondary/90 backdrop-blur-md rounded-xl shadow-sm py-1 px-2 hidden group-hover:block group-hover:rounded-xl z-10">
        <div className="px-4 py-2 border-b border-[#D9D9D9]/50">
          <p className="text-sm text-text-primary font-medium">{displayName}</p>
        </div>
        <button
          // onClick={handleLogout}
          onClick={logout}
          className="w-full mt-2 text-left px-4 py-2 text-sm rounded-xl text-text-primary hover:bg-gray-100 flex items-center gap-x-2"
        >
          <Icon name="Logout" size={16} color="#737373" /> Log out
        </button>
      </div>
    </div>
  );
};
