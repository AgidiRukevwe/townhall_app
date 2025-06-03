import { Official } from "@shared/schema";
import { Link, useLocation } from "wouter";
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

  const navigate = useLocation();

  // const updateScrollState = (category: string) => {
  //   const container = scrollRefs.current[category];
  //   if (!container) return;

  //   const maxScrollLeft = container.scrollWidth - container.clientWidth;
  //   setScrollState((prev) => ({
  //     ...prev,
  //     [category]: {
  //       atStart: container.scrollLeft <= 5,
  //       atEnd: container.scrollLeft >= maxScrollLeft - 5,
  //     },
  //   }));
  // };

  // useEffect(() => {
  //   Object.keys(scrollRefs.current).forEach((category) => {
  //     const container = scrollRefs.current[category];
  //     if (container) {
  //       const handleScroll = () => updateScrollState(category);
  //       container.addEventListener("scroll", handleScroll);
  //       updateScrollState(category); // initial state

  //       return () => container.removeEventListener("scroll", handleScroll);
  //     }
  //   });
  // }, [officials]);

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
      <div className="md:space-y-8 space-y-2 bg-red-100">
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
              // onClick={() => navigate(`/profile/${official.id}`)}
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
      <div className=" md:mb-10" key={category}>
        <div className="flex w-full justify-between items-center mb-2">
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
          className="flex overflow-x-auto gap-4 md:gap-12 pb-2 hide-scrollbar"
          ref={(el) => (scrollRefs.current[category] = el)}
        >
          {officials.slice(0, 10).map((official) => (
            <div
              key={official.id}
              className="md:h-full w-[170px] md:min-w-[200px] md:w-[100px] flex-shrink-0 cursor-pointer"
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
    <div className="space-y-2 md:space-y-8">
      {grouped["Popular"] && renderCategory("Popular", grouped["Popular"])}
      {Object.entries(grouped)
        .filter(([key]) => key !== "Popular")
        .map(([key, list]) => renderCategory(key, list))}
    </div>
  );
}

// import { Official } from "@shared/schema";
// import { Link } from "wouter";
// import { ArrowCircleRight, ArrowCircleLeft, ArrowRight2 } from "iconsax-react";
// import { useEffect, useRef, useState } from "react";
// import { OfficialCard } from "./official-card";
// import { Icon } from "../ui/icon";

// interface SimpleOfficialsListProps {
//   officials: Official[];
//   isLoading: boolean;
// }

// interface ScrollState {
//   atStart: boolean;
//   atEnd: boolean;
// }

// export function SimpleOfficialsList({
//   officials,
//   isLoading,
// }: SimpleOfficialsListProps) {
//   const searchQuery =
//     new URLSearchParams(window.location.search).get("search") || "";
//   const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});
//   const [scrollState, setScrollState] = useState<Record<string, ScrollState>>(
//     {}
//   );

//   const updateScrollState = (category: string) => {
//     const container = scrollRefs.current[category];
//     if (!container) return;

//     const maxScrollLeft = container.scrollWidth - container.clientWidth;
//     setScrollState((prev) => ({
//       ...prev,
//       [category]: {
//         atStart: container.scrollLeft <= 5,
//         atEnd: container.scrollLeft >= maxScrollLeft - 5,
//       },
//     }));
//   };

//   useEffect(() => {
//     Object.keys(scrollRefs.current).forEach((category) => {
//       const container = scrollRefs.current[category];
//       if (container) {
//         const handleScroll = () => updateScrollState(category);
//         container.addEventListener("scroll", handleScroll);
//         updateScrollState(category); // initial state

//         return () => container.removeEventListener("scroll", handleScroll);
//       }
//     });
//   }, [officials]);

//   const handleScroll = (category: string, direction: "left" | "right") => {
//     const container = scrollRefs.current[category];
//     if (!container) return;

//     const scrollAmount = 300;
//     const newScrollLeft =
//       direction === "left"
//         ? container.scrollLeft - scrollAmount
//         : container.scrollLeft + scrollAmount;

//     container.scrollTo({ left: newScrollLeft, behavior: "smooth" });

//     // Ensure scroll state is updated after scroll completes
//     setTimeout(() => updateScrollState(category), 300);
//   };

//   const getCategory = (position: string) => {
//     if (/Senator|Senate/i.test(position)) return "Senate";
//     if (/Rep|House of Representatives/i.test(position)) return "House of reps";
//     if (/Governor/i.test(position)) return "Popular";
//     return "Other officials";
//   };

//   const grouped = officials.reduce<Record<string, Official[]>>(
//     (acc, official) => {
//       const cat = getCategory(official.position || "");
//       acc[cat] = [...(acc[cat] || []), official];
//       return acc;
//     },
//     {}
//   );

//   if (isLoading) return <div>Loading officials...</div>;
//   if (!officials || officials.length === 0)
//     return <div>No officials found</div>;

//   if (searchQuery) {
//     return (
//       <div className="space-y-8">
//         <div className="mb-8 rounded-lg">
//           <div className="flex gap-x-2 md:gap-x-4 items-start">
//             <Link href="/">
//               <Icon name="ArrowCircleLeft2" color="#262626" />
//             </Link>
//             <div>
//               <span className="text-lg font-bold">
//                 Showing results for "{searchQuery}"
//               </span>
//               <p className="text-text-secondary text-sm mt-0.5">
//                 Found {officials.length} official
//                 {officials.length !== 1 ? "s" : ""} matching your search
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {officials.map((official) => (
//             <div
//               key={official.id}
//               className="cursor-pointer"
//               onClick={() => (window.location.href = `/profile/${official.id}`)}
//             >
//               <OfficialCard official={official} compact />
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   const renderCategory = (category: string, officials: Official[]) => {
//     const scrollInfo = scrollState[category] || {
//       atStart: true,
//       atEnd: false,
//     };

//     return (
//       <div className="mb-10" key={category}>
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-bold flex items-center">
//             {category}
//             <ArrowRight2
//               variant="Bold"
//               size="24"
//               className="ml-1 text-[#BFBFBF]"
//             />
//           </h2>
//           <div className="flex space-x-1">
//             <button
//               className={`w-7 h-7 rounded-full flex items-center justify-center group ${
//                 scrollInfo.atStart
//                   ? "cursor-not-allowed opacity-40"
//                   : "hover:bg-gray-200"
//               }`}
//               onClick={() => handleScroll(category, "left")}
//               disabled={scrollInfo.atStart}
//             >
//               <ArrowCircleLeft
//                 size="24"
//                 variant="Bold"
//                 className="text-text-primary"
//               />
//             </button>
//             <button
//               className={`w-7 h-7 rounded-full flex items-center justify-center group ${
//                 scrollInfo.atEnd
//                   ? "cursor-not-allowed opacity-40"
//                   : "hover:bg-gray-200"
//               }`}
//               onClick={() => handleScroll(category, "right")}
//               disabled={scrollInfo.atEnd}
//             >
//               <ArrowCircleRight
//                 size="24"
//                 variant="Bold"
//                 className="text-text-primary"
//               />
//             </button>
//           </div>
//         </div>
//         <div
//           className="flex overflow-x-auto gap-12 pb-2 hide-scrollbar"
//           ref={(el) => (scrollRefs.current[category] = el)}
//         >
//           {officials.slice(0, 10).map((official) => (
//             <div
//               key={official.id}
//               className="h-full min-w-[200px] w-[100px] flex-shrink-0 cursor-pointer"
//               onClick={() => (window.location.href = `/profile/${official.id}`)}
//             >
//               <OfficialCard official={official} compact />
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-8">
//       {grouped["Popular"] && renderCategory("Popular", grouped["Popular"])}
//       {Object.entries(grouped)
//         .filter(([key]) => key !== "Popular")
//         .map(([key, list]) => renderCategory(key, list))}
//     </div>
//   );
// }
