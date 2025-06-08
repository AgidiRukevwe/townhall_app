// import React, { useState } from "react";
// import { Link, useLocation } from "wouter";
// import { SearchInput } from "@/components/ui/search-input";
// import { UserAvatar } from "@/components/ui/user-avatar";
// import { THLogo } from "@/components/ui/th-logo";
// import { useBreakpoint } from "@/hooks/use-breakpoints";
// import { Icon } from "../ui/icon";
// import { Button } from "../ui/button";

// interface NavbarProps {
//   onSearch?: (query: string) => void;
//   searchPlaceholder?: string;
//   initialSearchValue?: string;
//   username?: string;
//   classname?: string;
//   onLogout?: () => void;
//   showSearch?: boolean;
// }

// export const Navbar: React.FC<NavbarProps> = ({
//   onSearch = () => {},
//   searchPlaceholder = "Search for officials, locations",
//   initialSearchValue = "",
//   username = "",
//   classname = "",
//   showSearch,
//   onLogout = () => {},
// }) => {
//   const isMobile = useBreakpoint();
//   const [location, navigate] = useLocation();

//   const [searchActive, setSearchActive] = useState<boolean>(false);

//   const onCancelSearch = () => {
//     setSearchActive(false);
//     navigate("/");
//   };

//   return (
//     <header
//       className={`bg-white/50 backdrop-blur-2xl border-b fixed top-0 left-0 right-0 z-50  border-gray-200 ${classname}`}
//     >
//       {!isMobile ? (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
//           <div className="flex justify-between items-center">
//             <div>
//               <Link href="/">
//                 <THLogo />
//               </Link>
//             </div>

//             <div className="flex items-center">
//               {showSearch && (
//                 <SearchInput
//                   onSearch={onSearch}
//                   placeholder={searchPlaceholder}
//                   initialValue={initialSearchValue}
//                 />
//               )}

//               <UserAvatar
//                 username={username}
//                 // onLogout={onLogout}
//                 className="profile-search-spacing"
//               />
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
//           {!searchActive ? (
//             <div className="flex flex-col gap-y-2 justify-between items-center">
//               <div className="flex items-center justify-between  w-full">
//                 <div>
//                   <Link href="/">
//                     <THLogo />
//                   </Link>
//                 </div>
//                 <div className="flex space-x-4 items-center justify-center">
//                   {showSearch && (
//                     <Icon
//                       name="SearchNormal1"
//                       size={24}
//                       color="#737373"
//                       onClick={() => setSearchActive(true)}
//                     />
//                   )}
//                   <UserAvatar
//                     username={username}
//                     // onLogout={onLogout}
//                     className="profile-search-spacing"
//                   />
//                 </div>
//               </div>
//               {/* <Icon name="SearchNormal1" size={24} color="#737373" /> */}
//               {/* {showSearch && (
//               <div className="w-full">
//                 <SearchInput
//                   onSearch={onSearch}
//                   placeholder={searchPlaceholder}
//                   initialValue={initialSearchValue}
//                 />
//               </div>
//             )} */}
//             </div>
//           ) : (
//             <div className="w-full flex">
//               <SearchInput
//                 onSearch={onSearch}
//                 placeholder={searchPlaceholder}
//                 initialValue={initialSearchValue}
//               />
//               <Button variant="ghost" onClick={onCancelSearch}>
//                 Cancel
//               </Button>
//             </div>
//           )}
//         </div>
//       )}
//     </header>
//   );
// };

import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { SearchInput } from "@/components/ui/search-input";
import { UserAvatar } from "@/components/ui/user-avatar";
import { THLogo } from "@/components/ui/th-logo";
import { useBreakpoint } from "@/hooks/use-breakpoints";
import { Icon } from "../ui/icon";
import { Button } from "../ui/button";

interface NavbarProps {
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  initialSearchValue?: string;
  username?: string;
  className?: string;
  onLogout?: () => void;
  showSearch?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearch = () => {},
  searchPlaceholder = "Search for officials, locations",
  initialSearchValue = "",
  username = "",
  className = "",
  showSearch,
  onLogout = () => {},
}) => {
  const isMobile = useBreakpoint();
  const [_, navigate] = useLocation();
  const [searchActive, setSearchActive] = useState(false);

  const onCancelSearch = () => {
    setSearchActive(false);
    navigate("/");
  };

  const renderDesktopNav = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="flex justify-between items-center">
        <Link href="/">
          <THLogo />
        </Link>
        <div className="flex items-center">
          {showSearch && (
            <SearchInput
              onSearch={onSearch}
              placeholder={searchPlaceholder}
              initialValue={initialSearchValue}
            />
          )}
          <UserAvatar username={username} className="profile-search-spacing" />
        </div>
      </div>
    </div>
  );

  const renderMobileNav = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      {!searchActive ? (
        <div className="flex flex-col gap-y-2 justify-between items-center">
          <div className="flex items-center justify-between w-full">
            <Link href="/">
              <THLogo />
            </Link>
            <div className="flex space-x-4 items-center">
              {showSearch && (
                <Icon
                  name="SearchNormal1"
                  size={24}
                  color="#737373"
                  onClick={() => setSearchActive(true)}
                  aria-label="Open search"
                />
              )}
              <UserAvatar
                username={username}
                className="profile-search-spacing"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex items-center gap-x-2">
          <SearchInput
            onSearch={onSearch}
            placeholder={searchPlaceholder}
            initialValue={initialSearchValue}
          />
          <Button
            variant="ghost"
            onClick={onCancelSearch}
            aria-label="Cancel search"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <header
      className={`bg-white/50 backdrop-blur-2xl border-b fixed top-0 left-0 right-0 z-50 border-gray-200 ${className}`}
    >
      {isMobile ? renderMobileNav() : renderDesktopNav()}
    </header>
  );
};
