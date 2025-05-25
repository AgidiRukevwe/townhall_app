// import { useQuery } from "@tanstack/react-query";
// import { apiRequest } from "@/lib/queryClient";
// import { Official } from "@shared/schema";
// import { useState, useEffect } from "react";

// import { useLocation } from "react-router-dom";

// // export function useOfficials(filters?: {
// //   location?: string;
// //   category?: string;
// //   search?: string;
// // }) {
// //   const location = useLocation(); // ✅ Use this instead of window.location
// //   const urlParams = new URLSearchParams(location.search);
// //   const urlSearchQuery = urlParams.get("search") || "";

// //   const [searchQuery, setSearchQuery] = useState(
// //     filters?.search || urlSearchQuery || ""
// //   );

// //   useEffect(() => {
// //     const newUrlParams = new URLSearchParams(location.search);
// //     const newUrlSearchQuery = newUrlParams.get("search") || "";

// //     setSearchQuery(newUrlSearchQuery);
// //   }, [location.search]); // ✅ Triggers on each query param change

// //   const { data, isLoading, error } = useQuery({
// //     queryKey: [
// //       "/api/officials",
// //       filters?.location,
// //       filters?.category,
// //       searchQuery,
// //     ],
// //     queryFn: async () => {
// //       const url = new URL("/api/officials", window.location.origin);

// //       if (filters?.location)
// //         url.searchParams.append("location", filters.location);
// //       if (filters?.category)
// //         url.searchParams.append("category", filters.category);
// //       if (searchQuery) url.searchParams.append("search", searchQuery);

// //       const res = await apiRequest("GET", url.toString());
// //       const data = await res.json();
// //       return data as Official[];
// //     },
// //   });

// //   return {
// //     officials: data || [],
// //     isLoading,
// //     error,
// //     searchQuery,
// //     setSearchQuery,
// //   };
// // }

// export function useOfficials(filters?: {
//   location?: string;
//   category?: string;
//   search?: string;
// }) {
//   // Get search query from URL parameters or from filters
//   const urlParams = new URLSearchParams(window.location.search);
//   const urlSearchQuery = urlParams.get("search") || "";

//   const [searchQuery, setSearchQuery] = useState(
//     filters?.search || urlSearchQuery || ""
//   );

//   // Update search query when URL changes
//   // useEffect(() => {
//   //   const newUrlParams = new URLSearchParams(window.location.search);
//   //   const newUrlSearchQuery = newUrlParams.get("search") || "";

//   //   if (newUrlSearchQuery !== searchQuery) {
//   //     setSearchQuery(newUrlSearchQuery);
//   //   }
//   // }, [window.location.search]);

//   useEffect(() => {
//     const handlePopState = () => {
//       const newUrlParams = new URLSearchParams(window.location.search);
//       const newUrlSearchQuery = newUrlParams.get("search") || "";
//       setSearchQuery(newUrlSearchQuery);
//     };

//     window.addEventListener("popstate", handlePopState);

//     return () => {
//       window.removeEventListener("popstate", handlePopState);
//     };
//   }, []);

//   const { data, isLoading, error } = useQuery({
//     queryKey: [
//       "/api/officials",
//       filters?.location,
//       filters?.category,
//       searchQuery,
//     ],
//     queryFn: async () => {
//       const url = new URL("/api/officials", window.location.origin);

//       if (filters?.location) {
//         url.searchParams.append("location", filters.location);
//       }

//       if (filters?.category) {
//         url.searchParams.append("category", filters.category);
//       }

//       if (searchQuery) {
//         url.searchParams.append("search", searchQuery);
//       }

//       console.log("Fetching officials from:", url.toString());
//       const res = await apiRequest("GET", url.toString());
//       const data = await res.json();
//       console.log("Officials data received:", data);
//       return data as Official[];
//     },
//   });

//   return {
//     officials: data || [],
//     isLoading,
//     error,
//     searchQuery,
//     setSearchQuery,
//   };
// }

// export function useOfficialDetails(id: string) {
//   return useQuery({
//     queryKey: [`/api/officials/${id}`],
//     queryFn: async () => {
//       const res = await apiRequest("GET", `/api/officials/${id}`);
//       const data = await res.json();
//       return data as Official;
//     },
//     enabled: !!id,
//   });
// }

import { apiRequest } from "@/lib/queryClient";
import { Official } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

export function useOfficials(filters?: {
  location?: string;
  category?: string;
  search?: string;
}) {
  const [location] = useLocation(); // <-- Add this line

  // Parse URL search params from location (reactive)
  const urlParams = new URLSearchParams(location.split("?")[1] || "");
  const urlSearchQuery = urlParams.get("search") || "";

  // Use filters.search if provided, else fallback to URL param
  const searchQuery = filters?.search ?? urlSearchQuery;

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: [
      "/api/officials",
      filters?.location,
      filters?.category,
      searchQuery, // <-- include searchQuery here so React Query refetches on change
    ],
    queryFn: async () => {
      const url = new URL("/api/officials", window.location.origin);

      if (filters?.location)
        url.searchParams.append("location", filters.location);
      if (filters?.category)
        url.searchParams.append("category", filters.category);
      if (searchQuery) url.searchParams.append("search", searchQuery);

      const res = await apiRequest("GET", url.toString());
      return (await res.json()) as Official[];
    },
  });

  return {
    officials: data || [],
    isLoading,
    error,
    searchQuery,
    refetch,
    isRefetching,
  };
}

export function useOfficialDetails(id: string) {
  return useQuery({
    queryKey: [`/api/officials/${id}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/officials/${id}`);
      const data = await res.json();
      return data as Official;
    },
    enabled: !!id,
  });
}
