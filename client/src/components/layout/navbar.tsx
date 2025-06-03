import React, { useState } from "react";
import { Link } from "wouter";
import { SearchInput } from "@/components/ui/search-input";
import { UserAvatar } from "@/components/ui/user-avatar";
import { THLogo } from "@/components/ui/th-logo";
import { useBreakpoint } from "@/hooks/use-breakpoints";

interface NavbarProps {
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  initialSearchValue?: string;
  username?: string;
  classname?: string;
  onLogout?: () => void;
  showSearch?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearch = () => {},
  searchPlaceholder = "Search for officials, locations",
  initialSearchValue = "",
  username = "",
  classname = "",
  showSearch,
  onLogout = () => {},
}) => {
  const isMobile = useBreakpoint();
  return (
    <header
      className={`bg-white/50 backdrop-blur-2xl border-b fixed top-0 left-0 right-0 z-50  border-gray-200 ${classname}`}
    >
      {!isMobile ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/">
                <THLogo />
              </Link>
            </div>

            <div className="flex items-center">
              {showSearch && (
                <SearchInput
                  onSearch={onSearch}
                  placeholder={searchPlaceholder}
                  initialValue={initialSearchValue}
                />
              )}

              <UserAvatar
                username={username}
                onLogout={onLogout}
                className="profile-search-spacing"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
          <div className="flex flex-col gap-y-2 justify-between items-center">
            <div className="flex items-center justify-between  w-full">
              <div>
                <Link href="/">
                  <THLogo />
                </Link>
              </div>

              <UserAvatar
                username={username}
                onLogout={onLogout}
                className="profile-search-spacing"
              />
            </div>

            {showSearch && (
              <div className="w-full">
                <SearchInput
                  onSearch={onSearch}
                  placeholder={searchPlaceholder}
                  initialValue={initialSearchValue}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
