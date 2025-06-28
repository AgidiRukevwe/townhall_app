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
          "overflow-hidden bg-surface-brand/5 flex items-center justify-center group-hover:border-white group-hover:border-[4px] transform transition-all  duration-300 ease-in-out",
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
