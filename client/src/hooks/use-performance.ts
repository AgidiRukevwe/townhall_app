import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import e from "express";

export interface PerformanceData {
  officialId: string;
  overallRating: number;
  timePeriod?: string;
  timeLabels?: string[];
  allSectors?: {
    [sectorName: string]: {
      sectorId: string;
      color: string;
      data: number[];
    };
  };
  overallData?: number[];
  sector?: string;
  sectorId?: string;
  color?: string;
  data?: number[];
  allPeriods?: {
    [period: string]: {
      sectorId: string;
      color: string;
      data: number[];
      timeLabels: string[];
    };
  };
}

export function usePerformance(
  officialId: string,
  options?: {
    period?: string;
    sector?: string;
  },
  queryOptions?: {
    enabled?: boolean;
  }
) {
  const { period, sector } = options || {};
  const { enabled = true } = queryOptions || {};

  // Build query parameters
  const params = new URLSearchParams();
  if (period) params.append("period", period);
  if (sector) params.append("sector", sector);
  const queryString = params.toString();

  return useQuery({
    queryKey: [`/api/officials/${officialId}/performance`, period, sector],
    queryFn: async () => {
      const url = `/api/officials/${officialId}/performance${
        queryString ? `?${queryString}` : ""
      }`;
      const res = await apiRequest("GET", url);
      const data = await res.json();
      return data as PerformanceData;
    },
    enabled: !!officialId && enabled,
  });
}

// Hook for getting all time periods data (from the ratings endpoint)
export function useFullRatingsData(
  officialId: string,
  options?: {
    period?: string;
    sector?: string;
  },
  queryOptions?: {
    enabled?: boolean;
  }
) {
  const { period, sector } = options || {};
  const { enabled = true } = queryOptions || {};

  return useQuery({
    queryKey: [`/api/officials/${officialId}/ratings`],
    queryFn: async () => {
      const res = await apiRequest(
        "GET",
        `/api/officials/${officialId}/ratings`
      );
      const data = await res.json();
      return data;
    },
    enabled: !!officialId && enabled,
  });
}
