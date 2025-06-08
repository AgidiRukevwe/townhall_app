// hooks/use-search-handler.ts
import { useState } from "react";
import { useLocation } from "wouter";

export const useSearchHandler = () => {
  const [searchInput, setSearchInput] = useState("");
  const [, navigate] = useLocation();

  const handleSearch = (query: string) => {
    setSearchInput(query);
    if (query.trim()) {
      navigate(`/search?search=${encodeURIComponent(query)}`);
    } else {
      navigate(`/search`);
    }
  };

  return { searchInput, setSearchInput, handleSearch };
};
