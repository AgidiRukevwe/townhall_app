import React, { useEffect, useState } from "react";
import { ChartCard, ChartCardProps, Granularity } from "./chart-card";

interface SectorChartCardProps {
  sectorName: string;
  sectorData: Record<
    Granularity,
    | {
        data: number[];
        labels: string[];
      }
    | undefined
  >;
  isLoading: boolean;
}

export const SectorChartCard = ({
  sectorName,
  sectorData,
  isLoading,
}: SectorChartCardProps) => {
  const [granularity, setGranularity] = useState<Granularity>("1 Dy");

  const currentPeriod = sectorData?.[granularity];

  const safeData = currentPeriod?.data ?? [];
  const safeLabels = currentPeriod?.labels ?? [];

  //   useEffect(() => console.log(safeLabels), []);
  const dataMap: ChartCardProps["dataMap"] = {
    overallRating: safeData.length
      ? Math.round(
          safeData.reduce((sum, val) => sum + val, 0) / safeData.length
        )
      : 0,
    labels:
      safeLabels.length === safeData.length
        ? safeLabels
        : safeData.map((_, i) => `#${i + 1}`), // fallback if labels are missing or mismatched
    data: safeData,
  };

  //   useEffect(() => {
  //     console.log("Loaded sector data:", sectorData?.["1 Dy"]);
  //   }, [sectorData]);

  return (
    <ChartCard
      chartName={sectorName}
      dataMap={dataMap}
      chartType="line"
      valueChange={0}
      isLoading={isLoading}
      handlePeriodChange={setGranularity}
      showGranularity={true}
      autoSkipXAxisLabels={false}
    />
  );
};
