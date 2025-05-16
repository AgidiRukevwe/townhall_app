import { ArrowRight, ArrowUp, ArrowDown, User } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Official } from "@shared/schema";

interface OfficialCardProps {
  official: Official;
}

export function OfficialCard({ official }: OfficialCardProps) {
  if (!official) {
    console.error("Official card received null or undefined official");
    return null;
  }
  
  console.log("OfficialCard - Rendering official:", official.name);
  
  const approvalTrend = official.approvalTrend || 0;
  
  // Fix for Wikipedia URLs that aren't direct image links
  const getValidImageUrl = (url: string | null) => {
    if (!url) return null;
    if (url.includes('wikipedia.org') && !url.endsWith('.jpg') && !url.endsWith('.png')) {
      // This is a fallback placeholder as Wikipedia URLs need special handling
      return "https://via.placeholder.com/400x600";
    }
    return url;
  };
  
  const validImageUrl = getValidImageUrl(official.imageUrl);
  
  return (
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-md border border-gray-200">
      <div className="relative">
        {validImageUrl ? (
          <img 
            src={validImageUrl} 
            alt={official.name} 
            className="w-full h-48 object-cover"
            onError={(e) => {
              // If image fails to load, replace with user icon
              console.log(`Image failed to load for ${official.name}`);
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.classList.add('bg-gray-100', 'flex', 'items-center', 'justify-center');
                parent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-16 w-16 text-gray-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
              }
            }}
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
