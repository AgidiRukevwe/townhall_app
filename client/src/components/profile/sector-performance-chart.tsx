import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface SectorPerformanceChartProps {
  sectorRatings: Array<{
    name: string;
    rating: number;
    color?: string;
  }>;
  sectorAverage?: number;
  sectorMonthlyChange?: number;
}

export function SectorPerformanceChart({
  sectorRatings = [],
  sectorAverage = 0,
  sectorMonthlyChange = 0
}: SectorPerformanceChartProps) {
  const [currentMonth, setCurrentMonth] = useState<string>("January");

  // Mock data if needed
  const chartData = sectorRatings.length > 0 ? sectorRatings : [
    { name: "Health", rating: 76 },
    { name: "Infrastructure", rating: 78 },
    { name: "Agriculture", rating: 75 },
    { name: "Security", rating: 77 },
    { name: "Economy", rating: 75 },
    { name: "Corruption", rating: 76 },
    { name: "Transportation", rating: 77 }
  ];
  
  const nextMonth = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentIndex = months.indexOf(currentMonth);
    const nextIndex = (currentIndex + 1) % 12;
    setCurrentMonth(months[nextIndex]);
  };

  const prevMonth = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentIndex = months.indexOf(currentMonth);
    const prevIndex = currentIndex === 0 ? 11 : currentIndex - 1;
    setCurrentMonth(months[prevIndex]);
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 mb-8">
      <div className="flex items-center mb-5">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-500 rounded-md w-6 h-6 flex items-center justify-center text-white text-xs">
            B1
          </div>
          <span className="text-base font-semibold">Performance ratings by sectors</span>
        </div>
        
        <div className="ml-auto flex items-center space-x-1">
          <button 
            onClick={prevMonth}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium">{currentMonth}</span>
          <button 
            onClick={nextMonth}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <h2 className="text-6xl font-bold">
          {sectorAverage || 27}%
        </h2>
        <div className="text-green-500 text-sm flex items-center mt-2">
          <span className="inline-block mr-1">▲</span> 
          <span>{sectorMonthlyChange || 2.5}% in 1 month</span>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="2 2" vertical={true} horizontal={false} stroke="#f0f0f0" />
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
              domain={[0, 100]}
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            />
            <YAxis 
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
              width={100}
            />
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-black/90 text-white text-xs p-2 rounded">
                      <div className="font-medium">{`${payload[0].payload.name}`}</div>
                      <div>{`${payload[0].value}%`}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="rating" 
              radius={[0, 10, 10, 0]}
              barSize={16}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#007BFF" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}