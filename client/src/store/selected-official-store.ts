// stores/useOfficialStore.ts
import { Official } from "@shared/schema";
import { create } from "zustand";

interface OfficialStore {
  official: Official | null;

  isLoading: boolean;
  error: any;
  setOfficial: (official: Official) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: any) => void;
  reset: () => void;
}

export const useSelectedOfficialStore = create<OfficialStore>((set) => ({
  official: null,
  isLoading: false,
  error: null,
  setOfficial: (official) => set({ official }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      official: null,
      isLoading: false,
      error: null,
    }),
}));
