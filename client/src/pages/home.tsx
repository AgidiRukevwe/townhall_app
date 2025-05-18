import { SimpleOfficialsList } from "@/components/officials/simple-officials-list";
import { useOfficials } from "@/hooks/use-officials";
import { Loading } from "@/components/shared/loading";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { THLogo } from "@/components/ui/th-logo";
import { Search, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const params = new URLSearchParams();
      params.set("search", searchInput);
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
        {/* Header with Logo, Search, and User Avatar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <THLogo />
          </div>
          
          <div className="relative flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search for officials, locations"
                  className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </form>
          </div>
          
          <div className="flex items-center relative group">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 cursor-pointer">
              {user ? userName.charAt(0).toUpperCase() : "G"}
            </div>
            {userName && (
              <div className="ml-2 cursor-pointer">
                <span className="text-sm font-medium">
                  {userName}
                </span>
              </div>
            )}
            
            {/* User dropdown menu */}
            <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium">{userName}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" /> Log out
              </button>
            </div>
          </div>
        </div>
        
        {/* Greeting */}
        {userName && (
          <div className="mb-6">
            <h2 className="text-base font-medium flex items-center">
              Hello, {userName} <span className="text-amber-400 ml-1">👋</span>
            </h2>
          </div>
        )}

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
