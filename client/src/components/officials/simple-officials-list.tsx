import { Official } from "@shared/schema";
import { Link } from "wouter";
import { ArrowCircleRight, ArrowCircleLeft, ArrowRight2 } from "iconsax-react";
import { useRef } from "react";
import { OfficialCard } from "./official-card";

interface SimpleOfficialsListProps {
  officials: Official[];
  isLoading: boolean;
}

export function SimpleOfficialsList({
  officials,
  isLoading,
}: SimpleOfficialsListProps) {
  // Create refs for scrollable containers
  const scrollContainerRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // Function to scroll the container horizontally
  const scrollContainer = (category: string, direction: 'left' | 'right') => {
    const container = scrollContainerRefs.current[category];
    if (container) {
      const scrollAmount = 300; // Adjust scroll amount as needed
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };
  
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
    } else if (
      position.includes("Rep") ||
      position.includes("House of Representatives")
    ) {
      return "House of reps";
    } else if (position.includes("Governor")) {
      return "Popular";
    } else {
      return "Other officials";
    }
  };

  const categorizedOfficials: { [key: string]: Official[] } = {};

  officials.forEach((official) => {
    const category = getCategory(official.position || "");
    if (!categorizedOfficials[category]) {
      categorizedOfficials[category] = [];
    }
    categorizedOfficials[category].push(official);
  });

  const renderCategorySection = (category: string, officials: Official[]) => {
    // Show more officials for horizontal scrolling
    const displayOfficials = officials.slice(0, 10);

    return (
      <div className="mb-10" key={category}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center">
            {category} <ArrowRight2 variant="Bold" size="24" className="ml-1 text-[#BFBFBF]" />
          </h2>
          <div className="flex space-x-1">
            <button 
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-200 group"
              onClick={() => scrollContainer(category, 'left')}
            >
              <ArrowCircleLeft size="24" variant="Bold" className="text-[#BFBFBF] group-hover:text-[#737373]" />
            </button>
            <button 
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-200 group"
              onClick={() => scrollContainer(category, 'right')}
            >
              <ArrowCircleRight size="24" variant="Bold" className="text-[#BFBFBF] group-hover:text-[#737373]" />
            </button>
          </div>
        </div>
        <div 
          className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar"
          ref={(el) => scrollContainerRefs.current[category] = el}
        >
          {displayOfficials.map((official) => (
            <div 
              key={official.id} 
              className="h-full min-w-[220px] w-[220px] flex-shrink-0 cursor-pointer"
              onClick={() => window.location.href = `/profile/${official.id}`}
            >
              <OfficialCard official={official} compact={true} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Show Popular category first if it exists */}
      {categorizedOfficials["Popular"] &&
        renderCategorySection("Popular", categorizedOfficials["Popular"])}

      {/* Then show other categories */}
      {Object.entries(categorizedOfficials)
        .filter(([category]) => category !== "Popular")
        .map(([category, officials]) =>
          renderCategorySection(category, officials),
        )}

      {/* Load more button */}
      {/* <div className="flex justify-center mt-6">
        <button className="px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          Load more officials
        </button>
      </div> */}
    </div>
  );
}
