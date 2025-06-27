import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { RatingSummary, RatingPayload } from "@shared/schema";
import { useAuth } from "./auth-hooks/use-auth-updated";
import { supabase } from "@/lib/supabase";
// import { useAuth } from "@/hooks/use-auth.tsx";

// Simple hook to get just the overall approval rating
export function useApprovalRating(officialId: string) {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: [`/api/officials/${officialId}/approval-ratings`],
    queryFn: async () => {
      const res = await apiRequest(
        "GET",
        `/api/officials/${officialId}/approval-ratings`
      );
      return await res.json();
    },
    enabled: !!officialId,
  });

  return {
    approvalRating: data?.overallApprovalRating || 0,
    isLoading,
    refetch,
    isRefetching,
    error,
  };
}

// Simple hook to get just sector ratings (overall scores)
export function useSectorRatings(officialId: string) {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: [`/api/officials/${officialId}/approval-ratings`],
    queryFn: async () => {
      const res = await apiRequest(
        "GET",
        `/api/officials/${officialId}/approval-ratings`
      );
      return await res.json();
    },
    enabled: !!officialId,
  });

  // Transform to simple sector array
  const sectors = data?.sectorRatings
    ? Object.entries(data.sectorRatings).map(([name, info]: [string, any]) => ({
        name,
        rating: info.overallRating,
        color: info.color,
      }))
    : [];

  // Calculate overall sector average
  const overallSectorRating =
    sectors.length > 0
      ? Math.round(
          sectors.reduce((sum, sector) => sum + sector.rating, 0) /
            sectors.length
        )
      : 0;

  return {
    sectors,
    overallSectorRating,
    isLoading,
    refetch,
    isRefetching,
    error,
  };
}

// Hook for getting time-based data for a specific period and sector
export function useTimeBasedRatings(
  officialId: string,
  period: string = "1 Wk",
  sector?: string
) {
  const { data, isLoading, refetch, error, isRefetching } = useQuery({
    queryKey: [`/api/officials/${officialId}/approval-ratings`],
    queryFn: async () => {
      const res = await apiRequest(
        "GET",
        `/api/officials/${officialId}/approval-ratings`
      );
      return await res.json();
    },
    enabled: !!officialId,
  });

  // Get the specific period data
  let timeData = null;
  if (data) {
    if (sector && data.sectorRatings[sector]) {
      timeData = data.sectorRatings[sector].ratingsByPeriod[period];
    } else {
      timeData = data.overallRatingsByPeriod[period];
    }
  }

  return {
    timeLabels: timeData?.timeLabels || [],
    data: timeData?.data || [],
    isLoading,
    refetch,
    isRefetching,
    error,
  };
}

export function useSubmitRating() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ratingData: RatingPayload) => {
      if (!user) {
        throw new Error("User must be authenticated to submit ratings");
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        throw new Error("Could not get Supabase session");
      }

      // const res = await apiRequest("POST", "/api/ratings", {
      //   ...ratingData,
      //   // userId will be taken from the session on the server
      // });
      const accessToken = session.access_token;

      const res = await apiRequest(
        "POST",
        "/api/ratings",
        { ...ratingData },
        {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
      );

      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate ratings query to refresh data
      queryClient.invalidateQueries({
        queryKey: [`/api/officials/${variables.officialId}/ratings`],
      });

      // Also invalidate the official details to update approval rating
      queryClient.invalidateQueries({
        queryKey: [`/api/officials/${variables.officialId}`],
      });
    },
  });
}
