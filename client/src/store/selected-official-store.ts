// // stores/useOfficialStore.ts
// import { Official } from "@shared/schema";
// import { create } from "zustand";

// interface OfficialStore {
//   official: Official | null;

//   isLoading: boolean;
//   isRefetching: boolean;
//   isRefetchingRatingData: boolean;
//   error: any;

//   refetchOfficial?: () => void | Promise<any>;
//   refetchRatingData?: () => void | Promise<any>;

//   setOfficial: (official: Official) => void;
//   setLoading: (loading: boolean) => void;

//   setRefetchingOfficial: (refetching: boolean) => void;
//   setRefetchOfficial: (refetch: () => void | Promise<any>) => void;

//   setRefetchRatingData: (refetch: () => void | Promise<any>) => void;
//   setRefetchingRatingData: (isRefetching: boolean) => void;

//   setError: (error: any) => void;
//   reset: () => void;
// }

// export const useSelectedOfficialStore = create<OfficialStore>((set) => ({
//   official: null,
//   isLoading: false,
//   isRefetching: false,
//   isRefetchingRatingData: false,
//   error: null,

//   refetchOfficial: undefined,
//   refetchRatingData: undefined,

//   setOfficial: (official) => set({ official }),
//   setLoading: (isLoading) => set({ isLoading }),
//   setError: (error) => set({ error }),

//   setRefetchingOfficial: (isRefetching) => set({ isRefetching }),
//   setRefetchOfficial: (refetch) => set({ refetchOfficial: refetch }),

//   setRefetchingRatingData: (isRefetchingRatingData) =>
//     set({ isRefetchingRatingData }),
//   setRefetchRatingData: (refetch) => set({ refetchRatingData: refetch }),

//   reset: () =>
//     set({
//       official: null,
//       isLoading: false,
//       error: null,
//       refetchOfficial: undefined,
//       refetchRatingData: undefined,
//     }),
// }));

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Official } from "@shared/schema";

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

export const useSelectedOfficialStore = create<OfficialStore>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "selected-official-store", // key in localStorage
      partialize: (state) => ({ official: state.official }), // only persist this
    }
  )
);
