import React, { useState } from "react";
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
import useHandleRatingModal from "@/hooks/rating-hooks/use-handle-rating-modal";
import { tabTriggerClass } from "./profile-modal";
import { ArrowLeft } from "iconsax-react";
import { SectorChartCard } from "../charts/sector-chart-card";

interface ProfileMobileViewProps {
  official: Official;
  approvaDataSet: DataMap;
  sectorDataSet: DataMap;
  isLoadingApproval: boolean;
  isLoadingApprovalRatingOverall: boolean;
  handlePeriodChange: (period: Granularity) => void;
  educationData: any;
  careerData: CareerHistory;
  chartEmpty?: boolean;
  fullData: any;
  setRatingModalOpen: (value: boolean) => void;
}

function ProfileMobileView({
  official,
  approvaDataSet,
  isLoadingApproval,
  sectorDataSet,
  isLoadingApprovalRatingOverall,
  handlePeriodChange,
  educationData,
  careerData,
  chartEmpty,
  fullData,
  setRatingModalOpen,
}: ProfileMobileViewProps) {
  const handleRatingModal = useHandleRatingModal();

  if (!official) {
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
    <div className="pt-20 px-4 pb-40">
      <ProfileHeader />

      <Tabs defaultValue="performance">
        <TabsList className="flex justify-start bg-white rouunded-none w-full border-b-[1px] border-[#EAECF0] rounded-none mb-8">
          <TabsTrigger value="performance" className={tabTriggerClass}>
            <div className="flex gap-2 items-center justify-center">
              Performance
              {/* <Icon name="Chart2" size={16} color={"#8c8c8c"} /> */}
            </div>
          </TabsTrigger>
          <TabsTrigger value="about" className={tabTriggerClass}>
            <div className="flex gap-2 items-center justify-center">
              About
              {/* <Icon name="Profile" size={16} color={"#8c8c8c"} /> */}
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="performance">
          {chartEmpty ? (
            <div className=" md:w-[70%] py-8 items-center justify-center rounded-3xl">
              <EmptyState
                type="no-content"
                title="No one has rated this leader yet."
                description="Your rating helps others understand this leader’s impact.."
                customAction={{
                  label: "Rate this leader",
                  onClick: handleRatingModal,
                }}
              />
            </div>
          ) : (
            <div className="w-full">
              {/* <ChartCard
                chartName="Approval rating"
                dataMap={approvaDataSet}
                chartType="line"
                chartKey="4"
                valueChange={2.5}
                isLoading={isLoadingApproval || isLoadingApprovalRatingOverall}
                handlePeriodChange={handlePeriodChange}
                autoSkipXAxisLabels={true}
              /> */}

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

              {/* <ChartCard
                chartName="Performance by sectors"
                dataMap={sectorDataSet}
                chartType="bar"
                chartKey="4"
                valueChange={2.5}
                isLoading={isLoadingApproval || isLoadingApprovalRatingOverall}
                handlePeriodChange={handlePeriodChange}
                showGranularity={false}
                autoSkipXAxisLabels={false}
              /> */}

              <div className="fixed flex items-center justify-center bottom-5 inset-x-0 p-4 z-50">
                <Button
                  onClick={handleRatingModal}
                  className="bg-surface-dark hover:bg-surface-dark/95 text-white rounded-full text-sm py-3"
                >
                  <Icon name="Like1" />
                  Rate this official
                </Button>
              </div>
              {/* <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-4 z-50 backdrop-blur-md bg-white/70">
                <Button
                  onClick={handleRatingModal}
                  className="w-full bg-surface-dark hover:bg-surface-dark/95 text-white rounded-full text-sm py-3"
                >
                  Rate this leader
                </Button>
              </div> */}
            </div>
          )}
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
  );
}

export default ProfileMobileView;
