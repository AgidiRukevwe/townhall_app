import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useOfficialDetails } from "@/hooks/use-officials";
import { useRatings } from "@/hooks/use-ratings";
import { Loading } from "@/components/shared/loading";
import { RatingModal } from "@/components/rating/rating-modal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { OfficialProfileCard } from "@/components/profile/official-profile-card";
import { ImprovedApprovalChart } from "@/components/profile/improved-approval-chart";
import { SectorPerformanceChart } from "@/components/profile/sector-performance-chart";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { data: official, isLoading, error } = useOfficialDetails(id);
  const { data: ratingSummary, isLoading: isLoadingRatings } = useRatings(id);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Get username or use default
  const userName: string =
    user && user !== null && typeof user === "object" && "username" in user
      ? (user.username as string)
      : "";
      
  const handleSearch = (query: string) => {
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

  // Mock monthly data that matches the design
  const mockMonthlyData = [
    { month: "JAN", rating: 20 },
    { month: "FEB", rating: 25 },
    { month: "MAR", rating: 10 },
    { month: "APR", rating: 5 },
    { month: "MAY", rating: 20 },
    { month: "JUN", rating: 35 },
    { month: "JUL", rating: 50 },
    { month: "AUG", rating: 70 },
    { month: "SEP", rating: 75 },
    { month: "OCT", rating: 68 },
    { month: "NOV", rating: 60 },
    { month: "DEC", rating: 55 }
  ];

  // Mock sector data that matches the design
  const mockSectorData = [
    { name: "Health", rating: 76 },
    { name: "Infrastructure", rating: 78 },
    { name: "Agriculture", rating: 75 },
    { name: "Security", rating: 77 },
    { name: "Economy", rating: 75 },
    { name: "Corruption", rating: 76 },
    { name: "Transportation", rating: 77 }
  ];
  
  // Determine education and career data from official
  const educationData = official?.education || [];
  const careerData = official?.careerHistory || [];
  
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
        
        <div className="bg-white py-8">
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
  
  // All month navigation is now handled within the components
  
  return (
    <main className="flex-1 bg-white">
      <Navbar 
        onSearch={handleSearch}
        username={userName}
        onLogout={handleLogout}
      />
      
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Official's profile header */}
          <div className="flex items-center mb-8">
            <User className="h-5 w-5 mr-2 text-gray-500" />
            <span className="text-gray-600">Official's profile</span>
            <div className="ml-auto">
              <Button 
                onClick={() => setRatingModalOpen(true)}
                className="bg-black hover:bg-black/90 text-white rounded-full text-sm"
              >
                Rate this leader
              </Button>
            </div>
          </div>
          
          {/* Official Profile Card Component */}
          <OfficialProfileCard 
            official={official}
            educationData={educationData}
            careerData={careerData}
          />
          
          {/* Improved Approval Rating Chart */}
          <ImprovedApprovalChart
            monthlyData={ratingSummary?.monthlyData || []}
            overallRating={ratingSummary?.overallRating || official.approvalRating}
            monthlyChange={ratingSummary?.monthlyChange || 0}
          />
          
          {/* Sector Performance Chart Component */}
          <SectorPerformanceChart
            sectorRatings={ratingSummary?.sectorRatings || []}
            sectorAverage={ratingSummary?.sectorAverage}
            sectorMonthlyChange={ratingSummary?.sectorMonthlyChange}
          />
          
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