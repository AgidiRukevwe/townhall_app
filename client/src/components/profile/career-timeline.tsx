import { Briefcase } from "lucide-react";

interface CareerTimelineProps {
  careers: Array<{
    id?: string;
    officialId?: string;
    position: string;
    party: string;
    location: string;
    startYear: number;
    endYear: number;
    createdAt?: Date;
  }>;
}

export function CareerTimeline({ careers }: CareerTimelineProps) {
  console.log("Career data received:", careers);
  
  // Return placeholder if no career history
  if (!careers || careers.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
        <p className="text-gray-400 text-center py-4">No career history available</p>
      </div>
    );
  }
  
  return (
    <div className="flow-root bg-white rounded-lg border border-gray-200 p-4">
      <ul className="-mb-8">
        {careers.map((career, index) => {
          const isLast = index === careers.length - 1;
          
          return (
            <li key={career.id || `${career.position}-${index}`}>
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
                      {career.position ? (
                        <p className="text-sm text-gray-900 font-medium">{career.position}</p>
                      ) : (
                        <p className="text-sm text-gray-900 font-medium">Member of Parliament</p>
                      )}
                      
                      {(career.party || career.location) ? (
                        <p className="mt-1 text-xs text-gray-500">
                          {career.party && career.location ? 
                            `${career.party} • ${career.location}` : 
                            (career.party || career.location)}
                        </p>
                      ) : null}
                    </div>
                    
                    {career.date !== undefined ? (
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        {career.date as string}
                      </div>
                    ) : (career.startYear || career.endYear) ? (
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        {career.startYear && career.endYear && career.endYear > 0 ? 
                          `${career.startYear} - ${career.endYear}` : 
                          (career.startYear && (!career.endYear || career.endYear === 0) ?
                            `${career.startYear} - Present` :
                            (career.startYear || career.endYear))}
                      </div>
                    ) : (
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        Current Position
                      </div>
                    )}
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
