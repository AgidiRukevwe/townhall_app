import { Link } from "wouter";
import { Official } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ArrowRight } from "iconsax-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface OfficialCardProps {
  official: Official;
  compact?: boolean;
}

export function OfficialCard({ official, compact = false }: OfficialCardProps) {
  const [showAvatar, setShowAvatar] = useState(!official.imageUrl);

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

  // Get initials for avatar
  const getInitials = (name: string) => {
    const nameParts = name.split(" ").filter(Boolean);
    if (nameParts.length === 0) return "?";
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const initials = getInitials(official.name);

  // Check if image exists and is valid
  useEffect(() => {
    if (official.imageUrl) {
      const img = new Image();
      img.onload = () => setShowAvatar(false);
      img.onerror = () => setShowAvatar(true);
      img.src = official.imageUrl;
    }
  }, [official.imageUrl]);

  const noRating =
    official.approvalRating === 0 || official.approvalRating === null;
  const lowRating = official.approvalRating < 20;
  const midRating =
    official.approvalRating >= 20 && official.approvalRating < 70;
  const highRating = official.approvalRating >= 70;

  const badgeClass = cn(
    "absolute translate-x-1/4 z-50 bottom-3 right-3 translate-y-1/4",
    highRating &&
      "bg-[#EBFAEF] border border-[#34C759] hover:bg-[#EBFAEF] hover:border-[#34C759] text-[#34C759]",
    midRating &&
      "bg-[#FFFBEA] border border-[#FFC107] hover:bg-[#FFFBEA] hover:border-[#FFC107] text-[#FFC107]",
    lowRating &&
      "bg-[#FFF0F0] border border-[#FF3B30] hover:bg-[#FFF0F0] hover:border-[#FF3B30] text-[#FF3B30]",
    noRating && "hidden"
  );

  return (
    <div className="group overflow-hidden bg-white cursor-pointer border-[1px] border-[#EAECF0] rounded-2xl md:rounded-[32px] p-6 hover:border-surface-brand hover:bg-surface-brand/10 transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-center">
        <div>
          {!showAvatar ? (
            <div className="w-32 h-32 rounded-full overflow-hidden bg-transparent relative">
              <Badge className={badgeClass}>{official.approvalRating}</Badge>
              <img
                src={official.imageUrl ?? ""}
                alt={formattedName}
                className="absolute w-full h-full rounded-full scale-150 bg-surface-brand/20 left-1/2 top-1/2 brightness-120  grayscale group-hover:grayscale-0 group-hover:border-white group-hover:border-[4px] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out "
                style={{
                  objectFit: "cover",
                  objectPosition: "center 20%",
                }}
              />
            </div>
          ) : (
            // <div className="w-full h-full flex items-center justify-center bg-[#e6f4ff] rounded-xl md:rounded-[24px]">
            <div className="w-32 h-32 rounded-xl md:rounded-[24px] overflow-hidden bg-transparent relative">
              <div className="w-32 h-32 flex rounded-full items-center justify-center overflow-hidden bg-surface-brand/5 group-hover:bg-white relative">
                <span className="flex  text-[#1476FF] text-4xl font-bold">
                  {initials}
                </span>
              </div>
            </div>
          )}
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
        {/* 
        {!compact && (
          <div className="mt-4">
            <Link href={`/profile/${official.id}`}>
              <Button
                variant="outline"
                className="w-full text-xs h-8 flex items-center justify-center gap-1"
              >
                View Profile
                <ArrowRight size="16" className="text-[#1476FF]" />
              </Button>
            </Link>
          </div>
        )} */}
      </div>
    </div>
  );
}
