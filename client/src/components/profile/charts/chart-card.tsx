import React, { useState } from "react";
import { cn } from "@/lib/utils";

import { Icon } from "@/components/ui/icon";
import DottedGridChart from "./dotted-chart";
import { useFullRatingsData, usePerformance } from "@/hooks/use-performance";
import { Loading } from "@/components/shared/loading";
import { useBreakpoint } from "@/hooks/use-breakpoints";

export type Granularity = "1 Dy" | "1 Wk" | "1 Yr";

export interface SectorData {
  sectorId: string;
  color: string;
  data: number[];
}

export interface PerformanceResponse {
  officialId: string;
  overallRating: number;
  timePeriod: string;
  timeLabels: string[];
  allSectors: {
    [sectorName: string]: SectorData;
  };
  overallData: number[];
}

export interface DataMap {
  overallRating: number;
  labels: string[];
  data: number[];
}

export interface ChartCardProps {
  chartKey?: string;
  chartName?: string;

  valueChange?: number;
  chartType?: "line" | "bar"; // extendable
  granularityOptions?: Granularity[];
  dataMap: DataMap;
  officialId?: string;
  isLoading: boolean;
  handlePeriodChange: (period: Granularity) => void;
  showGranularity?: boolean;
  autoSkipXAxisLabels?: boolean;
}

export const ChartCard = ({
  chartName = "Chart Title",
  chartType = "line",
  valueChange = 0,
  granularityOptions = ["1 Dy", "1 Wk", "1 Yr"],
  dataMap,
  isLoading,
  officialId = "",
  handlePeriodChange,
  showGranularity = true,
  autoSkipXAxisLabels,
}: ChartCardProps) => {
  const [granularity, setGranularity] = useState<Granularity>(
    granularityOptions[0]
  );

  // const selectedDataset = dataMap[granularity];
  const selectedDataset = dataMap;
  const isMobile = useBreakpoint();

  const truncatedLabels = selectedDataset.labels.map((label) => {
    const limit = isMobile ? 15 : 25;
    return label.length > limit ? label.slice(0, limit) + "…" : label;
  });

  if (isLoading || !selectedDataset) {
    return (
      <div className="bg-white md:border md:border-gray-200 rounded-3xl md:p-4 w-full mb-4 relative">
        {/* Your loading placeholder */}
        <Loading message="Loading data..." />
      </div>
    );
  }

  return (
    // <div className="bg-white md:border md:border-gray-200 rounded-3xl md:p-4 w-full mb-4 relative">
    <div className="bg-white w-full mb-6 relative">
      <div className="flex w-full items-center justify-between flex-row mb-7">
        <div className="flex items-center space-x-2 md:pb-0">
          <Icon name="Chart2" size={24} color="#328bf6" />
          <span className="text-sm md:text-base font-semibold text-text-primary">
            {chartName}
          </span>
        </div>

        <div className="md:ml-auto flex items-center">
          {showGranularity && (
            <div className="bg-gray-100 rounded-full p-1 flex items-center">
              {granularityOptions.map((option) => (
                <button
                  key={option}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                    granularity === option
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-600"
                  )}
                  onClick={() => {
                    setGranularity(option);
                    handlePeriodChange(option);
                    // refetch();
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl md:text-5xl font-medium md:font-medium text-gray-900">
          {selectedDataset?.overallRating}%
        </h2>
        <div className="text-sm flex items-center mt-2">
          <Icon name="ArrowUp2" size={20} color="#4caf50" />
          <span className="font-medium text-xs text-text-secondary">
            {valueChange}%
          </span>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <DottedGridChart
          type={chartType}
          labels={truncatedLabels}
          data={selectedDataset.data}
          granularity={granularity}
          autoSkipXAxisLabels={autoSkipXAxisLabels}
        />
      </div>
    </div>
  );
};
