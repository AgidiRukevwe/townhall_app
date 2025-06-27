import React from "react";
import { Badge } from "@/components/ui/badge"; // adjust path as needed
import { get } from "http";
import { getInitials } from "@/utils/get-initials";
import { cn } from "@/lib/utils";

interface OfficialAvatarProps {
  showAvatar: boolean;
  className?: string;
  official: {
    imageUrl?: string | null;
    approvalRating: number;
    name: string;
  };
}

export const OfficialAvatar: React.FC<OfficialAvatarProps> = ({
  showAvatar = true,
  official,
  className,
}) => {
  const noRating = !official.approvalRating;

  const lowRating = !noRating && official.approvalRating < 20;
  const midRating =
    !noRating && official.approvalRating >= 20 && official.approvalRating < 70;
  const highRating = !noRating && official.approvalRating >= 70;

  const badgeColors = {
    high: "bg-[#EBFAEF] border border-[#34C759] text-[#34C759]",
    mid: "bg-[#FFFBEA] border border-[#FFC107] text-[#FFC107]",
    low: "bg-[#FFF0F0] border border-[#FF3B30] text-[#FF3B30]",
    none: "bg-[#E0E0E0] border border-[#A0A0A0] text-[#A0A0A0]",
  };

  const badgeClass = cn(
    "absolute translate-x-1/4 z-50 bottom-3 right-3 translate-y-1/4",
    highRating && badgeColors.high,
    midRating && badgeColors.mid,
    lowRating && badgeColors.low,
    noRating && badgeColors.none
  );
  // const badgeClass = cn(
  //   "absolute translate-x-1/4 z-50 bottom-3 right-3 translate-y-1/4",
  //   highRating &&
  //     "bg-[#EBFAEF] border border-[#34C759] hover:bg-[#EBFAEF] hover:border-[#34C759] text-[#34C759]",
  //   midRating &&
  //     "bg-[#FFFBEA] border border-[#FFC107] hover:bg-[#FFFBEA] hover:border-[#FFC107] text-[#FFC107]",
  //   lowRating &&
  //     "bg-[#FFF0F0] border border-[#FF3B30] hover:bg-[#FFF0F0] hover:border-[#FF3B30] text-[#FF3B30]",
  //   noRating &&
  //     "bg-[#FFF0F0] border border-[#FF3B30] hover:bg-[#FFF0F0] hover:border-[#FF3B30] text-[#FF3B30]"
  //   // noRating && "hidden"
  // );

  return (
    <div className="flex items-center justify-center">
      {!showAvatar ? (
        <div className="w-32 h-32 rounded-full overflow-hidden bg-transparent relative">
          {/* <Badge className={`${badgeClass}, z-50`}>
            {official.approvalRating}
          </Badge> */}

          <img
            src={official.imageUrl ?? ""}
            alt={official.name}
            className={`absolute w-full h-full rounded-full scale-150 bg-surface-brand/20 left-1/2 top-1/2 brightness-120  grayscale group-hover:grayscale-0 group-hover:border-white group-hover:border-[4px] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out${className}`}
            style={{
              objectFit: "cover",
              objectPosition: "center 20%",
            }}
          />
        </div>
      ) : (
        <div className="w-32 h-32 rounded-xl md:rounded-[24px] overflow-hidden bg-transparent relative">
          <div className="w-32 h-32 flex rounded-full items-center justify-center overflow-hidden bg-surface-brand/5 group-hover:bg-white relative">
            <span className="flex text-[#1476FF] text-4xl font-bold">
              {getInitials(official.name)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// import React from "react";
// import { Badge } from "@/components/ui/badge"; // adjust path as needed
// import { get } from "http";
// import { getInitials } from "@/utils/get-initials";
// import { cn } from "@/lib/utils";

// interface OfficialAvatarProps {
//   showAvatar: boolean;
//   className?: string;
//   official: {
//     imageUrl?: string | null;
//     approvalRating: number;
//     name: string;
//   };
// }

// export const OfficialAvatar: React.FC<OfficialAvatarProps> = ({
//   showAvatar = true,
//   official,
//   className
// }) => {
//   const noRating =
//     official.approvalRating === 0 || official.approvalRating === null;
//   const lowRating = official.approvalRating < 20;
//   const midRating =
//     official.approvalRating >= 20 && official.approvalRating < 70;
//   const highRating = official.approvalRating >= 70;

//   const badgeClass = cn(
//     "absolute translate-x-1/4 z-50 bottom-3 right-3 translate-y-1/4",
//     highRating &&
//       "bg-[#EBFAEF] border border-[#34C759] hover:bg-[#EBFAEF] hover:border-[#34C759] text-[#34C759]",
//     midRating &&
//       "bg-[#FFFBEA] border border-[#FFC107] hover:bg-[#FFFBEA] hover:border-[#FFC107] text-[#FFC107]",
//     lowRating &&
//       "bg-[#FFF0F0] border border-[#FF3B30] hover:bg-[#FFF0F0] hover:border-[#FF3B30] text-[#FF3B30]",
//     noRating && "hidden"
//   );

//   return (
//     <div className="flex items-center justify-center">
//       {!showAvatar ? (
//         <div className="w-32 h-32 rounded-full overflow-hidden bg-transparent relative">
//           {official.approvalRating && (
//             <Badge className={badgeClass}>{official.approvalRating}</Badge>
//           )}
//           <img
//             src={official.imageUrl ?? ""}
//             alt={official.name}
//             className={`${className}`}
//             style={{
//               objectFit: "cover",
//               objectPosition: "center 20%",
//             }}
//           />
//         </div>
//       ) : (
//         <div className="w-32 h-32 rounded-xl md:rounded-[24px] overflow-hidden bg-transparent relative">
//           <div className="w-32 h-32 flex rounded-full items-center justify-center overflow-hidden bg-surface-brand/5 group-hover:bg-white relative">
//             <span className="flex text-[#1476FF] text-4xl font-bold">
//               {getInitials(official.name)}
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
