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
  const isPositive = monthlyChange > 0;
  const changeText = Math.abs(monthlyChange).toFixed(1);

  // Color mapping for sector indicators
  const getColorClass = (color: string) => {
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
          <div className="text-5xl font-bold mr-4">{averageRating}%</div>
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
          {sectors.map((sector) => (
            <div key={sector.name}>
              <div className="flex justify-between mb-1">
                <div className="flex items-center">
                  <span
                    className={`h-2 w-2 rounded-full ${getColorClass(
                      sector.color
                    )} mr-2`}
                  ></span>
                  <span className="text-sm font-medium">{sector.name}</span>
                </div>
              </div>
              <Progress value={sector.rating} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
