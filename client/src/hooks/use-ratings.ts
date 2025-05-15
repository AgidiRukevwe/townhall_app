import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { RatingSummary, RatingPayload } from '@shared/schema';
import { useAuthStore } from '@/store/auth-store';

export function useRatings(officialId: string) {
  return useQuery({
    queryKey: [`/api/officials/${officialId}/ratings`],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/officials/${officialId}/ratings`);
      const data = await res.json();
      return data as RatingSummary;
    },
    enabled: !!officialId,
  });
}

export function useSubmitRating() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ratingData: RatingPayload) => {
      if (!user) {
        throw new Error('User must be authenticated to submit ratings');
      }
      
      const res = await apiRequest('POST', '/api/ratings', {
        ...ratingData,
        userId: user.id
      });
      
      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate ratings query to refresh data
      queryClient.invalidateQueries({ 
        queryKey: [`/api/officials/${variables.officialId}/ratings`] 
      });
      
      // Also invalidate the official details to update approval rating
      queryClient.invalidateQueries({ 
        queryKey: [`/api/officials/${variables.officialId}`] 
      });
    },
  });
}
