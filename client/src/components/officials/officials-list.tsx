import { Official } from "@shared/schema";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { OfficialCard } from "./official-card";
import EmptyState from "../shared/empty-state";
import { Loading } from "../shared/loading";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useOfficialModalStore } from "@/store/official-modal-store";
import { useBreakpoint } from "@/hooks/util-hooks/use-breakpoints";
import { useSelectedOfficialStore } from "@/store/selected-official-store";
import { tabTriggerClass } from "../profile/views/profile-modal";
import { Icon } from "../ui/icon";

interface OfficialsListProps {
  officials: Official[];
  isLoading: boolean;
}

export function OfficialsList({ officials, isLoading }: OfficialsListProps) {
  const [, navigate] = useLocation();
  const { openModal: openProfileModal } = useOfficialModalStore();
  const { setOfficial, refetchOfficial } = useSelectedOfficialStore();
  const isMobile = useBreakpoint();

  const defaultLimit = 12;

  const getCategory = (position: string) => {
    if (/Senator|Senate/i.test(position)) return "Senate";
    if (/Rep|House of Representatives|House or reps/i.test(position))
      return "House of Reps";
    if (/Governor/i.test(position)) return "Governors";
    if (/President/i.test(position)) return "Popular";
    return "Others";
  };

  const sortedOfficials = [...officials].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const grouped = sortedOfficials.reduce<Record<string, Official[]>>(
    (acc, official) => {
      const cat = getCategory(official.chamber || official.position || "");
      acc[cat] = [...(acc[cat] || []), official];
      return acc;
    },
    {}
  );

  // const categories = Object.keys(grouped);
  const categories = Object.keys(grouped).sort((a, b) => {
    if (a === "Others") return 1;
    if (b === "Others") return -1;
    return a.localeCompare(b);
  });
  const allCategories = ["All", ...categories];

  const [selectedTab, setSelectedTab] = useState(allCategories[0]);

  const [limits, setLimits] = useState<Record<string, number>>(
    Object.fromEntries(allCategories.map((cat) => [cat, defaultLimit]))
  );

  const handleSelectOfficial = (official: Official) => {
    setOfficial(official);
    isMobile
      ? navigate(`/profile/${official.id}`)
      : openProfileModal(official.id);
    // : openProfileModal(official.id);
  };

  const handleLoadMore = (category: string) => {
    setLimits((prev) => ({
      ...prev,
      [category]: prev[category] + defaultLimit,
    }));
  };

  if (isLoading) return <Loading message="Loading officials..." />;
  if (!officials || officials.length === 0)
    return <EmptyState type="not-found" title="No officials found" />;

  return (
    <Tabs
      defaultValue={selectedTab}
      onValueChange={setSelectedTab}
      className="w-full space-y-0 md:space-y-4"
    >
      <div className="w-full overflow-x-auto overflow-y-hidden hide-scrollbar">
        <TabsList className="flex justify-start bg-white  w-full border-b-[1px] border-[#EAECF0] rounded-none gap-2 mb-6 md:mb-8  ">
          {allCategories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className={tabTriggerClass}
              // onClick={() => setSelectedTab(category)}
            >
              {category}
              {selectedTab === category && (
                <Icon
                  name="People"
                  size={16}
                  color="#007aff"
                  className="ml-1"
                />
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {allCategories.map((category) => {
        const limit = limits[category] || defaultLimit;
        const data =
          category === "All"
            ? officials.slice(0, limit)
            : grouped[category]?.slice(0, limit);
        return (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {data.map((official) => (
                <div
                  key={official.id}
                  className="cursor-pointer"
                  onClick={() => handleSelectOfficial(official)}
                >
                  <OfficialCard official={official} />
                </div>
              ))}
            </div>

            {/* {grouped[category]?.length > data.length && ( */}
            {(category === "All"
              ? sortedOfficials.length > data.length
              : grouped[category]?.length > data.length) && (
              <div className="mt-6 text-center">
                <Button
                  onClick={() => handleLoadMore(category)}
                  variant="default"
                  size="sm"
                >
                  Load more
                </Button>
              </div>
            )}
            {/* {grouped[category]?.length > 10 && (
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">
                  See all
                </Button>
              </div>
            )} */}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
