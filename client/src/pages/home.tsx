import { SimpleOfficialsList } from "@/components/officials/simple-officials-list";
import { useOfficials } from "@/hooks/use-officials";
import { Loading } from "@/components/shared/loading";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { Navbar } from "@/components/layout/navbar";
import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { handleLogout } from "@/utils/handle-logout";
import { useSearchHandler } from "@/hooks/use-search";
import { WelcomeModal } from "@/components/shared/welcome-modal";
import { useWelcomeModal } from "@/hooks/use-welcome-modal";

export default function Home() {
  const [, navigate] = useLocation();

  // Get search parameter from URL
  const searchParams = new URLSearchParams(window.location.search);
  const urlSearchQuery = searchParams.get("search") || "";

  const { searchInput, handleSearch, setSearchInput } = useSearchHandler();
  const { showWelcome, markWelcomeAsSeen } = useWelcomeModal();

  // Use our enhanced useOfficials hook with search parameter
  const {
    officials,
    isLoading,
    error,
    searchQuery,
    refetch: refetchOfficials,
    isRefetching,
  } = useOfficials({
    search: urlSearchQuery,
  });

  const { user } = useAuth();

  // Get username or use default
  const userName: string =
    user && user !== null && typeof user === "object" && "username" in user
      ? (user.username as string)
      : "";

  useEffect(() => {
    setSearchInput(urlSearchQuery);
  }, [urlSearchQuery]);

  // Filter officials based on search query
  const filteredOfficials = searchQuery
    ? officials.filter(
        (official) =>
          official.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          official.position
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (official.location &&
            official.location.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : officials;

  if (error) {
    // if (error.message)
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-surface rounded-3xl">
        <EmptyState
          type="no-internet"
          title="Failed to Load Data"
          description="We had trouble loading the information. Please check your internet connection and try again."
          onRetry={refetchOfficials}
          showRetry
          retryLabel="Retry"
        />
      </div>
    );
  }

  return (
    <main className="pt-20 md:pt-16 flex-1 min-h-screen bg-white">
      <Navbar
        onSearch={handleSearch}
        initialSearchValue={searchInput}
        username={userName}
        onLogout={handleLogout}
        showSearch
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6   ">
        {/* Main Content */}
        {isLoading || isRefetching ? (
          <div className="flex flex-col items-center justify-center">
            <Loading message="Fetching officials" />
          </div>
        ) : (
          <SimpleOfficialsList
            officials={filteredOfficials}
            isLoading={isLoading || isRefetching}
          />
        )}
      </div>
      <WelcomeModal
        isOpen={showWelcome}
        onClose={markWelcomeAsSeen}
        onContinue={markWelcomeAsSeen}
      />
    </main>
  );
}
