import { Link } from "wouter";
import { Official } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface OfficialCardProps {
  official: Official;
  compact?: boolean;
}

export function OfficialCard({ official, compact = false }: OfficialCardProps) {
  const [imageError, setImageError] = useState(false);

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

  return (
    <div className="bg-white">
      {/* Image container with AspectRatio */}
      <div className="mb-3">
        <AspectRatio ratio={16/9} className="bg-[#e6f4ff] rounded-[24px] overflow-hidden">
          {!imageError && official.imageUrl ? (
            <img
              src={official.imageUrl}
              alt={formattedName}
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
                <span className="text-[#1476FF] text-3xl font-bold">
                  {initials}
                </span>
              </div>
            </div>
          )}
        </AspectRatio>
      </div>

      {/* Official details */}
      <div className="p-3">
        <h3 className="font-medium text-sm">{formattedName}</h3>
        <p className="text-gray-500 text-xs">
          {formattedPosition}
          {formattedLocation ? `, ${formattedLocation}` : ""}
        </p>

        {official.approvalRating !== undefined && (
          <div className="mt-2 flex items-center">
            <span
              className={`text-xs font-medium ${official.approvalTrend >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {official.approvalRating?.toFixed(1)}%
              {official.approvalTrend !== 0 && (
                <span className="ml-1">
                  {official.approvalTrend > 0 ? "▲" : "▼"}
                </span>
              )}
            </span>
          </div>
        )}

        {!compact && (
          <div className="mt-4">
            <Link href={`/profile/${official.id}`}>
              <Button variant="outline" className="w-full text-xs h-8">
                View Profile
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
