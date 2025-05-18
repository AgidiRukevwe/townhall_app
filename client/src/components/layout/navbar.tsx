import React, { useState } from 'react';
import { Link } from 'wouter';
import { SearchInput } from '@/components/ui/search-input';
import { UserAvatar } from '@/components/ui/user-avatar';
import { THLogo } from '@/components/ui/th-logo';

interface NavbarProps {
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  initialSearchValue?: string;
  username?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onSearch = () => {}, 
  searchPlaceholder = 'Search for officials, locations', 
  initialSearchValue = '',
  username = '',
  onLogout = () => {}
}) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/">
              <THLogo />
            </Link>
          </div>
          
          <div className="flex items-center">
            <SearchInput 
              onSearch={onSearch}
              placeholder={searchPlaceholder}
              initialValue={initialSearchValue}
            />
            
            <UserAvatar 
              username={username}
              onLogout={onLogout}
              className="profile-search-spacing"
            />
          </div>
        </div>
      </div>
    </header>
  );
};