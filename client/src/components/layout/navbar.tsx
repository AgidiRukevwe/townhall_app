import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { SearchInput } from "@/components/ui/search-input";
import { UserAvatar } from "@/components/ui/user-avatar";
import { THLogo } from "@/components/ui/th-logo";
import { useBreakpoint } from "@/hooks/util-hooks/use-breakpoints";
import { Icon } from "../ui/icon";
import { Button } from "../ui/button";
// import { useScrollFade } from "@/hooks/use-scroll-fade";
// import { useAuth } from "@/hooks/auth-hooks/use-auth-updated";
// import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/auth-hooks/use-auth-updated";
import { useScrollFade } from "@/hooks/util-hooks/use-scroll-fade";
// import { useAuth } from "@/hooks/use-auth";

interface NavbarProps {
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  initialSearchValue?: string;
  username?: string;
  className?: string;
  onLogout?: () => void;
  showSearch?: boolean;
  showBackButton?: boolean; // Optional prop to show back button
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearch = () => {},
  searchPlaceholder = "Search for officials, locations",
  initialSearchValue = "",
  username = "",
  className = "",
  showSearch,
  showBackButton,
  onLogout = () => {},
}) => {
  // const { user } = useAuth();
  const isMobile = useBreakpoint();
  const isScrolling = useScrollFade(1000); // fade in after 150ms of inactivity

  const [_, navigate] = useLocation();
  const [searchActive, setSearchActive] = useState(false);

  const onCancelSearch = () => {
    setSearchActive(false);
    navigate("/");
  };

  const { loginWithGoogle, user, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (error: any) {
      alert("Google sign-in failed: " + error.message);
    }
  };

  const renderDesktopNav = () => (
    // <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
    <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="flex justify-between items-center ">
        <Link href="/">
          <THLogo />
        </Link>

        <div className="flex items-center gap-4">
          {showSearch && (
            <SearchInput
              onSearch={onSearch}
              placeholder={searchPlaceholder}
              initialValue={initialSearchValue}
            />
          )}
          {!user ? (
            <Button variant="outline" size="sm" onClick={handleGoogleSignIn}>
              <Icon name="Google" size={16} color="#007aff" variant="Bold" />
              Sign in
            </Button>
          ) : (
            <UserAvatar className="profile-search-spacing" />
          )}
        </div>
      </div>
    </div>
  );

  const renderMobileNav = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      {!searchActive ? (
        <div className="flex flex-col gap-y-2 justify-between items-center">
          <div className="flex items-center justify-between w-full">
            {showBackButton ? (
              <Link href="/" className="mr-4">
                <Icon name="ArrowCircleLeft2" size={24} color="#262626" />
              </Link>
            ) : (
              <Link href="/">
                <THLogo />
              </Link>
            )}
            <div className="flex space-x-4 items-center">
              {showSearch && (
                <Icon
                  name="SearchNormal1"
                  size={20}
                  color="#737373"
                  onClick={() => setSearchActive(true)}
                  aria-label="Open search"
                />
              )}
              {!user ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGoogleSignIn}
                >
                  <Icon
                    name="Google"
                    size={16}
                    color="#007aff"
                    variant="Bold"
                  />
                  Sign in
                </Button>
              ) : (
                <UserAvatar className="profile-search-spacing" />
              )}
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
      className={`bg-white/50 backdrop-blur-2xl fixed top-0 left-0 right-0 z-50 border-gray-200 transition-all duration-300 ease-in-out  ${
        isScrolling
          ? "opacity-0 -translate-y-4 pointer-events-none"
          : "opacity-100 translate-y-0"
      } ${className}`}
    >
      {isMobile ? renderMobileNav() : renderDesktopNav()}
    </header>
  );
};
