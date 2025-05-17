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
              {edu.institution ? (
                <p className="font-medium text-gray-900">{edu.institution}</p>
              ) : null}
              
              <p className="text-sm text-gray-700 font-medium">
                {edu.degree}{edu.field ? `, ${edu.field}` : ''}
              </p>
              
              {(edu.startYear || edu.endYear) ? (
                <p className="text-xs text-gray-500 mt-1">
                  {edu.startYear && edu.endYear 
                    ? `${edu.startYear} - ${edu.endYear}`
                    : (edu.endYear ? `Graduated ${edu.endYear}` : (edu.startYear ? `Started ${edu.startYear}` : ''))}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}