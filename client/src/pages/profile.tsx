import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApprovalChart } from "@/components/profile/approval-chart";
import { SectorPerformance } from "@/components/profile/sector-performance";
import { ElectionTimeline } from "@/components/profile/election-timeline";
import { CareerTimeline } from "@/components/profile/career-timeline";
import { EducationTimeline } from "@/components/profile/education-timeline";
import { useOfficialDetails } from "@/hooks/use-officials";
import { useRatings } from "@/hooks/use-ratings";
import { Loading } from "@/components/shared/loading";
import { RatingModal } from "@/components/rating/rating-modal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Flag, MapPin, User } from "lucide-react";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { data: official, isLoading, error } = useOfficialDetails(id);
  const { data: ratingSummary, isLoading: isLoadingRatings } = useRatings(id);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const { toast } = useToast();
  
  // Debug official data
  console.log("Profile page - official data:", official);
  console.log("Profile page - education data:", official?.education);
  console.log("Profile page - career data:", official?.careerHistory);
  
  if (isLoading) {
    return <Loading message="Loading official profile..." />;
  }
  
  if (error || !official) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Home
        </Link>
        
        <div className="flex justify-center py-12">
          <p className="text-red-500">Error loading official: {error?.toString() || "Official not found"}</p>
        </div>
      </div>
    );
  }
  
  const handleCreatePetition = () => {
    toast({
      title: "Coming soon",
      description: "This feature is not yet available.",
    });
  };
  
  return (
    <main className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Home
        </Link>
        
        {/* Official info */}
        <div className="flex flex-col md:flex-row items-start mb-8">
          <div className="flex-shrink-0 mb-4 md:mb-0 mr-6">
            {official.imageUrl ? (
              <img 
                src={official.imageUrl as string} 
                alt={official.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
                <User className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{official.name}</h2>
            <p className="text-gray-600 mb-4">{official.position}</p>
            
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
              <div className="flex items-center mr-4 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{official.location}</span>
              </div>
              
              <div className="flex items-center mr-4 mb-2">
                <Flag className="h-4 w-4 mr-1" />
                <span>{official.party}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="order-2 sm:order-1"
              onClick={handleCreatePetition}
            >
              Create Petitions
            </Button>
            
            <Button 
              variant="default" 
              className="order-1 sm:order-2 bg-black hover:bg-gray-900 text-white"
              onClick={() => setRatingModalOpen(true)}
            >
              Rate this public official
            </Button>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="border-b border-gray-200 w-full flex justify-start space-x-8 rounded-none bg-transparent h-auto mb-8">
            <TabsTrigger
              value="overview"
              className="border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent px-1 py-4 border-b-2 font-medium text-gray-500 data-[state=active]:shadow-none rounded-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="biography"
              className="border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent px-1 py-4 border-b-2 font-medium text-gray-500 data-[state=active]:shadow-none rounded-none"
            >
              Biography
            </TabsTrigger>
            <TabsTrigger
              value="petitions"
              className="border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent px-1 py-4 border-b-2 font-medium text-gray-500 data-[state=active]:shadow-none rounded-none"
            >
              Petitions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            {/* Main content */}
            {isLoadingRatings ? (
              <Loading message="Loading ratings data..." />
            ) : (
              <>
                {/* Approval and sectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ApprovalChart 
                    approvalRating={official.approvalRating}
                    monthlyChange={ratingSummary?.monthlyChange || 0}
                    monthlyData={ratingSummary?.monthlyData || []}
                  />
                  
                  <SectorPerformance 
                    averageRating={ratingSummary?.sectorAverage || 0}
                    monthlyChange={ratingSummary?.sectorMonthlyChange || 0}
                    sectors={ratingSummary?.sectorRatings || []}
                  />
                </div>
                
                {/* History Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  {/* Education section */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Education</h3>
                      {official.education && official.education.length > 3 && (
                        <button className="text-sm text-gray-500 hover:text-gray-700">
                          See all <ArrowLeft className="inline h-3 w-3 ml-1 rotate-180" />
                        </button>
                      )}
                    </div>
                    
                    <EducationTimeline education={official.education || []} />
                  </div>
                  
                  {/* Political career */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Political career</h3>
                      {official.careerHistory.length > 3 && (
                        <button className="text-sm text-gray-500 hover:text-gray-700">
                          See all <ArrowLeft className="inline h-3 w-3 ml-1 rotate-180" />
                        </button>
                      )}
                    </div>
                    
                    <CareerTimeline careers={official.careerHistory} />
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="biography">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bio Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Biography</h3>
                {official.bio ? (
                  <p className="text-gray-700 whitespace-pre-line">{official.bio}</p>
                ) : (
                  <p className="text-gray-400 text-center py-4">No biography information available</p>
                )}
              </div>
              
              {/* Education Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Education</h3>
                  {official.education && official.education.length > 3 && (
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      See all <ArrowLeft className="inline h-3 w-3 ml-1 rotate-180" />
                    </button>
                  )}
                </div>
                
                <EducationTimeline education={official.education || []} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="petitions">
            <div className="py-12 text-center">
              <p className="text-gray-500 mb-2">
                No petitions yet
              </p>
              <p className="text-sm text-gray-400">
                Be the first to create a petition for this official
              </p>
              <Button className="mt-4 bg-black hover:bg-gray-900 text-white" onClick={handleCreatePetition}>
                Create Petition
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Rating Modal */}
      <RatingModal
        open={ratingModalOpen}
        onOpenChange={setRatingModalOpen}
        officialId={official.id}
        officialName={official.name}
        sectors={official.sectors}
      />
    </main>
  );
}
