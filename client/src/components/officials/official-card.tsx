import { Link } from "wouter";
import { Official } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ArrowRight } from "iconsax-react";

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

  return (
    <div className="overflow-hidden bg-white cursor-pointer">
      {/* Image with 24px border radius and no black background */}
      <div className="relative h-32 md:h-48">
        {!showAvatar ? (
          <div className="w-full h-full rounded-xl md:rounded-[24px] overflow-hidden bg-[#e6f4ff] relative">
            <img
              src={official.imageUrl ?? ""}
              alt={formattedName}
              className="absolute w-[140%] h-[140%] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                objectFit: "cover",
                objectPosition: "center 20%",
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#e6f4ff] rounded-xl md:rounded-[24px]">
            <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center">
              <span className="text-[#1476FF] text-4xl font-bold">
                {initials}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Official details */}
      <div className="pt-3 md:py-3">
        <h3 className="font-semibold md:mb-1 text-sm">{formattedName}</h3>
        <p className="text-text-secondary font-regular md:font-medium text-xs">
          {/* {formattedPosition} */}
          {formattedLocation ? `${formattedLocation}` : ""}
        </p>

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
        )}
      </div>
    </div>
  );
}
