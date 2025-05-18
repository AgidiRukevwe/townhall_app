import { ReactNode } from "react";
import { Official } from "@shared/schema";

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
      
      {/* Bio accordion */}
      <div className="w-full max-w-md">
        <div className="border-b border-gray-200 py-4 w-full">
          <details className="group">
            <summary className="cursor-pointer flex items-center text-sm font-medium gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Bio</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-gray-400">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </summary>
            <p className="mt-4 text-sm text-gray-600 text-left">
              {official.bio || "No biography available for this official."}
            </p>
          </details>
        </div>
        
        {/* Political party accordion */}
        <div className="border-b border-gray-200 py-4 w-full">
          <details className="group">
            <summary className="cursor-pointer flex items-center text-sm font-medium gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
              <span>Political party</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-gray-400">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </summary>
            <div className="mt-4 flex items-center text-left">
              <div className="w-8 h-8 rounded-full mr-3 overflow-hidden">
                {/* Party logo using specific party colors */}
                <div className={`w-full h-full flex items-center justify-center text-white text-xs font-bold ${official.party === "APC" ? "bg-green-600" : "bg-red-600"}`}>
                  {official.party.substring(0, 3)}
                </div>
              </div>
              <span className="text-sm">{official.party}</span>
            </div>
          </details>
        </div>
        
        {/* Career history accordion */}
        <div className="border-b border-gray-200 py-4 w-full">
          <details className="group">
            <summary className="cursor-pointer flex items-center text-sm font-medium gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <span>Career history</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-gray-400">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </summary>
            <div className="mt-4 text-left">
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
            </div>
          </details>
        </div>
        
        {/* Education accordion */}
        <div className="border-b border-gray-200 py-4 w-full">
          <details className="group">
            <summary className="cursor-pointer flex items-center text-sm font-medium gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
              <span>Education</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-gray-400">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </summary>
            <div className="mt-4 text-left">
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
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}