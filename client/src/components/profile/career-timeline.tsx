import { Briefcase } from "lucide-react";

interface CareerTimelineProps {
  careers: Array<{
    position: string;
    party: string;
    location: string;
    startYear: number;
    endYear: number;
  }>;
}

export function CareerTimeline({ careers }: CareerTimelineProps) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {careers.map((career, index) => {
          const isLast = index === careers.length - 1;
          
          return (
            <li key={`${career.position}-${career.startYear}`}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  ></span>
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center ring-8 ring-white">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-900">{career.position}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {career.party} • {career.location}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      {career.startYear} - {career.endYear}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
