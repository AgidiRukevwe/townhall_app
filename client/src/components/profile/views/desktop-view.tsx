import React from "react";
import { ChartCard, DataMap, Granularity } from "../charts/chart-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Icon } from "@/components/ui/icon";
import ProfileHeader from "../profile-card-header";
import { OfficialProfileCard } from "../official-profile-card";
import { CareerHistory, Official } from "@shared/schema";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useBreakpoint } from "@/hooks/use-breakpoints";

interface ProfileDesktopViewProps {
  official: Official;
  approvaDataSet: DataMap;
  sectorDataSet: DataMap;
  isLoadingApproval: boolean;
  isLoadingApprovalRatingOverall: boolean;
  handlePeriodChange: (period: Granularity) => void;
  educationData: any;
  chartEmpty: boolean;
  careerData: CareerHistory;
  setRatingModalOpen: (value: boolean) => void;
}

function ProfileDesktopView({
  official,
  approvaDataSet,
  isLoadingApproval,
  sectorDataSet,
  isLoadingApprovalRatingOverall,
  handlePeriodChange,
  educationData,
  careerData,
  chartEmpty,
  setRatingModalOpen,
}: ProfileDesktopViewProps) {
  const isMobile = useBreakpoint();

  return (
    <>
      <div className="fixed pt:32 top-0 right-0 z-10 left-0 bg-white md:pt-24 flex items-center mb-2 md:mb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex  gap-x-2 md:gap-x-4 items-center">
          <Link href="/">
            <Icon name="ArrowCircleLeft2" color="#262626" />
          </Link>
          <span className="text-lg font-bold">Official's profile</span>
        </div>

        <div className="ml-auto">
          {!isMobile && !chartEmpty && (
            <Button
              onClick={() => setRatingModalOpen(true)}
              className="bg-surface-dark hover:bg-surface-dark/95 text-white rounded-full py-3"
              size="sm"
            >
              Rate this leader
            </Button>
          )}
        </div>
      </div>
      <div className="pt-32 md:pt-24 bg-white  hidden md:block md:flex-row">
        <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
          {/* Official's profile header */}

          <div className="md:pt-16 flex flex-col md:flex-row items-start w-full justify-between">
            {/* Official Profile Card Component */}

            <OfficialProfileCard
              official={official}
              educationData={educationData}
              careerData={careerData}
              classname="w-full md:w-[20%]"
            />

            {chartEmpty ? (
              /* <div className=" md:w-[70%] border border-[#D9D9D9] bg-[#FCFCFC] py-8 items-center justify-center rounded-3xl"> */
              <div className=" md:w-[70%] py-8 items-center justify-center rounded-3xl">
                <EmptyState
                  type="no-content"
                  title="No one has rated this leader yet."
                  description="Your rating helps others understand this leader’s impact.."
                  customAction={{
                    label: "Rate this leader",
                    onClick: () => setRatingModalOpen(true),
                  }}
                />
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileDesktopView;
