import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useOfficialDetails } from "@/hooks/use-officials";
import {
  useApprovalRating,
  useSectorRatings,
  useTimeBasedRatings,
} from "@/hooks/use-ratings";
import { Loading } from "@/components/shared/loading";
import { RatingModal } from "@/components/rating/rating-modal";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { OfficialProfileCard } from "@/components/profile/official-profile-card";
import {
  ChartCard,
  DataMap,
  Granularity,
} from "@/components/profile/charts/chart-card";
import { Icon } from "@/components/ui/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/use-breakpoints";
import ProfileHeader from "@/components/profile/profile-card-header";
import { useFullRatingsData, usePerformance } from "@/hooks/use-performance";
import EmptyState from "@/components/shared/empty-state";
import ProfileMobileView from "@/components/profile/views/mobile-view";
import ProfileDesktopView from "@/components/profile/views/desktop-view";
import { char } from "drizzle-orm/mysql-core";
import { handleLogout } from "@/utils/handle-logout";
import { useSearchHandler } from "@/hooks/use-search";

export default function Profile() {
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  // State to track the selected period and sector
  const [selectedApprovalRatingPeriod, setSelectedApprovalRatingPeriod] =
    useState<Granularity>("1 Dy");

  const [chartEmpty, setChartEmpty] = useState<boolean>(true);

  const { id } = useParams<{ id: string }>();
  const { data: official, isLoading, error } = useOfficialDetails(id);

  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useBreakpoint();

  // Get username or use default
  const userName: string =
    user && user !== null && typeof user === "object" && "username" in user
      ? (user.username as string)
      : "";

  const { searchInput, handleSearch } = useSearchHandler();

  const handlePeriodChange = (period: Granularity) => {
    setSelectedApprovalRatingPeriod(period);
  };

  const { data: fullData } = useFullRatingsData(id);

  const { approvalRating, isLoading: isLoadingApprovalRatingOverall } =
    useApprovalRating(id);
  const {
    sectors,
    overallSectorRating,
    isLoading: isLoadingSectorRatings,
  } = useSectorRatings(id);
  const {
    timeLabels,
    data: approvalRatingData,
    isLoading: isLoadingApproval,
    refetch: refetchApprovalData,
  } = useTimeBasedRatings(id, selectedApprovalRatingPeriod);

  const approvaDataSet: DataMap = {
    overallRating: approvalRating,
    labels: timeLabels,
    data: approvalRatingData,
  };

  const sectorDataSet: DataMap = {
    overallRating: overallSectorRating,
    labels: sectors.map((sector) => sector.name),
    data: sectors.map((sector) => sector.rating),
  };

  useEffect(() => {
    refetchApprovalData();
  }, [selectedApprovalRatingPeriod]);

  useEffect(() => {
    console.log(fullData);
    if (approvalRating === 0 && overallSectorRating === 0) {
      setChartEmpty(false);
    }
  }, [approvalRating, overallSectorRating]);

  // Determine education and career data from official
  const educationData = official?.education || [];
  const careerData = official?.careerHistory || [];

  if (isLoading) {
    return <Loading message="Loading official profile..." />;
  }

  if (error || !official) {
    return (
      <main className="flex-1 bg-white ">
        <Navbar
          onSearch={handleSearch}
          username={userName}
          onLogout={handleLogout}
          showSearch={false}
        />

        <div className="bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/home"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Link>

            <div className="flex justify-center py-12">
              <p className="text-red-500">
                Error loading official:{" "}
                {error?.toString() || "Official not found"}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-white w-full overflow-hidden">
      <Navbar
        onSearch={handleSearch}
        username={userName}
        onLogout={handleLogout}
        // classname=""
        showSearch={true}
      />

      {!isMobile ? (
        // {/* FOR DESKTOP VIEW  */}s
        <ProfileDesktopView
          official={official}
          approvaDataSet={approvaDataSet}
          sectorDataSet={sectorDataSet}
          isLoadingApproval={isLoadingApproval}
          isLoadingApprovalRatingOverall={isLoadingApprovalRatingOverall}
          handlePeriodChange={handlePeriodChange}
          educationData={educationData}
          careerData={careerData}
          chartEmpty={chartEmpty}
          setRatingModalOpen={setRatingModalOpen}
        />
      ) : (
        // {/* FOR MOBILE VIEW  */}
        <ProfileMobileView
          official={official}
          approvaDataSet={approvaDataSet}
          sectorDataSet={sectorDataSet}
          isLoadingApproval={isLoadingApproval}
          isLoadingApprovalRatingOverall={isLoadingApprovalRatingOverall}
          handlePeriodChange={handlePeriodChange}
          educationData={educationData}
          careerData={careerData}
        />
      )}

      {/* Rating Modal */}
      <RatingModal
        open={ratingModalOpen}
        onOpenChange={setRatingModalOpen}
        officialId={official.id}
        officialName={official.name}
        sectors={official.sectors}
      />
      {isMobile && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-4 z-50 backdrop-blur-md bg-white/70">
          <Button
            onClick={() => setRatingModalOpen(true)}
            className="w-full bg-surface-dark hover:bg-surface-dark/95 text-white rounded-full text-sm py-3"
          >
            Rate this leader
          </Button>
        </div>
      )}
    </main>
  );
}
