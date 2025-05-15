import { create } from 'zustand';

interface RatingState {
  currentOfficialId: string | null;
  overallRating: number;
  sectorRatings: Record<string, number>;
  
  setCurrentOfficial: (officialId: string | null) => void;
  setOverallRating: (rating: number) => void;
  setSectorRating: (sectorId: string, rating: number) => void;
  resetRatings: () => void;
}

export const useRatingStore = create<RatingState>((set) => ({
  currentOfficialId: null,
  overallRating: 50,
  sectorRatings: {},
  
  setCurrentOfficial: (officialId) => set({ currentOfficialId: officialId }),
  
  setOverallRating: (rating) => set({ overallRating: rating }),
  
  setSectorRating: (sectorId, rating) => set((state) => ({ 
    sectorRatings: {
      ...state.sectorRatings,
      [sectorId]: rating
    }
  })),
  
  resetRatings: () => set({ 
    overallRating: 50, 
    sectorRatings: {},
    currentOfficialId: null
  })
}));
