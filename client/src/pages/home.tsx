import { OfficialsList } from "@/components/officials/officials-list";
import { useOfficials } from "@/hooks/use-officials";
import { Loading } from "@/components/shared/loading";
import { useEffect, useState } from "react";
// import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { Navbar } from "@/components/layout/navbar";
import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { handleLogout } from "@/utils/handle-logout";
import { useSearchHandler } from "@/hooks/util-hooks/use-search";
import { WelcomeModal } from "@/components/shared/welcome-modal";
import { useWelcomeModal } from "@/hooks/use-welcome-modal";
import { Chart } from "iconsax-react";
import ChartIllustration from "@/public/assets/illustrations/chart-illustration";
import ProfileModal from "@/components/profile/views/profile-modal";
import { useOfficialModalStore } from "@/store/official-modal-store";
import { RatingModal } from "@/components/rating/rating-modal-updated";
import { useRatingModalStore } from "@/store/rating-store";
import { useSelectedOfficialStore } from "@/store/selected-official-store";
import { useAuthStore } from "@/store/auth-store";
import { useGoogleAuth } from "@/hooks/auth-hooks/use-google-auth";
import { useAuth } from "@/hooks/auth-hooks/use-auth-updated";
import { SignInModal } from "@/components/shared/sigin-in-modal";

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
  //test

  const { official } = useSelectedOfficialStore();

  const { initialize } = useAuthStore();
  const { handleOAuthRedirect } = useGoogleAuth();
  useEffect(() => {
    handleOAuthRedirect();
    // initialize(
    // console.log(user?.avatar_url);
  }, [user?.avatar_url]);

  // Get username or use default
  const userName: string =
    user && user !== null && typeof user === "object" && "username" in user
      ? (user.username as string)
      : "";

  // useEffect(() => {
  //   console.log("Avatar URL from home:", user?.avatar_url);
  // }, [user]);

  const { isOpen, closeModal } = useOfficialModalStore();
  const {
    openModal: openRatingModal,
    isOpen: isRatingModalOpen,
    closeModal: closeRatingModal,
  } = useRatingModalStore();

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
    <main className="pt-10 md:pt-16 flex-1 min-h-screen bg-white">
      <Navbar
        onSearch={handleSearch}
        initialSearchValue={searchInput}
        username={userName}
        onLogout={handleLogout}
        showSearch
      />

      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-6  ">
        {/* Main Content */}

        <div className="flex flex-row md:gap-2 justify-between items-center md:items-center py-8">
          <div className="flex flex-col gap-3 pb-2 md:pb-8 ">
            <h1 className="font-medium text-3xl md:text-5xl md:leading-[56px] flex flex-col">
              <span className="text-[#8c8c8c]">See how your</span> leaders are
              doing.
            </h1>
            {/* <p className="text-text-secondary font-normal">
              Start by checking who represents you and how they’re performing.
            </p> */}
          </div>

          <ChartIllustration className="w-20 h-20 md:w-36 md:h-36" />
        </div>
        {isLoading || isRefetching ? (
          <div className="flex flex-col items-center justify-center">
            <Loading message="Fetching officials" />
          </div>
        ) : (
          <OfficialsList
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

      <RatingModal
        open={isRatingModalOpen}
        onOpenChange={closeRatingModal}
        sectors={official?.sectors ?? []}
      />

      <ProfileModal open={isOpen} onOpenChange={closeModal} />

      <SignInModal />
    </main>
  );
}
