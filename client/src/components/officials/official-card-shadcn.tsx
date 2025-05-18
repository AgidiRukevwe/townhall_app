import { Link } from "wouter";
import { Official } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

interface OfficialCardProps {
  official: Official;
}

export function OfficialCard({ official }: OfficialCardProps) {
  // Function to capitalize first letter of each word
  const toTitleCase = (str: string) => {
    return str.toLowerCase().split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  const formattedName = toTitleCase(official.name);
  const formattedPosition = toTitleCase(official.position);
  const formattedLocation = official.location ? toTitleCase(official.location) : '';
  
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="rounded-[24px] overflow-hidden h-48 mb-4">
          <img 
            src={official.imageUrl || ""}
            alt={formattedName}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div>
          <h3 className="text-base font-bold">{formattedName}</h3>
          <p className="text-gray-700 text-sm">{formattedPosition}</p>
          {formattedLocation && <p className="text-gray-700 text-sm">{formattedLocation}</p>}
          
          {official.approvalRating !== undefined && (
            <div className="mt-1">
              <span className="text-sm font-medium text-green-500">
                {official.approvalRating}%
              </span>
            </div>
          )}
          
          <div className="mt-4">
            <Link href={`/profile/${official.id}`}>
              <div className="inline-block px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 cursor-pointer">
                View Profile
              </div>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}