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
  const { setOfficial } = useSelectedOfficialStore();
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

  const grouped = officials.reduce<Record<string, Official[]>>(
    (acc, official) => {
      const cat = getCategory(official.chamber || official.position || "");
      acc[cat] = [...(acc[cat] || []), official];
      return acc;
    },
    {}
  );

  const categories = Object.keys(grouped);
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
    <Tabs defaultValue={selectedTab} className="w-full space-y-4">
      <TabsList className="flex justify-start bg-white  w-full border-b-[1px] border-[#EAECF0] rounded-none gap-2 mb-8 ">
        {allCategories.map((category) => (
          <TabsTrigger
            key={category}
            value={category}
            className={tabTriggerClass}
            onClick={() => setSelectedTab(category)}
          >
            {category}
            {selectedTab === category && (
              <Icon name="People" size={16} color="#007aff" className="ml-1" />
            )}
          </TabsTrigger>
        ))}
      </TabsList>

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

            {grouped[category]?.length > data.length && (
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

// import { Official } from "@shared/schema";
// import { Link, useLocation } from "wouter";
// import { ArrowCircleRight, ArrowCircleLeft, ArrowRight2 } from "iconsax-react";
// import { useEffect, useRef, useState } from "react";
// import { OfficialCard } from "./official-card";
// import { Icon } from "../ui/icon";
// import { Button } from "../ui/button";
// import EmptyState from "../shared/empty-state";
// import { Loading } from "../shared/loading";
// import { useOfficialModalStore } from "@/store/official-modal-store";
// import { useBreakpoint } from "@/hooks/util-hooks/use-breakpoints";
// import { useSelectedOfficialStore } from "@/store/selected-official-store";

// interface OfficialsListProps {
//   officials: Official[];
//   isLoading: boolean;
// }

// interface ScrollState {
//   atStart: boolean;
//   atEnd: boolean;
// }

// export function OfficialsList({ officials, isLoading }: OfficialsListProps) {
//   const searchQuery =
//     new URLSearchParams(window.location.search).get("search") || "";
//   const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});
//   const [scrollState, setScrollState] = useState<Record<string, ScrollState>>(
//     {}
//   );
//   //trigger profile Modal when in desktp mode
//   const { openModal: openProfileModal } = useOfficialModalStore();

//   const isMobile = useBreakpoint();

//   const [, navigate] = useLocation();

//   const getCategory = (position: string) => {
//     if (/Senator|Senate/i.test(position)) return "Senate";
//     if (/Rep|House of Representatives|House or reps/i.test(position))
//       return "House of reps";
//     if (/Governor/i.test(position)) return "Governors";
//     if (/President/i.test(position)) return "Popular";
//     return "Other officials";
//   };

//   const grouped = officials.reduce<Record<string, Official[]>>(
//     (acc, official) => {
//       const cat = getCategory(official.chamber || official.position || "");
//       acc[cat] = [...(acc[cat] || []), official];
//       return acc;
//     },
//     {}
//   );

//   if (isLoading) return <Loading message="loading officials" />;
//   if (!officials || officials.length === 0)
//     return <EmptyState type="not-found" title="No officials found" />;

//   const renderCategory = (category: string, officials: Official[]) => {
//     const scrollInfo = scrollState[category] || {
//       atStart: true,
//       atEnd: false,
//     };

//     const { setOfficial } = useSelectedOfficialStore();

//     const handleSelectOfficial = (official: Official) => {
//       setOfficial(official);
//       console.log(official);

//       isMobile
//         ? navigate(`/profile/${official.id}`)
//         : openProfileModal(official.id);
//     };

//     return (
//       <div className=" md:mb-10" key={category}>
//         <div className="flex w-full justify-between items-center mb-2">
//           <h2 className="text-base md:text-lg font-bold flex items-center">
//             {category}
//           </h2>
//           <div className="flex space-x-1">
//             <Link href={`/officials/${category.toLowerCase()}`}>
//               <Button variant="outline" size="sm" className="p-3">
//                 See all{" "}
//                 <Icon name="ArrowCircleRight" size={16} color="#737373" />
//               </Button>
//             </Link>
//           </div>
//         </div>
//         <div
//           className="flex overflow-x-auto gap-x-6 hide-scrollbar"
//           ref={(el) => (scrollRefs.current[category] = el)}
//         >
//           {officials.slice(0, 10).map((official) => (
//             <div
//               key={official.id}
//               className="md:h-full w-[170px] md:min-w-[200px] md:w-[100px] flex-shrink-0 cursor-auto"
//               onClick={() => handleSelectOfficial(official)}
//               // onClick={
//               //   isMobile
//               //     ? () => navigate(`/profile/${official.id}`)
//               //     : () => openProfileModal(official.id)
//               // }
//             >
//               <OfficialCard official={official} compact />
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-2 md:space-y-8">
//       {grouped["Popular"] && renderCategory("Popular", grouped["Popular"])}
//       {Object.entries(grouped)
//         .filter(([key]) => key !== "Popular")
//         .map(([key, list]) => renderCategory(key, list))}
//     </div>
//   );
// }
