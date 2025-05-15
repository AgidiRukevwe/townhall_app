import { create } from 'zustand';
import { Official } from '@shared/schema';

interface OfficialsState {
  officials: Official[];
  isLoading: boolean;
  error: Error | null;
  lastFetched: Date | null;
  
  setOfficials: (officials: Official[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useOfficialsStore = create<OfficialsState>((set) => ({
  officials: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  
  setOfficials: (officials) => set({ 
    officials, 
    lastFetched: new Date(),
    error: null 
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false })
}));
