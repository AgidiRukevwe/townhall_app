import { Briefcase } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronUp } from "lucide-react";

interface CareerItem {
  position: string;
  period: string;
}

interface CareerHistoryProps {
  items: CareerItem[];
}

export function CareerHistoryItem({ items }: CareerHistoryProps) {
  return (
    <div className="relative pl-4 pr-4 pb-4">
      {/* Blue vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-500"></div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center pl-6 relative"
          >
            {/* Blue dot on the line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-gray-700">{item.position}</span>
            <span className="text-gray-500">{item.period}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
