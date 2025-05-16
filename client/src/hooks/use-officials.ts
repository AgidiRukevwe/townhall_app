import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Official } from '@shared/schema';
import { useState } from 'react';

export function useOfficials(filters?: { location?: string; category?: string }) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/officials', filters?.location, filters?.category, searchQuery],
    queryFn: async () => {
      const url = new URL('/api/officials', window.location.origin);
      
      if (filters?.location) {
        url.searchParams.append('location', filters.location);
      }
      
      if (filters?.category) {
        url.searchParams.append('category', filters.category);
      }
      
      if (searchQuery) {
        url.searchParams.append('search', searchQuery);
      }
      
      console.log("Fetching officials from:", url.toString());
      const res = await apiRequest('GET', url.toString());
      const data = await res.json();
      console.log("Officials data received:", data);
      return data as Official[];
    },
  });

  // Add some debugging to check if we have officials data
  console.log("Officials hook data:", data);
  console.log("Officials loading state:", isLoading);
  console.log("Officials error state:", error);

  return { 
    officials: data || [], 
    isLoading, 
    error, 
    searchQuery,
    setSearchQuery
  };
}

export function useOfficialDetails(id: string) {
  return useQuery({
    queryKey: [`/api/officials/${id}`],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/officials/${id}`);
      const data = await res.json();
      return data as Official;
    },
    enabled: !!id,
  });
}
