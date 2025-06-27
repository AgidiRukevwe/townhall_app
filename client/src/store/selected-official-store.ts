// // stores/useOfficialStore.ts
// import { Official } from "@shared/schema";
// import { create } from "zustand";

// interface OfficialStore {
//   official: Official | null;

//   isLoading: boolean;
//   isRefetching: boolean;
//   isRefetchingRatingData: boolean;
//   error: any;
//   setOfficial: (official: Official) => void;

//   setLoading: (loading: boolean) => void;
//   setRefetchingOfficial: (refetching: boolean) => void;
//   setRefetchOfficial: (refetch: () => void | Promise<any>) => void;

//   refetchOfficial: () => void | Promise<any>;
//   refetchOfficialData?: () => void | Promise<any>;
//   setError: (error: any) => void;
//   reset: () => void;
// }

// export const useSelectedOfficialStore = create<OfficialStore>((set) => ({
//   official: null,
//   isLoading: false,
//   isRefetching: false,
//   isRefetchingRatingData: false,
//   error: null,
//   refetchOfficialData: ,
//   setOfficial: (official) => set({ official }),
//   setLoading: (isLoading) => set({ isLoading }),
//   setError: (error) => set({ error }),
//   setRefetchingOfficial: (isRefetching) => set({ isRefetching }),
//   setRefetchOfficial: (refetchOfficial) => set({ refetchOfficial }),

//   reset: () =>
//     set({
//       official: null,
//       isLoading: false,
//       error: null,
//     }),
// }));

// stores/useOfficialStore.ts
import { Official } from "@shared/schema";
import { create } from "zustand";

interface OfficialStore {
  official: Official | null;

  isLoading: boolean;
  isRefetching: boolean;
  isRefetchingRatingData: boolean;
  error: any;

  refetchOfficial?: () => void | Promise<any>;
  refetchRatingData?: () => void | Promise<any>;

  setOfficial: (official: Official) => void;
  setLoading: (loading: boolean) => void;

  setRefetchingOfficial: (refetching: boolean) => void;
  setRefetchOfficial: (refetch: () => void | Promise<any>) => void;

  setRefetchRatingData: (refetch: () => void | Promise<any>) => void;
  setRefetchingRatingData: (isRefetching: boolean) => void;

  setError: (error: any) => void;
  reset: () => void;
}

export const useSelectedOfficialStore = create<OfficialStore>((set) => ({
  official: null,
  isLoading: false,
  isRefetching: false,
  isRefetchingRatingData: false,
  error: null,

  refetchOfficial: undefined,
  refetchRatingData: undefined,

  setOfficial: (official) => set({ official }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  setRefetchingOfficial: (isRefetching) => set({ isRefetching }),
  setRefetchOfficial: (refetch) => set({ refetchOfficial: refetch }),

  setRefetchingRatingData: (isRefetchingRatingData) =>
    set({ isRefetchingRatingData }),
  setRefetchRatingData: (refetch) => set({ refetchRatingData: refetch }),

  reset: () =>
    set({
      official: null,
      isLoading: false,
      error: null,
      refetchOfficial: undefined,
      refetchRatingData: undefined,
    }),
}));
