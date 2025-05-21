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
import DottedGridChart from "@/components/profile/charts/dotted-chart";
import { ChartCard } from "@/components/profile/charts/chart-card";
import { Icon } from "@/components/ui/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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

  const tabTriggerClass = cn(
    "relative pt-4 px-1 pr-4 text-text-secondary text-sm rounded-none",
    "data-[state=active]:text-text-primary data-[state=active]:text-xs  data-[state=active]:font-medium data-[state=active]:border-b-2 data-[state=active]:border-text-primary data-[state=active]:-mb-px rounded-none"
  );

  const datasets = {
    Today: {
      label: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      data: [
        5, 6, 4, 7, 10, 12, 18, 22, 30, 35, 40, 38, 42, 45, 50, 55, 52, 50, 48,
        47, 46, 44, 40, 35,
      ],
    },
    "This week": {
      label: [
        "May 7",
        "May 8",
        "May 9",
        "May 10",
        "May 11",
        "May 12",
        "May 13",
      ],
      data: [50, 52, 47, 55, 60, 58, 5],
    },
    "This month": {
      label: [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ],
      data: [20, 25, 10, 5, 20, 35, 50, 70, 75, 68, 60, 55],
    },
    "This year": {
      label: ["2019", "2020", "2021", "2022", "2023", "2024", "2025"],
      data: [30, 40, 35, 50, 60, 70, 80],
    },
  };
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
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Link>

            <div className="flex justify-center py-12">
              <p className="text-red-500">
                Error loading official:{" "}
                {error?.toString() || "Official not found"}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // All month navigation is now handled within the components

  return (
    <main className="flex-1 bg-white w-full">
      <Navbar
        onSearch={handleSearch}
        username={userName}
        onLogout={handleLogout}
      />

      {/* FOR DESKTOP MODE ONLY */}

      <div className="bg-white py-8 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Official's profile header */}
          <div className="flex items-center mb-8">
            <div className="flex gap-x-4 items-center">
              <Icon name="ArrowCircleLeft2" color="#737373" />
              <span className="text-lg font-bold">Official's profile</span>
            </div>

            <div className="ml-auto">
              <Button
                onClick={() => setRatingModalOpen(true)}
                className="bg-surface-dark hover:bg-surface-dark/95 text-white rounded-full text-sm py-3"
              >
                Rate this leader
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-full justify-between">
            {/* Official Profile Card Component */}
            <OfficialProfileCard
              official={official}
              educationData={educationData}
              careerData={careerData}
              classname="w-full md:w-[20%]"
            />
            <div className=" md:w-[70%]">
              <ChartCard
                chartName="Approval rating"
                dataMap={datasets}
                chartType="line"
                chartKey="4"
                valueChange={2.5}
              />

              <ChartCard
                chartName="Performance by sectors"
                dataMap={datasets}
                chartType="bar"
                chartKey="4"
                valueChange={2.5}
              />

              {/* <DottedGridChart labels={months} data={ratings} /> */}

              {/* Sector Performance Chart Component */}
              {/* <SectorPerformanceChart
                sectorRatings={ratingSummary?.sectorRatings || []}
                sectorAverage={ratingSummary?.sectorAverage}
                sectorMonthlyChange={ratingSummary?.sectorMonthlyChange}
              /> */}
            </div>
          </div>
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
