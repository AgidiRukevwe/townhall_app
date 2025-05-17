import { CalendarClock } from "lucide-react";

interface Education {
  id: string;
  officialId: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
}

interface EducationTimelineProps {
  education: Education[];
}

export function EducationTimeline({ education }: EducationTimelineProps) {
  console.log("Education data received:", education);
  
  // Return placeholder if no education
  if (!education || education.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
        <p className="text-gray-400 text-center py-4">No education history available</p>
      </div>
    );
  }

  // Sort education by endYear (most recent first) if available
  const sortedEducation = [...education].sort((a, b) => {
    if (b.endYear === a.endYear || (!a.endYear && !b.endYear)) {
      return 0;
    }
    if (!a.endYear) return 1;
    if (!b.endYear) return -1;
    return b.endYear - a.endYear;
  });
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <ul className="space-y-4">
        {sortedEducation.map((edu) => (
          <li key={edu.id} className="relative pl-6">
            <div className="absolute left-0 top-1 h-4 w-4 flex items-center justify-center">
              <CalendarClock className="h-4 w-4 text-gray-400" />
            </div>
            
            <div>
              {/* Extract year from degree if present */}
              {(() => {
                // Parse the degree to separate actual degree from year
                const degreeMatch = edu.degree.match(/([A-Za-z\s]+)(\d{4})?/);
                const degreeName = degreeMatch ? degreeMatch[1].trim() : edu.degree;
                const degreeYear = degreeMatch && degreeMatch[2] ? parseInt(degreeMatch[2], 10) : null;
                
                return (
                  <>
                    {edu.institution ? (
                      <p className="font-medium text-gray-900">{edu.institution}</p>
                    ) : (
                      <p className="font-medium text-gray-900">
                        {degreeName === "SSCE" ? "Secondary School" : 
                         degreeName === "BL" ? "Nigerian Law School" :
                         degreeName.includes("LLB") ? "University Law School" :
                         "Institution not specified"}
                      </p>
                    )}
                    
                    <p className="text-sm text-gray-700 font-medium">
                      {degreeName}{edu.field ? `, ${edu.field}` : ''}
                    </p>
                    
                    {(degreeYear || edu.startYear || edu.endYear) ? (
                      <p className="text-xs text-gray-500 mt-1">
                        {degreeYear ? 
                          `Graduated ${degreeYear}` :
                          (edu.startYear && edu.endYear ? 
                            `${edu.startYear} - ${edu.endYear}` : 
                            (edu.endYear ? `Graduated ${edu.endYear}` : 
                             (edu.startYear ? `Started ${edu.startYear}` : '')))}
                      </p>
                    ) : null}
                  </>
                );
              })()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}