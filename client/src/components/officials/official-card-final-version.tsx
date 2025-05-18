import { Link } from "wouter";
import { Official } from "@shared/schema";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
    <Card className="overflow-hidden border border-gray-200">
      <CardContent className="p-4 flex flex-col space-y-4">
        {/* Large custom rounded avatar for the official */}
        <div className="relative h-48 w-full rounded-[24px] overflow-hidden">
          {official.imageUrl ? (
            <img 
              src={official.imageUrl} 
              alt={formattedName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-6xl font-bold text-gray-400">
                {official.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        {/* Official details */}
        <div className="space-y-2">
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
          
          <div className="pt-2">
            <Link href={`/profile/${official.id}`}>
              <Button 
                variant="outline" 
                className="w-full text-sm"
              >
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}