import { Official } from "@shared/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { User, Flag, Briefcase, GraduationCap } from "lucide-react";

interface OfficialProfileCardProps {
  official: Official;
  educationData: any[];
  careerData: any[];
}

export function OfficialProfileCard({ official, educationData, careerData }: OfficialProfileCardProps) {
  return (
    <div className="flex flex-col items-center text-center mb-12">
      {/* Profile image */}
      {official.imageUrl ? (
        <div className="w-32 h-32 rounded-full overflow-hidden relative bg-[#e6f4ff] mb-3 border-4 border-white shadow-sm">
          <img 
            src={official.imageUrl ?? ""} 
            alt={official.name}
            className="absolute w-[150%] h-[150%] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        </div>
      ) : (
        <div className="w-32 h-32 rounded-full bg-[#e6f4ff] flex items-center justify-center mb-3 border-4 border-white shadow-sm">
          <span className="text-[#1476FF] text-2xl font-bold">
            {official.name.split(' ').map(part => part[0]).slice(0, 2).join('')}
          </span>
        </div>
      )}
      
      {/* Official name and position */}
      <h2 className="text-2xl font-bold text-gray-900 mb-1">{official.name}</h2>
      <p className="text-gray-500 mb-6">{official.position}, {official.location}</p>
      
      {/* Profile information in accordions */}
      <div className="w-full max-w-md">
        <Accordion type="single" collapsible className="w-full">
          {/* Bio accordion */}
          <AccordionItem value="bio" className="border-b border-gray-200">
            <AccordionTrigger className="py-4 flex items-center text-sm font-medium gap-2">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-400" />
                <span>Bio</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-left pb-4">
              <p className="text-sm text-gray-600">
                {official.bio || "No biography available for this official."}
              </p>
            </AccordionContent>
          </AccordionItem>
          
          {/* Political party accordion */}
          <AccordionItem value="party" className="border-b border-gray-200">
            <AccordionTrigger className="py-4 flex items-center text-sm font-medium gap-2">
              <div className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-gray-400" />
                <span>Political party</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-left pb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full mr-3 overflow-hidden">
                  {/* Party logo using specific party colors */}
                  <div className={`w-full h-full flex items-center justify-center text-white text-xs font-bold ${official.party === "APC" ? "bg-green-600" : "bg-red-600"}`}>
                    {official.party.substring(0, 3)}
                  </div>
                </div>
                <span className="text-sm">{official.party}</span>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Career history accordion */}
          <AccordionItem value="career" className="border-b border-gray-200">
            <AccordionTrigger className="py-4 flex items-center text-sm font-medium gap-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gray-400" />
                <span>Career history</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-left pb-4">
              {careerData.length > 0 ? (
                <div className="space-y-3">
                  {careerData.map((career, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div className="font-medium">{career.position}</div>
                      <div className="text-gray-500">{career.date || `${career.startYear || ''}-${career.endYear || 'Present'}`}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No career history available.</p>
              )}
            </AccordionContent>
          </AccordionItem>
          
          {/* Education accordion */}
          <AccordionItem value="education" className="border-b border-gray-200">
            <AccordionTrigger className="py-4 flex items-center text-sm font-medium gap-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-gray-400" />
                <span>Education</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-left pb-4">
              {educationData.length > 0 ? (
                <div className="space-y-3">
                  {educationData.map((edu, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div className="font-medium">{edu.institution}</div>
                      <div className="text-gray-500">{edu.degree}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No education history available.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}