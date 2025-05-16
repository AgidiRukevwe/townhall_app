import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
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
    
    console.log("OfficialCard - Successfully rendering official:", official.name);
    
    // Super simple card with minimal styling to ensure it displays
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-gray-100 h-48 flex items-center justify-center text-6xl font-bold text-gray-400">
          {official.name.charAt(0).toUpperCase()}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold">{official.name}</h3>
          <p className="text-gray-700">{official.position}</p>
          {official.party && <p className="text-gray-700">Party: {official.party}</p>}
          {official.approvalRating !== undefined && <p className="text-gray-700">Rating: {official.approvalRating}%</p>}
          
          <div className="mt-4">
            <Link href={`/profile/${official.id}`}>
              <div className="inline-block px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 cursor-pointer">
                View Profile
              </div>
            </Link>
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
