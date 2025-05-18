import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

interface ApprovalChartProps {
  approvalRating: number;
  monthlyChange: number;
  monthlyData: Array<{
    month: string;
    rating: number;
    isCurrentMonth: boolean;
  }>;
}

export function ApprovalChart({
  approvalRating,
  monthlyChange,
  monthlyData,
}: ApprovalChartProps) {
  // Safeguard against undefined or null values
  const rating = approvalRating || 0;
  const change = monthlyChange || 0;
  const data = monthlyData || [];
  
  const isPositive = change > 0;
  const changeText = Math.abs(change).toFixed(1);

  // Custom formatter for tooltip to handle type issues
  const customFormatter = (value: any) => {
    const numValue = Number(value);
    return [`${!isNaN(numValue) ? numValue.toFixed(1) : "0.0"}%`, "Approval"];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">
          Approval rating
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
              {isPositive ? "Gained" : "Lost"} {changeText}% in the last 1 month
            </span>
          </div>
        </div>

        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={customFormatter}
                labelFormatter={(label: any) => `${label}`}
              />
              <Bar
                dataKey="rating"
                fill="#1476FF"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
