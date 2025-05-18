import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";

export function SearchBar() {
  const [searchValue, setSearchValue] = useState("");
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Navigate to home with search query params
      navigate(`/?search=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          className="block w-full pl-10 py-2 bg-gray-100 border-gray-300 rounded-full"
          placeholder="Search officials, locations..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
    </form>
  );
}
