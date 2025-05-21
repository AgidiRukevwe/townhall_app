import React, { useState } from "react";
import { cn } from "@/lib/utils";

import { Icon } from "@/components/ui/icon";
import DottedGridChart from "./dotted-chart";

type Granularity = "Today" | "This week" | "This month" | "This year";
type DataSetKey = "daily" | "weekly" | "monthly" | "yearly";

export interface ChartCardProps {
  chartKey?: string;
  chartName?: string;

  valueChange?: number;
  chartType?: "line" | "bar"; // extendable
  granularityOptions?: Granularity[];
  dataMap: Record<Granularity, { label: string[]; data: number[] }>;
}

export const ChartCard = ({
  chartName = "Chart Title",
  chartType = "line",

  valueChange = 0,
  granularityOptions = ["Today", "This week", "This month", "This year"],
  dataMap,
}: ChartCardProps) => {
  const [granularity, setGranularity] = useState<Granularity>(
    granularityOptions[0]
  );

  const selectedDataset = dataMap[granularity];
  const overallValue = selectedDataset.data.at(-1) ?? 0;

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-4 w-full mb-4 relative">
      <div className="flex w-full justify-start items-start md:items-center flex-col md:flex-row mb-5">
        <div className="flex items-center space-x-2 pb-4 md:pb-0">
          <Icon name="Chart2" size={24} color="#328bf6" />
          <span className="text-base font-medium text-text-primary">
            {chartName}
          </span>
        </div>

        <div className="md:ml-auto flex items-center">
          <div className="bg-gray-100 rounded-full p-1 flex items-center">
            {granularityOptions.map((option) => (
              <button
                key={option}
                className={cn(
                  "px-3 py-1 text-xs rounded-full transition-colors",
                  granularity === option
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-600"
                )}
                onClick={() => setGranularity(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-5xl font-medium text-gray-900">{overallValue}%</h2>
        <div className="text-sm flex items-center mt-2">
          <Icon name="ArrowUp2" size={20} color="#4caf50" />
          <span className="font-medium text-xs text-text-secondary">
            {valueChange}% change
          </span>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <DottedGridChart
          type={chartType}
          labels={selectedDataset.label}
          data={selectedDataset.data}
          granularity={granularity}
        />
      </div>
    </div>
  );
};
