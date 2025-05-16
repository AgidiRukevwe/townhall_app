import { ArrowRight, ArrowUp, ArrowDown, User } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Official } from "@shared/schema";

interface OfficialCardProps {
  official: Official;
}

export function OfficialCard({ official }: OfficialCardProps) {
  const approvalTrend = official.approvalTrend || 0;
  
  // Default image placeholder if no image URL is available
  const placeholderImage = "https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg";
  
  return (
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-md">
      <div className="relative">
        {official.imageUrl ? (
          <img 
            src={official.imageUrl} 
            alt={official.name} 
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <User className="h-16 w-16 text-gray-400" />
          </div>
        )}
        
        <div className="absolute top-2 left-2 bg-white rounded-full py-1 px-2 flex items-center shadow-sm">
          {approvalTrend > 0 ? (
            <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
          ) : approvalTrend < 0 ? (
            <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
          ) : null}
          <span className="text-sm font-medium">{official.approvalRating || 0}%</span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-1">{official.name}</h3>
        <p className="text-gray-600 text-sm mb-2">
          {official.position}
          {official.location && <span>, {official.location}</span>}
          {official.party && <span> • {official.party}</span>}
        </p>
        
        <div className="mt-2 flex justify-between items-center">
          <Link href={`/profile/${official.id}`} className="text-gray-500">
            <div className="bg-gray-100 p-2 rounded-full">
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
