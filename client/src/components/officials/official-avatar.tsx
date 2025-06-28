// import React from "react";
// import { Badge } from "@/components/ui/badge";
// import { getInitials } from "@/utils/get-initials";
// import { cn } from "@/lib/utils";

// interface OfficialAvatarProps {
//   showAvatar?: boolean;
//   className?: string;
//   size?: "sm" | "md" | "lg";
//   official: {
//     imageUrl?: string | null;
//     approvalRating: number;
//     name: string;
//   };
// }

// // const sizeMap = {
// //   sm: "w-12 h-12 text-base", // 48px
// //   md: "w-20 h-20 text-lg", // 48px
// //   lg: "w-32 h-32 text-2xl", // 80px
// //   xl: "w-40 h-40 text-4xl", // 128px
// // };

// const sizeMap = {
//   sm: {
//     container: "w-12 h-12", // 48px
//     text: "text-base",
//   },
//   md: {
//     container: "w-20 h-20", // 80px
//     text: "text-2xl",
//   },
//   lg: {
//     container: "w-32 h-32", // 128px
//     text: "text-4xl",
//   },
//   xl: {
//     container: "w-40 h-40", // 128px
//     text: "text-4xl",
//   },
// };

// export const OfficialAvatar: React.FC<OfficialAvatarProps> = ({
//   showAvatar = true,
//   official,
//   size = "lg",
//   className,
// }) => {
//   const noRating = !official.approvalRating;

//   const lowRating = !noRating && official.approvalRating < 20;
//   const midRating =
//     !noRating && official.approvalRating >= 20 && official.approvalRating < 70;
//   const highRating = !noRating && official.approvalRating >= 70;

//   const badgeColors = {
//     high: "bg-[#EBFAEF] border border-[#34C759] text-[#34C759]",
//     mid: "bg-[#FFFBEA] border border-[#FFC107] text-[#FFC107]",
//     low: "bg-[#FFF0F0] border border-[#FF3B30] text-[#FF3B30]",
//     none: "bg-[#E0E0E0] border border-[#A0A0A0] text-[#A0A0A0]",
//   };

//   const badgeClass = cn(
//     "absolute translate-x-1/4 z-50 bottom-3 right-3 translate-y-1/4",
//     highRating && badgeColors.high,
//     midRating && badgeColors.mid,
//     lowRating && badgeColors.low,
//     noRating && badgeColors.none
//   );

//   // const avatarSizeClass = sizeMap[size];
//   const { container, text } = sizeMap[size];

//   return (
//     <div className="flex items-center justify-center">
//       {/* {showAvatar */}

//       {showAvatar ? (
//         <div
//           className={cn(
//             "rounded-full overflow-hidden bg-transparent relative",
//             container,
//             className
//           )}
//         >
//           <img
//             src={official.imageUrl ?? ""}
//             alt={getInitials(official.name)}
//             className={cn(
//               "absolute w-full h-full rounded-full scale-150 bg-surface-brand/20 left-1/2 top-1/2 brightness-120 grayscale group-hover:grayscale-0 group-hover:border-white group-hover:border-[4px] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out"
//             )}
//             style={{
//               objectFit: "cover",
//               objectPosition: "center 20%",
//             }}
//           />
//         </div>
//       ) : (
//         <div
//           className={cn(
//             "rounded-xl md:rounded-[24px] overflow-hidden bg-transparent relative",
//             container,
//             className
//           )}
//         >
//           <div
//             className={cn(
//               "flex rounded-full items-center justify-center overflow-hidden bg-surface-brand/5 group-hover:bg-white",
//               container
//             )}
//           >
//             <span className={cn("text-[#1476FF] font-bold leading-none", text)}>
//               {getInitials(official.name)}
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // import React from "react";
// // import { Badge } from "@/components/ui/badge"; // adjust path as needed
// // import { get } from "http";
// // import { getInitials } from "@/utils/get-initials";
// // import { cn } from "@/lib/utils";

// // interface OfficialAvatarProps {
// //   showAvatar: boolean;
// //   className?: string;
// //   official: {
// //     imageUrl?: string | null;
// //     approvalRating: number;
// //     name: string;
// //   };
// // }

// // export const OfficialAvatar: React.FC<OfficialAvatarProps> = ({
// //   showAvatar = true,
// //   official,
// //   className,
// // }) => {
// //   const noRating = !official.approvalRating;

// //   const lowRating = !noRating && official.approvalRating < 20;
// //   const midRating =
// //     !noRating && official.approvalRating >= 20 && official.approvalRating < 70;
// //   const highRating = !noRating && official.approvalRating >= 70;

// //   const badgeColors = {
// //     high: "bg-[#EBFAEF] border border-[#34C759] text-[#34C759]",
// //     mid: "bg-[#FFFBEA] border border-[#FFC107] text-[#FFC107]",
// //     low: "bg-[#FFF0F0] border border-[#FF3B30] text-[#FF3B30]",
// //     none: "bg-[#E0E0E0] border border-[#A0A0A0] text-[#A0A0A0]",
// //   };

// //   const badgeClass = cn(
// //     "absolute translate-x-1/4 z-50 bottom-3 right-3 translate-y-1/4",
// //     highRating && badgeColors.high,
// //     midRating && badgeColors.mid,
// //     lowRating && badgeColors.low,
// //     noRating && badgeColors.none
// //   );

// //   return (
// //     <div className="flex items-center justify-center">
// //       {!showAvatar ? (
// //         <div
// //           className={cn(
// //             "w-32 h-32 rounded-full overflow-hidden bg-transparent relative",
// //             className
// //           )}
// //         >
// //           {official.approvalRating !== null && (
// //             <Badge className={badgeClass}>{official.approvalRating}</Badge>
// //           )}
// //           <img
// //             src={official.imageUrl ?? ""}
// //             alt={official.name}
// //             className="absolute w-full h-full rounded-full scale-150 bg-surface-brand/20 left-1/2 top-1/2 brightness-120 grayscale group-hover:grayscale-0 group-hover:border-white group-hover:border-[4px] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out"
// //             style={{
// //               objectFit: "cover",
// //               objectPosition: "center 20%",
// //             }}
// //           />
// //         </div>
// //       ) : (
// //         // <div className="w-32 h-32 rounded-full overflow-hidden bg-transparent relative">
// //         //   {/* <Badge className={`${badgeClass}, z-50`}>
// //         //     {official.approvalRating}
// //         //   </Badge> */}

// //         //   <img
// //         //     src={official.imageUrl ?? ""}
// //         //     alt={getInitials(official.name)}
// //         //     className={`absolute w-full h-full rounded-full scale-150 bg-surface-brand/20 left-1/2 top-1/2 brightness-120  grayscale group-hover:grayscale-0 group-hover:border-white group-hover:border-[4px] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out ${className}`}
// //         //     style={{
// //         //       objectFit: "cover",
// //         //       objectPosition: "center 20%",
// //         //     }}
// //         //   />
// //         // </div>
// //         <div className="w-32 h-32 rounded-xl md:rounded-[24px] overflow-hidden bg-transparent relative">
// //           <div className="w-32 h-32 flex rounded-full items-center justify-center overflow-hidden bg-surface-brand/5 group-hover:bg-white relative">
// //             <span className="flex text-[#1476FF] text-4xl font-bold">
// //               {getInitials(official.name)}
// //             </span>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/get-initials";
import { Badge } from "@/components/ui/badge";

interface OfficialAvatarProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "circle" | "rounded" | "square";
  showRatingBadge?: boolean;
  official: {
    imageUrl?: string | null;
    approvalRating: number;
    name: string;
  };
}

const sizeMap = {
  xs: { container: "w-8 h-8", text: "text-base" },
  sm: { container: "w-12 h-12", text: "text-base" },
  md: { container: "w-20 h-20", text: "text-2xl" },
  lg: { container: "w-32 h-32", text: "text-4xl" },
  xl: { container: "w-40 h-40", text: "text-5xl" },
};

const ratingColorMap = {
  high: "bg-[#EBFAEF]  text-[#34C759]",
  mid: "bg-[#FFFBEA] text-[#FFC107]",
  low: "bg-[#FFF0F0]  text-[#FF3B30]",
  none: "bg-[#F1E1F9]  text-[#AF52DE]",
};

const getRatingClass = (rating: number | null | undefined) => {
  if (!rating || rating <= 0) return ratingColorMap.none;
  if (rating < 20) return ratingColorMap.low;
  if (rating < 70) return ratingColorMap.mid;
  return ratingColorMap.high;
};

export const OfficialAvatar: React.FC<OfficialAvatarProps> = ({
  official,
  size = "lg",
  variant = "circle",
  showRatingBadge = true,
  className,
}) => {
  const [imageError, setImageError] = useState(false);
  const { container, text } = sizeMap[size];
  const initials = getInitials(official.name);
  const showFallback = !official.imageUrl || imageError;

  const shapeClass =
    variant === "circle"
      ? "rounded-full"
      : variant === "rounded"
      ? "rounded-xl"
      : "rounded-none";

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={cn(
          "overflow-hidden bg-surface-brand/5 flex items-center justify-center group-hover:border-white group-hover:border-[4px] transform transition-all duration-300 ease-in-out",
          container,
          shapeClass,
          className
        )}
      >
        {showFallback ? (
          <span className={cn("text-[#1476FF] font-bold ", text)}>
            {initials}
          </span>
        ) : (
          <img
            src={official.imageUrl!}
            alt={initials}
            onError={() => setImageError(true)}
            className={cn("object-cover w-full h-full scale-150", shapeClass)}
          />
        )}
      </div>

      {showRatingBadge && official.approvalRating !== 0 && (
        <Badge
          className={cn(
            "absolute bottom-1 right-1 px-2 py-0.5 text-xs font-medium",
            getRatingClass(official.approvalRating)
          )}
        >
          <span className="text-xs">{official.approvalRating ?? "—"}</span>
        </Badge>
      )}
    </div>
  );
};
