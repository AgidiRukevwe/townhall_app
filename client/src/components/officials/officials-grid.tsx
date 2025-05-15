import { OfficialCard } from "./official-card";
import { Official } from "@shared/schema";
import { Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface OfficialsGridProps {
  officials: Official[];
  isLoading: boolean;
}

export function OfficialsGrid({ officials, isLoading }: OfficialsGridProps) {
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  
  // Filter officials based on location
  const filteredOfficials = locationFilter === "all" 
    ? officials 
    : officials.filter(official => official.location === locationFilter);
  
  // Sort officials based on sortBy value
  const sortedOfficials = [...filteredOfficials].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "rating-high":
        return b.approvalRating - a.approvalRating;
      case "rating-low":
        return a.approvalRating - b.approvalRating;
      default:
        return 0; // Default sort from API
    }
  });
  
  // Get unique locations for filtering
  const locations = ["all", ...new Set(officials.map(official => official.location))];
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <p>Loading officials...</p>
      </div>
    );
  }
  
  return (
    <div>
      {/* Filters and sorting */}
      <div className="flex justify-between items-center mb-6">
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by location" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {locations.map(location => (
              <SelectItem key={location} value={location}>
                {location === "all" ? "All locations" : location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <SortAsc className="h-5 w-5 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
              <DropdownMenuRadioItem value="default">Default</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="name">Name (A-Z)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="rating-high">Rating (High-Low)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="rating-low">Rating (Low-High)</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Officials grid */}
      {sortedOfficials.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sortedOfficials.map(official => (
            <OfficialCard key={official.id} official={official} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center py-12">
          <p>No officials found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
