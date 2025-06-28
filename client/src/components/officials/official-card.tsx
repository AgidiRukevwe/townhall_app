import { Link } from "wouter";
import { Official } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ArrowRight } from "iconsax-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/get-initials";
import { OfficialAvatar } from "./official-avatar";
import { useBreakpoint } from "@/hooks/util-hooks/use-breakpoints";

interface OfficialCardProps {
  official: Official;
  compact?: boolean;
}

export function OfficialCard({ official, compact = false }: OfficialCardProps) {
  const [showAvatar, setShowAvatar] = useState(!official.imageUrl);
  const isMobile = useBreakpoint();

  // Function to capitalize first letter of each word
  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formattedName = toTitleCase(official.name);
  const formattedPosition = toTitleCase(official.position);
  const formattedLocation = official.location
    ? toTitleCase(official.location)
    : "";

  // Check if image exists and is valid
  useEffect(() => {
    if (official.imageUrl) {
      const img = new Image();
      img.onload = () => setShowAvatar(false);
      img.onerror = () => setShowAvatar(true);
      img.src = official.imageUrl;
    }
  }, [official.imageUrl]);

  return (
    <div className="group overflow-hidden bg-white cursor-pointer border-[1px] border-[#EAECF0] rounded-3xl md:rounded-[32px] p-6 hover:border-surface-brand hover:bg-surface-brand/10 transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-center">
        <div>
          <OfficialAvatar
            // showAvatar={true}
            official={{
              imageUrl: official.imageUrl,
              approvalRating: official.approvalRating,

              name: official.name,
            }}
          />
        </div>
      </div>

      {/* Official details */}
      <div className="pt-3 md:py-3">
        <h3 className="font-semibold md:mb-1 text-center text-sm truncate">
          {formattedName}
        </h3>
        <p className="text-text-secondary text-center font-regular text-xs truncate">
          {/* {formattedPosition} */}
          {formattedLocation ? `${formattedLocation}` : ""}
        </p>
      </div>
    </div>
  );
}
