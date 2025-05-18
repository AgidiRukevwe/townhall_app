import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useOfficialDetails } from "@/hooks/use-officials";
import { useRatings } from "@/hooks/use-ratings";
import { Loading } from "@/components/shared/loading";
import { RatingModal } from "@/components/rating/rating-modal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  Cell
} from "recharts";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { data: official, isLoading, error } = useOfficialDetails(id);
  const { data: ratingSummary, isLoading: isLoadingRatings } = useRatings(id);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<"1 Dy" | "1 Wk" | "1 Mn">("1 Mn");
  const [currentMonth, setCurrentMonth] = useState<string>("January");
  
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
  
  const nextMonth = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentIndex = months.indexOf(currentMonth);
    const nextIndex = (currentIndex + 1) % 12;
    setCurrentMonth(months[nextIndex]);
  };

  const prevMonth = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentIndex = months.indexOf(currentMonth);
    const prevIndex = currentIndex === 0 ? 11 : currentIndex - 1;
    setCurrentMonth(months[prevIndex]);
  };
  
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
          
          {/* Official info */}
          <div className="flex mb-12">
            <div className="mr-8">
              {official.imageUrl ? (
                <div className="w-28 h-28 rounded-full overflow-hidden relative bg-[#e6f4ff]">
                  <img 
                    src={official.imageUrl ?? ""} 
                    alt={official.name}
                    className="absolute w-[120%] h-[120%] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 object-cover"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 rounded-full bg-[#e6f4ff] flex items-center justify-center">
                  <span className="text-[#1476FF] text-2xl font-bold">
                    {official.name.split(' ').map(part => part[0]).slice(0, 2).join('')}
                  </span>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold">{official.name}</h2>
              <p className="text-gray-600">{official.position}, {official.location}</p>
              
              {/* Bio section with expandable toggle */}
              <div className="mt-4 max-w-md">
                <details className="group">
                  <summary className="cursor-pointer flex items-center text-sm">
                    <span className="font-medium">Bio</span>
                    <span className="ml-1 text-gray-400 group-open:hidden">+</span>
                    <span className="ml-1 text-gray-400 hidden group-open:inline">-</span>
                  </summary>
                  <p className="mt-2 text-sm text-gray-600">
                    {official.bio || "No biography available for this official."}
                  </p>
                </details>
              </div>
              
              {/* Political party */}
              <div className="mt-4">
                <details className="group">
                  <summary className="cursor-pointer flex items-center text-sm">
                    <span className="font-medium">Political party</span>
                    <span className="ml-1 text-gray-400 group-open:hidden">+</span>
                    <span className="ml-1 text-gray-400 hidden group-open:inline">-</span>
                  </summary>
                  <div className="mt-2 flex items-center">
                    <div className="w-6 h-6 rounded-full mr-2 overflow-hidden">
                      {/* This would be the party logo, using acronym for now */}
                      <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {official.party.substring(0, 3)}
                      </div>
                    </div>
                    <span className="text-sm">{official.party}</span>
                  </div>
                </details>
              </div>
              
              {/* Career history */}
              <div className="mt-4">
                <details className="group">
                  <summary className="cursor-pointer flex items-center text-sm">
                    <span className="font-medium">Career history</span>
                    <span className="ml-1 text-gray-400 group-open:hidden">+</span>
                    <span className="ml-1 text-gray-400 hidden group-open:inline">-</span>
                  </summary>
                  <div className="mt-2">
                    {careerData.length > 0 ? (
                      <table className="w-full text-sm">
                        <tbody>
                          {careerData.map((career, index) => (
                            <tr key={index} className="border-b border-gray-100 last:border-0">
                              <td className="py-2">{career.position}</td>
                              <td className="py-2 text-right text-gray-500">{career.date || `${career.startYear || ''}-${career.endYear || 'Present'}`}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-sm text-gray-500">No career history available.</p>
                    )}
                  </div>
                </details>
              </div>
              
              {/* Education */}
              <div className="mt-4">
                <details className="group">
                  <summary className="cursor-pointer flex items-center text-sm">
                    <span className="font-medium">Education</span>
                    <span className="ml-1 text-gray-400 group-open:hidden">+</span>
                    <span className="ml-1 text-gray-400 hidden group-open:inline">-</span>
                  </summary>
                  <div className="mt-2">
                    {educationData.length > 0 ? (
                      <table className="w-full text-sm">
                        <tbody>
                          {educationData.map((edu, index) => (
                            <tr key={index} className="border-b border-gray-100 last:border-0">
                              <td className="py-2">{edu.institution}</td>
                              <td className="py-2 text-right text-gray-500">{edu.degree}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-sm text-gray-500">No education history available.</p>
                    )}
                  </div>
                </details>
              </div>
            </div>
          </div>
          
          {/* Approval Rating Chart */}
          <div className="bg-white rounded-lg border border-gray-100 p-6 mb-8">
            <div className="flex items-center mb-5">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-500 rounded-md w-6 h-6 flex items-center justify-center text-white text-xs">
                  A1
                </div>
                <span className="text-base font-semibold">Approval rating</span>
              </div>
              
              <div className="ml-auto flex items-center space-x-2">
                <button 
                  className={cn(
                    "px-2 py-1 text-xs rounded-full", 
                    timeRange === "1 Dy" ? "bg-gray-200" : "bg-transparent"
                  )}
                  onClick={() => setTimeRange("1 Dy")}
                >
                  1 Dy
                </button>
                <button 
                  className={cn(
                    "px-2 py-1 text-xs rounded-full", 
                    timeRange === "1 Wk" ? "bg-gray-200" : "bg-transparent"
                  )}
                  onClick={() => setTimeRange("1 Wk")}
                >
                  1 Wk
                </button>
                <button 
                  className={cn(
                    "px-2 py-1 text-xs rounded-full", 
                    timeRange === "1 Mn" ? "bg-gray-200" : "bg-transparent"
                  )}
                  onClick={() => setTimeRange("1 Mn")}
                >
                  1 Mn
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <h2 className="text-6xl font-bold">
                {ratingSummary?.overallRating || official.approvalRating || 27}%
              </h2>
              <div className="text-green-500 text-sm flex items-center mt-2">
                <span className="inline-block mr-1">▲</span> 
                <span>{ratingSummary?.monthlyChange || 2.5}% in 1 month</span>
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={ratingSummary?.monthlyData || mockMonthlyData}
                  margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1476FF" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1476FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" vertical={false} horizontal={true} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    domain={[0, 100]}
                    ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                  />
                  <Tooltip 
                    cursor={false}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-black/90 text-white text-xs p-2 rounded">
                            <div className="font-medium">{`${payload[0].payload.month}`}</div>
                            <div>{`${payload[0].value}%`}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine 
                    x="JUL" 
                    stroke="#000" 
                    strokeDasharray="3 3" 
                    label={{ 
                      value: "76%", 
                      position: "insideBottomRight",
                      fill: "#000",
                      fontSize: 10,
                      dy: -20,
                      dx: -15,
                      backgroundColor: "#000",
                      border: "1px solid #000",
                      borderRadius: "3px",
                      padding: 3
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="#1476FF" 
                    strokeWidth={2}
                    fill="url(#colorRating)" 
                    dot={false}
                    activeDot={{ r: 5, fill: "#1476FF" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Performance by sectors */}
          <div className="bg-white rounded-lg border border-gray-100 p-6 mb-8">
            <div className="flex items-center mb-5">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-500 rounded-md w-6 h-6 flex items-center justify-center text-white text-xs">
                  B1
                </div>
                <span className="text-base font-semibold">Performance ratings by sectors</span>
              </div>
              
              <div className="ml-auto flex items-center space-x-1">
                <button 
                  onClick={prevMonth}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium">{currentMonth}</span>
                <button 
                  onClick={nextMonth}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <h2 className="text-6xl font-bold">
                {ratingSummary?.sectorAverage || 27}%
              </h2>
              <div className="text-green-500 text-sm flex items-center mt-2">
                <span className="inline-block mr-1">▲</span> 
                <span>{ratingSummary?.sectorMonthlyChange || 2.5}% in 1 month</span>
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ratingSummary?.sectorRatings || mockSectorData}
                  margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="2 2" vertical={true} horizontal={false} stroke="#f0f0f0" />
                  <XAxis 
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    domain={[0, 100]}
                    ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                  />
                  <YAxis 
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    width={100}
                  />
                  <Tooltip
                    cursor={false}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-black/90 text-white text-xs p-2 rounded">
                            <div className="font-medium">{`${payload[0].payload.name}`}</div>
                            <div>{`${payload[0].value}%`}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="rating" 
                    radius={[0, 10, 10, 0]}
                    barSize={16}
                  >
                    {(ratingSummary?.sectorRatings || mockSectorData).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#007BFF" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
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