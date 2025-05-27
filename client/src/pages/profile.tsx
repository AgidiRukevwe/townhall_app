import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useOfficialDetails } from "@/hooks/use-officials";
import {
  useApprovalRating,
  // usePerformanceData,
  // useRatings,
  useSectorRatings,
  useTimeBasedRatings,
} from "@/hooks/use-ratings";
import { Loading } from "@/components/shared/loading";
import { RatingModal } from "@/components/rating/rating-modal";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/hooks/use-auth.tsx";
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

export default function Profile() {
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  // State to track the selected period and sector
  const [selectedApprovalRatingPeriod, setSelectedApprovalRatingPeriod] =
    useState<Granularity>("1 Wk");
  const [selectedSector, setSelectedSector] = useState<string>("Health");

  const [sectorDatasets, setSectorDatasets] = useState<any>(null);

  const { id } = useParams<{ id: string }>();
  const {
    data: official,
    isLoading,
    error,
    isSuccess,
  } = useOfficialDetails(id);

  // const { data: ratingData, isLoading: isLoadingRatings } = useRatings(id);

  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useBreakpoint();

  // Get username or use default
  const userName: string =
    user && user !== null && typeof user === "object" && "username" in user
      ? (user.username as string)
      : "";

  const handleSearch = (query: string) => {
    // Redirect to home page with search query
    if (query.trim()) {
      const params = new URLSearchParams();
      params.set("search", query);
      window.location.href = `/?${params.toString()}`;
    }
  };

  useEffect(() => {
    console.log("User:", user);
    console.log("User's name:", user?.username);
  }, []);

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

  const tabTriggerClass = cn(
    "relative pt-4 px-1 pr-4 text-text-secondary text-sm rounded-none",
    "data-[state=active]:text-text-primary data-[state=active]:text-sm data-[state=active]:bg-white  data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:border-text-primary data-[state=active]:-mb-px rounded-none"
  );

  // Determine education and career data from official
  const educationData = official?.education || [];
  const careerData = official?.careerHistory || [];

  if (isLoading) {
    return <Loading message="Loading official profile..." />;
  }

  if (error || !official) {
    return (
      <main className="flex-1 bg-white">
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

  // All month navigation is now handled within the components

  return (
    <main className="flex-1 bg-white w-full overflow-hidden">
      <Navbar
        onSearch={handleSearch}
        username={userName}
        onLogout={handleLogout}
        classname="sticky top-0 z-50"
      />
      <div className="flex items-center mb-2 md:mb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="flex gap-x-2 md:gap-x-4 items-center">
          <Link href="/">
            <Icon name="ArrowCircleLeft2" color="#262626" />
          </Link>
          <span className="text-lg font-bold">Official's profile</span>
        </div>

        <div className="ml-auto">
          {!isMobile && (
            <Button
              onClick={() => setRatingModalOpen(true)}
              className="bg-surface-dark hover:bg-surface-dark/95 text-white rounded-full text-sm py-3"
            >
              Rate this leader
            </Button>
          )}
        </div>
      </div>

      {!isMobile ? (
        // {/* FOR DESKTOP VIEW  */}
        <div className="bg-white  hidden md:block md:flex-row">
          <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
            {/* Official's profile header */}

            <div className="flex flex-col md:flex-row items-start w-full justify-between">
              {/* Official Profile Card Component */}

              <OfficialProfileCard
                official={official}
                educationData={educationData}
                careerData={careerData}
                classname="w-full md:w-[20%] sticky top-24"
              />
              <div className=" md:w-[70%]">
                <ChartCard
                  chartName="Approval rating"
                  dataMap={approvaDataSet}
                  chartType="line"
                  chartKey="4"
                  valueChange={2.5}
                  isLoading={
                    isLoadingApproval || isLoadingApprovalRatingOverall
                  }
                  handlePeriodChange={handlePeriodChange}
                />

                <ChartCard
                  chartName="Performance by sectors"
                  dataMap={sectorDataSet}
                  chartType="bar"
                  chartKey="4"
                  valueChange={2.5}
                  isLoading={
                    isLoadingApproval || isLoadingApprovalRatingOverall
                  }
                  handlePeriodChange={handlePeriodChange}
                  showGranularity={false}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // {/* FOR MOBILE VIEW  */}
        <div className="pt-0 px-4 pb-40">
          <ProfileHeader official={official} />

          <Tabs defaultValue="performance">
            <TabsList className="flex justify-start bg-white rouunded-none w-full border-b-2 border-[#EAECF0] rounded-none mb-8">
              <TabsTrigger value="performance" className={tabTriggerClass}>
                Performance
              </TabsTrigger>
              <TabsTrigger value="about" className={tabTriggerClass}>
                About
              </TabsTrigger>
            </TabsList>
            <TabsContent value="performance">
              <div className="w-full">
                <ChartCard
                  chartName="Approval rating"
                  dataMap={approvaDataSet}
                  chartType="line"
                  chartKey="4"
                  valueChange={2.5}
                  isLoading={
                    isLoadingApproval || isLoadingApprovalRatingOverall
                  }
                  handlePeriodChange={handlePeriodChange}
                />

                <ChartCard
                  chartName="Performance by sectors"
                  dataMap={sectorDataSet}
                  chartType="bar"
                  chartKey="4"
                  valueChange={2.5}
                  isLoading={
                    isLoadingApproval || isLoadingApprovalRatingOverall
                  }
                  handlePeriodChange={handlePeriodChange}
                  showGranularity={false}
                />
              </div>
            </TabsContent>
            <TabsContent value="about">
              <OfficialProfileCard
                official={official}
                educationData={educationData}
                careerData={careerData}
                classname="w-full md:w-[20%]"
              />
            </TabsContent>
          </Tabs>
        </div>
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

const handleLogout = () => {
  // Make a POST request to logout endpoint directly
  fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  })
    .then(() => {
      // Clear user data from query cache
      queryClient.setQueryData(["/api/user"], null);
      // Redirect to login page
      window.location.href = "/auth";
    })
    .catch((err) => {
      console.error("Logout failed:", err);
    });
};
