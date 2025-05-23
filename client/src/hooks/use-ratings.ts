// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { apiRequest } from '@/lib/queryClient';
// import { RatingSummary, RatingPayload } from '@shared/schema';
// import { useAuth } from '@/hooks/use-auth.tsx';

// export function useRatings(officialId: string) {
//   return useQuery({
//     queryKey: [`/api/officials/${officialId}/ratings`],
//     queryFn: async () => {
//       const res = await apiRequest('GET', `/api/officials/${officialId}/ratings`);
//       const data = await res.json();
//       return data as RatingSummary;
//     },
//     enabled: !!officialId,
//   });
// }

// export function useSubmitRating() {
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (ratingData: RatingPayload) => {
//       if (!user) {
//         throw new Error('User must be authenticated to submit ratings');
//       }

//       const res = await apiRequest('POST', '/api/ratings', {
//         ...ratingData
//         // userId will be taken from the session on the server
//       });

//       return res.json();
//     },
//     onSuccess: (_, variables) => {
//       // Invalidate ratings query to refresh data
//       queryClient.invalidateQueries({
//         queryKey: [`/api/officials/${variables.officialId}/ratings`]
//       });

//       // Also invalidate the official details to update approval rating
//       queryClient.invalidateQueries({
//         queryKey: [`/api/officials/${variables.officialId}`]
//       });
//     },
//   });
// }

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { RatingSummary, RatingPayload } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth.tsx";

export function useRatings(officialId: string) {
  return useQuery({
    queryKey: [`/api/officials/${officialId}/ratings`],
    queryFn: async () => {
      const res = await apiRequest(
        "GET",
        `/api/officials/${officialId}/ratings`
      );
      const data = await res.json();
      return data as RatingSummary;
    },
    enabled: !!officialId,
  });
}

export function useSubmitRating() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ratingData: RatingPayload) => {
      if (!user) {
        throw new Error("User must be authenticated to submit ratings");
      }

      const res = await apiRequest("POST", "/api/ratings", {
        ...ratingData,
        // userId will be taken from the session on the server
      });

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

/**
 *
 * @param officialId
 * @param period
 * @param sector
 * @returns
 * @description This hook fetches performance data for a specific official.
 * It takes the official ID, period, and sector as parameters
 * and returns the performance data along with loading and error states.
 */
export function usePerformanceData(
  officialId: string,
  period?: string,
  sector?: string
) {
  return useQuery({
    queryKey: ["/api/officials", officialId, "performance", { period, sector }],
    queryFn: async () => {
      let url = `/api/officials/${officialId}/performance`;

      // Add query parameters if specified
      const params = new URLSearchParams();
      if (period) params.append("period", period);
      if (sector) params.append("sector", sector);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await apiRequest("GET", url);
      return await response.json();
    },
    enabled: !!officialId,
  });
}
