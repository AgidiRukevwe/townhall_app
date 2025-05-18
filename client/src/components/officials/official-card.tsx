import { Link } from "wouter";
import { Official } from "@shared/schema";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OfficialCardProps {
  official: Official;
  compact?: boolean;
}

export function OfficialCard({ official, compact = false }: OfficialCardProps) {
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
    <Card className="border border-gray-200 overflow-hidden">
      <CardContent className="p-0">
        {/* Image with rounded corners */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={official.imageUrl || ""} 
            alt={formattedName}
            className="w-full h-full object-cover rounded-t-lg" 
          />
        </div>
        
        {/* Official details */}
        <div className="p-3">
          <h3 className="font-medium text-sm">{formattedName}</h3>
          <p className="text-gray-500 text-xs">
            {formattedPosition}{formattedLocation ? `, ${formattedLocation}` : ''}
          </p>
          
          {official.approvalRating !== undefined && (
            <div className="mt-2 flex items-center">
              <span className={`text-xs font-medium ${official.approvalTrend >= 0 ? "text-green-500" : "text-red-500"}`}>
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
                <Button 
                  variant="outline" 
                  className="w-full text-xs h-8"
                >
                  View Profile
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}