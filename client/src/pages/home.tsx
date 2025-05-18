import { SimpleOfficialsList } from "@/components/officials/simple-officials-list";
import { useOfficials } from "@/hooks/use-officials";
import { Loading } from "@/components/shared/loading";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { THLogo } from "@/components/ui/th-logo";
import { Link, useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { SearchInput } from "@/components/ui/search-input";
import { UserAvatar } from "@/components/ui/user-avatar";

export default function Home() {
  const { officials, isLoading, error } = useOfficials();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [searchInput, setSearchInput] = useState("");
  
  // Get username or use default
  const userName: string = user && user !== null && typeof user === 'object' && 'username' in user ? 
    (user.username as string) : "";

  // Get search params
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("search");

  const handleSearch = (query: string) => {
    if (query.trim()) {
      const params = new URLSearchParams();
      params.set("search", query);
      navigate(`/?${params.toString()}`);
    }
  };

  const handleLogout = () => {
    // Make a POST request to logout endpoint directly
    fetch('/api/logout', {
      method: 'POST',
      credentials: 'include'
    }).then(() => {
      // Clear user data from query cache
      queryClient.setQueryData(['/api/user'], null);
      // Redirect to login page
      navigate('/auth');
    }).catch(err => {
      console.error("Logout failed:", err);
    });
  };

  // Filter officials based on search query
  const filteredOfficials = searchQuery
    ? officials.filter(
        (official) =>
          official.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          official.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (official.location && official.location.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : officials;

  if (error) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-red-500">Error loading officials: {error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* New Header with Logo, Search, and User Avatar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <THLogo />
          </div>
          
          <div className="flex items-center">
            <SearchInput 
              onSearch={handleSearch}
              placeholder="Search for officials, locations"
              initialValue={searchInput} 
            />
            
            <UserAvatar 
              username={userName}
              onLogout={handleLogout}
              className="profile-search-spacing"
            />
          </div>
        </div>
        
        {/* Main Content */}
        {isLoading ? (
          <Loading />
        ) : (
          <SimpleOfficialsList officials={filteredOfficials} isLoading={isLoading} />
        )}
      </div>
    </main>
  );
}
