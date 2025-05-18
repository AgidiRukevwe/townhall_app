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
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { data: official, isLoading, error } = useOfficialDetails(id);
  const { data: ratingSummary, isLoading: isLoadingRatings } = useRatings(id);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get username or use default
  const userName: string =
    user && user !== null && typeof user === "object" && "username" in user
      ? (user.username as string)
      : "";
      
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Redirect to home page with search query
    if (query.trim()) {
      const params = new URLSearchParams();
      params.set("search", query);
      window.location.href = `/?${params.toString()}`;
    }
  };
  
  const handleLogout = () => {
    // Make a POST request to logout endpoint directly
    fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(() => {
        // Clear user data from query cache
        queryClient.setQueryData(["/api/user"], null);
        // Redirect to login page
        window.location.href = "/auth";
      })
      .catch((err) => {
        console.error("Logout failed:", err);
      });
  };
  
  // Debug official data
  console.log("Profile page - official data:", official);
  console.log("Profile page - education data:", official?.education);
  console.log("Profile page - career data:", official?.careerHistory);
  console.log("Profile page - sectors data:", official?.sectors);
  console.log("Profile page - rating summary:", ratingSummary);
  
  if (isLoading) {
    return <Loading message="Loading official profile..." />;
  }
  
  if (error || !official) {
    return (
      <main className="flex-1 bg-white">
        <Navbar 
          onSearch={handleSearch}
          username={userName}
          onLogout={handleLogout}
        />
        
        <div className="bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Link>
            
            <div className="flex justify-center py-12">
              <p className="text-red-500">Error loading official: {error?.toString() || "Official not found"}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  const handleCreatePetition = () => {
    toast({
      title: "Coming soon",
      description: "This feature is not yet available.",
    });
  };
  
  return (
    <main className="flex-1 bg-white">
      <Navbar 
        onSearch={handleSearch}
        username={userName}
        onLogout={handleLogout}
      />
      
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home
          </Link>
          
          {/* Official info */}
          <div className="flex flex-col md:flex-row items-start mb-8">
            <div className="flex-shrink-0 mb-4 md:mb-0 mr-6">
              {official.imageUrl ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md relative bg-[#e6f4ff]">
                  <img 
                    src={official.imageUrl ?? ""} 
                    alt={official.name}
                    className="absolute w-[120%] h-[120%] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 object-cover"
                    style={{ objectPosition: "center 20%" }}
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-[#e6f4ff] flex items-center justify-center border-4 border-white shadow-md">
                  <span className="text-[#1476FF] text-3xl font-bold">
                    {official.name.split(' ').map(part => part[0]).slice(0, 2).join('')}
                  </span>
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
              
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => setRatingModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Rate Official
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleCreatePetition}
                >
                  Create Petition
                </Button>
              </div>
            </div>
          </div>
          
          {/* Performance data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Overall Approval Rating</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">{official.approvalRating}%</div>
              <div className="text-sm text-gray-500">
                {official.approvalTrend > 0 ? (
                  <span className="text-green-500">↑ {official.approvalTrend}% this month</span>
                ) : official.approvalTrend < 0 ? (
                  <span className="text-red-500">↓ {Math.abs(official.approvalTrend)}% this month</span>
                ) : (
                  <span>No change this month</span>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
              <h3 className="text-lg font-semibold mb-2">Approval Trend</h3>
              <div className="h-64">
                {ratingSummary && <ApprovalChart data={ratingSummary.monthlyData} />}
              </div>
            </div>
          </div>
          
          {/* Bio */}
          {official.bio && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Biography</h3>
              <p className="text-gray-700">{official.bio}</p>
            </div>
          )}
          
          {/* Tabs for detailed info */}
          <Tabs defaultValue="performance" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="performance">Performance by Sector</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="career">Career</TabsTrigger>
              <TabsTrigger value="elections">Election History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Performance by Sector</h3>
              <SectorPerformance data={ratingSummary?.sectorRatings || []} />
            </TabsContent>
            
            <TabsContent value="education" className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Education Background</h3>
              <EducationTimeline education={official.education || []} />
            </TabsContent>
            
            <TabsContent value="career" className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Career History</h3>
              <CareerTimeline career={official.careerHistory || []} />
            </TabsContent>
            
            <TabsContent value="elections" className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Election History</h3>
              <ElectionTimeline elections={official.electionHistory || []} />
            </TabsContent>
          </Tabs>
        </div>
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