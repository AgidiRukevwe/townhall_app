import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

interface ImprovedApprovalChartProps {
  monthlyData: Array<{
    month: string;
    rating: number;
    isCurrentMonth?: boolean;
  }>;
  overallRating: number;
  monthlyChange: number;
}

export function ImprovedApprovalChart({
  monthlyData = [],
  overallRating = 0,
  monthlyChange = 0
}: ImprovedApprovalChartProps) {
  const [timeRange, setTimeRange] = useState<"1 Dy" | "1 Wk" | "1 Mn">("1 Mn");

  // If we don't have data, use mock data that matches the design
  const chartData = monthlyData.length > 0 ? monthlyData : [
    { month: "JAN", rating: 20 },
    { month: "FEB", rating: 25 },
    { month: "MAR", rating: 10 },
    { month: "APR", rating: 5 },
    { month: "MAY", rating: 20 },
    { month: "JUN", rating: 35 },
    { month: "JUL", rating: 50 },
    { month: "AUG", rating: 70 },
    { month: "SEP", rating: 75 },
    { month: "OCT", rating: 68 },
    { month: "NOV", rating: 60 },
    { month: "DEC", rating: 55 }
  ];

  // Format data for chart display, ensuring month names are capitalized and abbreviated
  const formattedChartData = chartData.map(item => ({
    ...item,
    month: typeof item.month === 'string' ? item.month.substring(0, 3).toUpperCase() : item.month
  }));

  // Find the highlighted month (July in the design)
  const highlightMonth = "JUL";
  const highlightValue = formattedChartData.find(d => d.month === highlightMonth)?.rating || 75;
  
  return (
    <div className="bg-[#111] text-white rounded-xl p-6 w-full">
      <div className="flex items-center mb-5">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-500 rounded-md w-6 h-6 flex items-center justify-center text-white text-xs">
            A
          </div>
          <span className="text-base font-medium">Approval rating</span>
        </div>
        
        <div className="ml-auto flex items-center">
          <div className="bg-gray-800 rounded-full p-1 flex items-center">
            <button 
              className={cn(
                "px-3 py-1 text-xs rounded-full transition-colors", 
                timeRange === "1 Dy" ? "bg-white text-black" : "text-white"
              )}
              onClick={() => setTimeRange("1 Dy")}
            >
              1 Dy
            </button>
            <button 
              className={cn(
                "px-3 py-1 text-xs rounded-full transition-colors", 
                timeRange === "1 Wk" ? "bg-white text-black" : "text-white"
              )}
              onClick={() => setTimeRange("1 Wk")}
            >
              1 Wk
            </button>
            <button 
              className={cn(
                "px-3 py-1 text-xs rounded-full transition-colors", 
                timeRange === "1 Mn" ? "bg-white text-black" : "text-white"
              )}
              onClick={() => setTimeRange("1 Mn")}
            >
              1 Mn
            </button>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-6xl font-bold">
          {overallRating || 27}%
        </h2>
        <div className="text-green-500 text-sm flex items-center mt-2">
          <span className="inline-block mr-1">▲</span> 
          <span>{monthlyChange || 2.5}% in 1 month</span>
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedChartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007BFF" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#007BFF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              horizontal={true} 
              stroke="#222" 
            />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
              domain={[0, 100]}
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            />
            <Tooltip 
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const date = data.month;
                  const value = data.rating;
                  
                  if (date === highlightMonth) {
                    return null; // Don't show tooltip for highlighted point
                  }
                  
                  return (
                    <div className="bg-black text-white text-xs p-2 rounded shadow-lg">
                      <p>{date}</p>
                      <p className="font-bold">{value}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine 
              x={highlightMonth}
              stroke="#333" 
              strokeDasharray="3 3"
              label={{
                position: "insideBottomRight",
                value: `${highlightValue}%`,
                fill: "#fff",
                fontSize: 11
              }}
              ifOverflow="extendDomain"
            />
            <Area 
              type="monotone" 
              dataKey="rating" 
              stroke="#007BFF" 
              strokeWidth={2}
              fill="url(#colorRating)" 
              activeDot={{
                r: 6,
                fill: "#007BFF",
                stroke: "#fff",
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Custom annotation for July data point */}
      <div 
        className="absolute pointer-events-none bg-black rounded-full px-3 py-1 text-xs text-white"
        style={{ 
          left: '50%', 
          transform: 'translateX(-50%)',
          bottom: '35%' 
        }}
      >
        <div className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
          <span>July 12 2025: 75%</span>
        </div>
      </div>
    </div>
  );
}