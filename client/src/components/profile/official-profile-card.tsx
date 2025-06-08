import { Official } from "@shared/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { User, Flag, Briefcase, GraduationCap } from "lucide-react";
import CollapsibleSection from "./collapsibleSection";
import { CareerHistoryItem } from "./career-item";
import { off } from "node:process";
import { EducationHistoryItem } from "./education-item";
import { CareerTimelineProps } from "./career-timeline";
import { toTitleCase } from "@/utils/to-title-case";
import ProfileHeader from "./profile-card-header";
import { useBreakpoint } from "@/hooks/use-breakpoints";

interface OfficialProfileCardProps {
  official: Official;
  educationData: any[];
  careerData: any[];
  classname?: string;
}

export function OfficialProfileCard({
  official,
  educationData,
  careerData,
  classname,
}: OfficialProfileCardProps) {
  const isMobile = useBreakpoint();
  return (
    <div
      className={`flex flex-col items-center text-center mb-12 ${classname}`}
    >
      {/* Profile image */}
      {!isMobile && <ProfileHeader official={official} />}

      {/* Profile information in accordions */}

      <div className="w-full max-w-md md:mt-4">
        <CollapsibleSection icon="Box" title="Bio">
          <p className="text-text-secondary text-sm text-left">
            You can run the following SQL query in the Supabase SQL editor to
            alter the column definition You can run the following SQL query in
            the Supabase SQL editor to alter the column definiti...
          </p>
        </CollapsibleSection>
        <CollapsibleSection defaultOpen icon="Profile" title="Political party">
          <span className="flex flex-row gap-x-2 items-center">
            <div className="h-3 w-3 md:h-8 md:w-8 rounded-full items-center justify-center overflow-hidden bg-red-200">
              <img
                src={official.party.logo_url || ""}
                alt={`photo of ${official.name}`}
                width={20}
                height={20}
                className="object-cover h-full w-full"
              />
            </div>
            <p className="font-medium text-sm md:text-sm text-text-secondary">
              {official.party.acronym || "No party found"}
            </p>
          </span>
        </CollapsibleSection>
        <CollapsibleSection icon="Briefcase" title="Education">
          <EducationHistoryItem items={official.education} />
        </CollapsibleSection>
      </div>
    </div>
  );
}
/**
 * 
 * 
 * 
 * 
 *   <Accordion type="single" collapsible className="w-full">
          
          Bio accordion
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

          // Political party accordion 
          //==========================

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



                  // Party logo using specific party colors 
                  //=======================================
                  <div
                    className={`w-full h-full flex items-center justify-center text-white text-xs font-bold ${
                      official.party === "APC" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {official.party.substring(0, 3)}
                  </div>
                </div>
                <span className="text-sm">{official.party}</span>
              </div>
            </AccordionContent>
          </AccordionItem>

          // Career history accordion


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
                      <div className="text-gray-500">
                        {career.date ||
                          `${career.startYear || ""}-${
                            career.endYear || "Present"
                          }`}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No career history available.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>

          // Education accordion 
          //==========================================


          
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
                <p className="text-sm text-gray-500">
                  No education history available.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>


 */
