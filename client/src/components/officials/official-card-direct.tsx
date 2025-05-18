import { Link } from "wouter";
import { Official } from "@shared/schema";

interface OfficialCardProps {
  official: Official;
}

export function OfficialCard({ official }: OfficialCardProps) {
  try {
    if (!official) {
      console.error("Official card received null or undefined official");
      return (
        <div className="border border-red-300 rounded-lg p-4">
          <p className="text-red-500">Error: Missing official data</p>
        </div>
      );
    }

    // Function to capitalize first letter of each word
    const toTitleCase = (str: string) => {
      return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    // Format the name in title case
    const formattedName = toTitleCase(official.name);
    // Format position in title case
    const formattedPosition = toTitleCase(official.position);
    // Format location in title case if it exists
    const formattedLocation = official.location
      ? toTitleCase(official.location)
      : "";
    // Format party in title case if it exists
    const formattedParty = official.party ? toTitleCase(official.party) : "";

    return (
      <div className="border bg-red-400 border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4">
          {/* Image container with 24px border radius */}
          <div className="h-48 overflow-hidden mb-4 rounded-[24px]">
            {official.imageUrl ? (
              <img
                src={official.imageUrl}
                alt={formattedName}
                className="w-full h-full object-cover rounded-[24px]"
              />
            ) : (
              <div className="bg-gray-100 h-full w-full flex items-center justify-center text-6xl font-bold text-gray-400 rounded-[24px]">
                {official.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Official information */}
          <div>
            <h3 className="text-base font-bold">{formattedName}</h3>
            <p className="text-gray-700 text-sm">{formattedPosition}</p>
            {formattedLocation && (
              <p className="text-gray-700 text-sm">{formattedLocation}</p>
            )}
            {formattedParty && (
              <p className="text-gray-700 text-sm">Party: {formattedParty}</p>
            )}

            {/* Approval rating */}
            {official.approvalRating !== undefined && (
              <div className="mt-2">
                <span
                  className={`text-sm font-medium ${official.approvalTrend >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {official.approvalRating}%
                  {official.approvalTrend !== 0 && (
                    <span className="ml-1">
                      {official.approvalTrend > 0 ? "▲" : "▼"}
                    </span>
                  )}
                </span>
              </div>
            )}

            {/* View profile button */}
            <div className="mt-4">
              <Link href={`/profile/${official.id}`}>
                <div className="inline-block px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 cursor-pointer">
                  View Profile
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering official card:", error);
    return (
      <div className="border border-red-300 rounded-lg p-4">
        <p className="text-red-500">Error rendering card</p>
      </div>
    );
  }
}
