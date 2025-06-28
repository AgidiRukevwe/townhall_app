import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useOfficialDetails } from "@/hooks/use-officials";
import {
  useApprovalRating,
  useSectorRatings,
  useTimeBasedRatings,
} from "@/hooks/use-ratings";
import { Loading } from "@/components/shared/loading";
// import { RatingModal } from "@/components/rating/rating-modal";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/util-hooks/use-toast";
import { ArrowLeft, User } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
// import { useAuth } from "@/hooks/use-auth.tsx";
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
import { useBreakpoint } from "@/hooks/util-hooks/use-breakpoints";
import ProfileHeader from "@/components/profile/profile-card-header";
import { useFullRatingsData, usePerformance } from "@/hooks/use-performance";
import EmptyState from "@/components/shared/empty-state";
import ProfileMobileView from "@/components/profile/views/mobile-view";
import ProfileDesktopView from "@/components/profile/views/desktop-view";
import { char } from "drizzle-orm/mysql-core";
import { handleLogout } from "@/utils/handle-logout";
import { useSearchHandler } from "@/hooks/util-hooks/use-search";
import { Official } from "@shared/schema";
import { useOfficialModalStore } from "@/store/official-modal-store";
import { useSelectedOfficialStore } from "@/store/selected-official-store";
import { useRatingModalStore } from "@/store/rating-store";
import { useAuth } from "@/hooks/auth-hooks/use-auth-updated";
import { useSignInModalStore } from "@/store/signin-modal-store";
import useHandleRatingModal from "@/hooks/rating-hooks/use-handle-rating-modal";
import { SectorChartCard } from "../charts/sector-chart-card";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const tabTriggerClass = cn(
  "relative pt-4 px-1 mr-4 text-text-secondary text-sm font-medium rounded-none transition-all duration-300 ease-in-out",
  "data-[state=active]:text-text-primary data-[state=active]:text-sm data-[state=active]:bg-transparent  data-[state=active]:font-bold",
  "data-[state=active]:border-b-2 data-[state=active]:border-surface-brand data-[state=active]:-mb-px rounded-none"
);

export default function ProfileModal({
  open,
  onOpenChange,
}: ProfileModalProps) {
  // State to track the selected period and sector
  const [selectedApprovalRatingPeriod, setSelectedApprovalRatingPeriod] =
    useState<Granularity>("1 Dy");

  const [chartEmpty, setChartEmpty] = useState<boolean>(true);
  const handleRatingModal = useHandleRatingModal();

  const { id } = useParams<{ id: string }>();
  const {
    selectedOfficialId,
    isOpen,
    closeModal: closeProfileModal,
  } = useOfficialModalStore();

  const { toast } = useToast();
  const { user } = useAuth();

  // Get username or use default
  const userName: string =
    user && user !== null && typeof user === "object" && "username" in user
      ? (user.username as string)
      : "";

  const handlePeriodChange = (period: Granularity) => {
    setSelectedApprovalRatingPeriod(period);
  };

  const { data: fullData } = useFullRatingsData(selectedOfficialId ?? "");

  const { approvalRating, isLoading: isLoadingApprovalRatingOverall } =
    useApprovalRating(selectedOfficialId ?? "");
  const {
    sectors,
    overallSectorRating,
    isRefetching: isRefetchingSectorRatings,
    refetch: refetchSectorRatings,
    isLoading: isLoadingSectorRatings,
  } = useSectorRatings(selectedOfficialId ?? "");
  const {
    timeLabels,
    data: approvalRatingData,
    isLoading: isLoadingApproval,
    isRefetching: isRefetchingApprovalData,
    refetch: refetchApprovalData,
  } = useTimeBasedRatings(
    selectedOfficialId ?? "",
    selectedApprovalRatingPeriod
  );

  const {
    data: official,
    isLoading,
    error,
    refetch,
    isRefetching: isRefetchingOfficial,
  } = useOfficialDetails(selectedOfficialId ?? "");

  const {
    setOfficial,
    setRefetchOfficial,
    setRefetchRatingData,
    isRefetchingRatingData,
    setRefetchingOfficial,
  } = useSelectedOfficialStore();
  useEffect(() => {
    if (official) {
      setOfficial(official as Official);
    }
  }, [official, setOfficial]);

  useEffect(() => {
    setRefetchOfficial(refetch);
    setRefetchRatingData(refetchSectorRatings);
  }, [isRefetchingRatingData]);

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
      setChartEmpty(true);
    } else {
      setChartEmpty(false);
    }
  }, [approvalRating, overallSectorRating, fullData]);

  useEffect(() => {
    console.log("Labels by Granularity:", fullData?.sectorPeriodRating);
  }, []);

  // Determine education and career data from official
  const educationData = official?.education || [];
  const careerData = official?.careerHistory || [];
  if (!isOpen || !selectedOfficialId) return null;
  if (isLoading) {
    return <Loading message="Loading official profile..." />;
  }

  if (error || !official) {
    return (
      <div className="flex-1 bg-white z-50">
        <div className="bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/home"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Link>

            <EmptyState
              type="no-content"
              title="No official found"
              description="We couldn't find the official you're looking for."
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Overlay background */}``
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeProfileModal}
      />
      {isRefetchingRatingData ? (
        <Loading />
      ) : (
        <div className="absolute right-5 top-5 h-[95%] w-[40%] z-50 bg-white backdrop-blur-lg border-2 border-white rounded-3xl p-6 overflow-y-auto hide-scrollbar scrollar-hide scrollbar-none">
          <div className="flex flex-row justify-between items-center pb-6">
            <h4 className="text-xl">Official's profile</h4>
            <Icon
              name="CloseCircle"
              color="#737373"
              onClick={closeProfileModal}
              className="cursor-pointer"
            />
          </div>
          <div className="flex flex-row justify-between items-center">
            <ProfileHeader />
            <Button
              size="sm"
              onClick={handleRatingModal}
              className="bg-surface-dark hover:bg-surface-dark/95 text-white rounded-full text-sm py-3"
            >
              <Icon name="Like1" />
              Rate this official
            </Button>
          </div>
          <Tabs defaultValue="performance">
            <TabsList className="flex justify-start bg-transparent w-full border-b-[1px] border-[#EAECF0] rounded-none mb-8">
              <TabsTrigger value="performance" className={tabTriggerClass}>
                Performance
              </TabsTrigger>
              <TabsTrigger value="about" className={tabTriggerClass}>
                About
              </TabsTrigger>
            </TabsList>
            {/* {isRefetchingApprovalData ? (
              <Loading />
            ) : ( */}
            <>
              <TabsContent value="performance">
                {chartEmpty ? (
                  <div className="flex  md:w-[100%] py-8 items-center justify-center rounded-3xl">
                    <EmptyState
                      type="no-content"
                      title="No one has rated this leader yet."
                      description="Your rating helps others understand this leader’s impact.."
                      showButton={false}
                      //   customAction={{
                      //     label: "Rate this leader",
                      //     onClick: () => setRatingModalOpen(true),
                      //   }}
                    />
                  </div>
                ) : (
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
                      autoSkipXAxisLabels={true}
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
                      autoSkipXAxisLabels={false}
                    />

                    {fullData?.sectorPeriodRating && (
                      <div>
                        {Object.entries(fullData.sectorPeriodRating).map(
                          ([sectorName, periodData]) => {
                            const sectorData = periodData as Record<
                              Granularity,
                              { data: number[]; labels: string[] }
                            >;

                            return (
                              <SectorChartCard
                                key={sectorName}
                                sectorName={sectorName}
                                sectorData={sectorData}
                                isLoading={false}
                              />
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="about">
                <OfficialProfileCard
                  official={official}
                  educationData={educationData}
                  careerData={careerData}
                  classname="w-full md:w-[100%]"
                />
              </TabsContent>
            </>
          </Tabs>
        </div>
      )}
    </div>
  );
}
