import { Official } from "@shared/schema";
import { Link } from "wouter";
import { ArrowCircleRight, ArrowCircleLeft, ArrowRight2 } from "iconsax-react";
import { useEffect, useRef, useState } from "react";
import { OfficialCard } from "./official-card";
import { Icon } from "../ui/icon";
import { Button } from "../ui/button";

interface SimpleOfficialsListProps {
  officials: Official[];
  isLoading: boolean;
}

interface ScrollState {
  atStart: boolean;
  atEnd: boolean;
}

export function SimpleOfficialsList({
  officials,
  isLoading,
}: SimpleOfficialsListProps) {
  const searchQuery =
    new URLSearchParams(window.location.search).get("search") || "";
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [scrollState, setScrollState] = useState<Record<string, ScrollState>>(
    {}
  );

  const updateScrollState = (category: string) => {
    const container = scrollRefs.current[category];
    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setScrollState((prev) => ({
      ...prev,
      [category]: {
        atStart: container.scrollLeft <= 5,
        atEnd: container.scrollLeft >= maxScrollLeft - 5,
      },
    }));
  };

  useEffect(() => {
    Object.keys(scrollRefs.current).forEach((category) => {
      const container = scrollRefs.current[category];
      if (container) {
        const handleScroll = () => updateScrollState(category);
        container.addEventListener("scroll", handleScroll);
        updateScrollState(category); // initial state

        return () => container.removeEventListener("scroll", handleScroll);
      }
    });
  }, [officials]);

  const getCategory = (position: string) => {
    if (/Senator|Senate/i.test(position)) return "Senate";
    if (/Rep|House of Representatives|House or reps/i.test(position))
      return "House of reps";
    if (/Governor/i.test(position)) return "Governors";
    if (/President/i.test(position)) return "Popular";
    return "Other officials";
  };

  const grouped = officials.reduce<Record<string, Official[]>>(
    (acc, official) => {
      const cat = getCategory(official.chamber || official.position || "");
      acc[cat] = [...(acc[cat] || []), official];
      return acc;
    },
    {}
  );

  if (isLoading) return <div>Loading officials...</div>;
  if (!officials || officials.length === 0)
    return <div>No officials found</div>;

  if (searchQuery) {
    return (
      <div className="space-y-8">
        <div className="mb-8 rounded-lg">
          <div className="flex gap-x-2 md:gap-x-4 items-start">
            <Link href="/">
              <Icon name="ArrowCircleLeft2" color="#262626" />
            </Link>
            <div>
              <span className="text-lg font-bold">
                Showing results for "{searchQuery}"
              </span>
              <p className="text-text-secondary text-sm mt-0.5">
                Found {officials.length} official
                {officials.length !== 1 ? "s" : ""} matching your search
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {officials.map((official) => (
            <div
              key={official.id}
              className="cursor-pointer"
              onClick={() => (window.location.href = `/profile/${official.id}`)}
            >
              <OfficialCard official={official} compact />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const renderCategory = (category: string, officials: Official[]) => {
    const scrollInfo = scrollState[category] || {
      atStart: true,
      atEnd: false,
    };

    return (
      <div className="mb-10" key={category}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center">{category}</h2>
          <div className="flex space-x-1">
            <Link href={`/officials/${category.toLowerCase()}`}>
              <Button variant="ghost" size="sm">
                See all <Icon name="ArrowRight2" size={16} color="#262626" />
              </Button>
            </Link>
          </div>
        </div>
        <div
          className="flex overflow-x-auto gap-12 pb-2 hide-scrollbar"
          ref={(el) => (scrollRefs.current[category] = el)}
        >
          {officials.slice(0, 10).map((official) => (
            <div
              key={official.id}
              className="h-full min-w-[200px] w-[100px] flex-shrink-0 cursor-pointer"
              onClick={() => (window.location.href = `/profile/${official.id}`)}
            >
              <OfficialCard official={official} compact />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {grouped["Popular"] && renderCategory("Popular", grouped["Popular"])}
      {Object.entries(grouped)
        .filter(([key]) => key !== "Popular")
        .map(([key, list]) => renderCategory(key, list))}
    </div>
  );
}
