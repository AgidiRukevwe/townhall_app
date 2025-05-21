import { Briefcase } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronUp } from "lucide-react";

export interface EducationItem {
  degree: string;
  period: string;
}

interface EducationHistoryProps {
  items: EducationItem[];
}

export function EducationHistoryItem({ items }: EducationHistoryProps) {
  return (
    <div className="relative pl-4 pr-4 pb-4">
      {/* Blue vertical line */}
      <div className="absolute left-[1.2rem] top-0 bottom-0 w-0.5 bg-gray-200"></div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center pl-6 relative"
          >
            {/* Blue dot on the line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-200"></div>
            <span className="text-text-primary font-medium">{item.degree}</span>
            <span className="text-text-secondary font-medium">
              {/* {item.period} */}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
