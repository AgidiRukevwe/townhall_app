import { OfficialCard } from "./official-card-fixed";
import { Official } from "@shared/schema";
import { Filter, SortAsc, Loader2 } from "lucide-react";
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
  
  console.log("OfficialsGrid Component - Officials received:", officials);
  console.log("OfficialsGrid Component - Officials count:", officials.length);
  
  // Filter officials based on location
  const filteredOfficials = locationFilter === "all" 
    ? officials 
    : officials.filter(official => 
        official.location && official.location.toLowerCase() === locationFilter.toLowerCase()
      );
  
  console.log("OfficialsGrid Component - Filtered officials:", filteredOfficials);
  
  // Sort officials based on sortBy value
  const sortedOfficials = [...filteredOfficials].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "rating-high":
        return (b.approvalRating || 0) - (a.approvalRating || 0);
      case "rating-low":
        return (a.approvalRating || 0) - (b.approvalRating || 0);
      default:
        return 0; // Default sort from API
    }
  });
  
  console.log("OfficialsGrid Component - Sorted officials:", sortedOfficials);
  
  // Get unique locations for filtering (filter out undefined/null values)
  const availableLocations = officials
    .map(official => official.location)
    .filter((location): location is string => !!location);
  
  // Create unique locations array manually to avoid Set iteration issues
  const uniqueLocations: string[] = [];
  availableLocations.forEach(location => {
    if (!uniqueLocations.includes(location)) {
      uniqueLocations.push(location);
    }
  });
  
  const locations = ["all", ...uniqueLocations];
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
        <div>
          <div className="mb-4">
            <p className="text-green-600 font-bold">Debug: Found {sortedOfficials.length} officials to display</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedOfficials.map((official, index) => (
              <div key={official.id || index}>
                <OfficialCard official={official} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center py-12">
          <p>No officials found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
