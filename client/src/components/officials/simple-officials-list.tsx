import { Official } from "@shared/schema";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface SimpleOfficialsListProps {
  officials: Official[];
  isLoading: boolean;
}

export function SimpleOfficialsList({ officials, isLoading }: SimpleOfficialsListProps) {
  if (isLoading) {
    return <div>Loading officials...</div>;
  }

  if (!officials || officials.length === 0) {
    return <div>No officials found</div>;
  }

  // Group officials by their position category
  const getCategory = (position: string) => {
    if (position.includes("Senator") || position.includes("Senate")) {
      return "Senate";
    } else if (position.includes("Rep") || position.includes("House of Representatives")) {
      return "House of reps";
    } else if (position.includes("Governor")) {
      return "Popular";
    } else {
      return "Other officials";
    }
  };

  const categorizedOfficials: { [key: string]: Official[] } = {};
  
  officials.forEach(official => {
    const category = getCategory(official.position || "");
    if (!categorizedOfficials[category]) {
      categorizedOfficials[category] = [];
    }
    categorizedOfficials[category].push(official);
  });

  const renderOfficialCard = (official: Official) => (
    <Link href={`/profile/${official.id}`} key={official.id}>
      <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative h-48 overflow-hidden">
          {/* Green flag for Nigerian flag on some cards */}
          {Math.random() > 0.7 && (
            <div className="absolute top-0 left-0 w-6 h-full bg-green-600 z-10"></div>
          )}
          <img 
            src={official.imageUrl || "https://via.placeholder.com/300x400"} 
            alt={official.name} 
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm">{official.name}</h3>
          <p className="text-gray-500 text-xs">{official.position}, {official.location}</p>
          <div className="mt-2 flex items-center">
            <span className={`text-xs font-medium ${official.approvalTrend >= 0 ? "text-green-500" : "text-red-500"}`}>
              {official.approvalRating?.toFixed(1)}%
              {official.approvalTrend !== 0 && (
                <span className="ml-1">
                  {official.approvalTrend > 0 ? "▲" : "▼"}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  const renderCategorySection = (category: string, officials: Official[]) => {
    // Only show first 5 officials per category in the UI
    const displayOfficials = officials.slice(0, 5);
    
    return (
      <div className="mb-10" key={category}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-medium flex items-center">
            {category} <span className="ml-1">›</span>
          </h2>
          <div className="flex space-x-1">
            <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {displayOfficials.map(renderOfficialCard)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Show Popular category first if it exists */}
      {categorizedOfficials["Popular"] && renderCategorySection("Popular", categorizedOfficials["Popular"])}
      
      {/* Then show other categories */}
      {Object.entries(categorizedOfficials)
        .filter(([category]) => category !== "Popular")
        .map(([category, officials]) => renderCategorySection(category, officials))
      }
      
      {/* Load more button */}
      <div className="flex justify-center mt-6">
        <button className="px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          Load more officials
        </button>
      </div>
    </div>
  );
}