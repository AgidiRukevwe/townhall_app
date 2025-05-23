import React, { useState } from "react";
import { cn } from "@/lib/utils";

import { Icon } from "@/components/ui/icon";
import DottedGridChart from "./dotted-chart";
import { useFullRatingsData, usePerformance } from "@/hooks/use-performance";

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
}: ChartCardProps) => {
  const [granularity, setGranularity] = useState<Granularity>(
    granularityOptions[0]
  );

  // const selectedDataset = dataMap[granularity];
  const selectedDataset = dataMap;
  // const overallValue = selectedDataset.data.at(-1) ?? 0;

  if (isLoading || !selectedDataset) {
    return (
      <div className="bg-white md:border md:border-gray-200 rounded-3xl md:p-4 w-full mb-4 relative">
        {/* Your loading placeholder */}
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white md:border md:border-gray-200 rounded-3xl md:p-4 w-full mb-4 relative">
      <div className="flex w-full items-center justify-between flex-row mb-7">
        <div className="flex items-center space-x-2 md:pb-0">
          <Icon name="Chart2" size={24} color="#328bf6" />
          <span className="text-sm md:text-base font-medium text-text-primary">
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
        <h2 className="text-4xl md:text-5xl font-medium text-gray-900">
          {selectedDataset?.overallRating}%
        </h2>
        <div className="text-sm flex items-center mt-2">
          <Icon name="ArrowUp2" size={20} color="#4caf50" />
          <span className="font-medium text-xs text-text-secondary">
            {valueChange}% change
          </span>
        </div>
      </div>

      <div className="h-[400px] w-full">
        {/* <DottedGridChart
          type={chartType}
          labels={selectedDataset.timeLabels}
          data={selectedDataset.overallData}
          granularity={granularity}
        /> */}

        <DottedGridChart
          type={chartType}
          labels={selectedDataset.labels}
          data={selectedDataset.data}
          granularity={granularity}
        />
      </div>
    </div>
  );
};
