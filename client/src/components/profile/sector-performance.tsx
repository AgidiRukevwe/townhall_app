import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SectorPerformanceProps {
  averageRating: number;
  monthlyChange: number;
  sectors: Array<{
    name: string;
    rating: number;
    color: string;
  }>;
}

export function SectorPerformance({
  averageRating,
  monthlyChange,
  sectors,
}: SectorPerformanceProps) {
  // Safeguard against undefined or null values
  const rating = averageRating || 0;
  const change = monthlyChange || 0;
  const sectorData = sectors || [];
  
  const isPositive = change > 0;
  const changeText = Math.abs(change).toFixed(1);

  // Color mapping for sector indicators
  const getColorClass = (color: string = '') => {
    // If it's already a hex code, return the style attribute instead
    if (color && color.startsWith('#')) {
      return color; // We'll use inline style instead of a class for hex colors
    }
    
    switch (color) {
      case "red":
        return "bg-red-500";
      case "blue":
        return "bg-blue-500";
      case "green":
        return "bg-green-500";
      case "yellow":
        return "bg-yellow-500";
      case "purple":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">
          Performance by sectors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline mb-6">
          <div className="text-5xl font-bold mr-4">{rating.toFixed(1)}%</div>
          <div
            className={`text-sm font-medium flex items-center ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            <span>
              {isPositive ? "Up" : "Down"} {changeText}% in the last 1 month
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {sectorData.length > 0 ? (
            sectorData.map((sector) => (
              <div key={sector.name || 'unnamed-sector'}>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center">
                    <span
                      className={`h-2 w-2 rounded-full mr-2 ${
                        sector.color && sector.color.startsWith('#') ? '' : getColorClass(sector.color)
                      }`}
                      style={sector.color && sector.color.startsWith('#') ? { backgroundColor: sector.color } : {}}
                    ></span>
                    <span className="text-sm font-medium">{sector.name || 'Unknown'}</span>
                  </div>
                </div>
                <Progress value={sector.rating || 0} className="h-2" />
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 text-center py-4">
              No sector data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
