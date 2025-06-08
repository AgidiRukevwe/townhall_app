import React from "react";
import { ChartCard, DataMap, Granularity } from "../charts/chart-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Icon } from "@/components/ui/icon";
import ProfileHeader from "../profile-card-header";
import { OfficialProfileCard } from "../official-profile-card";
import { CareerHistory, Official } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ProfileMobileViewProps {
  official: Official;
  approvaDataSet: DataMap;
  sectorDataSet: DataMap;
  isLoadingApproval: boolean;
  isLoadingApprovalRatingOverall: boolean;
  handlePeriodChange: (period: Granularity) => void;
  educationData: any;
  careerData: CareerHistory;
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
}: ProfileMobileViewProps) {
  const tabTriggerClass = cn(
    "relative pt-4 px-1 pr-4 text-text-secondary text-sm rounded-none",
    "data-[state=active]:text-text-primary data-[state=active]:text-sm data-[state=active]:bg-white  data-[state=active]:font-bold",
    "data-[state=active]:border-b-2 data-[state=active]:border-text-primary data-[state=active]:-mb-px rounded-none"
  );

  return (
    <div className="pt-20 px-4 pb-40">
      <div className="flex  gap-x-2 md:gap-x-4 items-center pb-4">
        <Link href="/">
          <Icon name="ArrowCircleLeft2" color="#262626" />
        </Link>
        {/* <span className="text-lg font-bold">Official's profile</span> */}
      </div>

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
              isLoading={isLoadingApproval || isLoadingApprovalRatingOverall}
              handlePeriodChange={handlePeriodChange}
              autoSkipXAxisLabels={true}
            />

            <ChartCard
              chartName="Performance by sectors"
              dataMap={sectorDataSet}
              chartType="bar"
              chartKey="4"
              valueChange={2.5}
              isLoading={isLoadingApproval || isLoadingApprovalRatingOverall}
              handlePeriodChange={handlePeriodChange}
              showGranularity={false}
              autoSkipXAxisLabels={false}
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
  );
}

export default ProfileMobileView;
