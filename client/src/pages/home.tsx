import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OfficialsGrid } from "@/components/officials/officials-grid";
import { useOfficials } from "@/hooks/use-officials";
import { Loading } from "@/components/shared/loading";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const { officials, isLoading, error } = useOfficials();
  const { user } = useAuthStore();
  const userName = "Citizen"; // Default name for anonymous users

  // Get search params
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("search");

  // Filter officials based on search query
  const filteredOfficials = searchQuery
    ? officials.filter(
        (official) =>
          official.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          official.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          official.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : officials;

  if (error) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-red-500">Error loading officials: {error.toString()}</p>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-1">
            Welcome {userName} <span className="inline-block">👋</span>
          </h2>
          <p className="text-gray-600">Meet the People Who Represent You</p>
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="border-b border-gray-200 w-full flex justify-start space-x-8 rounded-none bg-transparent h-auto">
            <TabsTrigger
              value="all"
              className="border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent px-1 py-4 border-b-2 font-medium text-gray-500 data-[state=active]:shadow-none rounded-none"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="my-reps"
              className="border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent px-1 py-4 border-b-2 font-medium text-gray-500 data-[state=active]:shadow-none rounded-none"
            >
              My representatives
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <Loading />
            ) : (
              <OfficialsGrid officials={filteredOfficials} isLoading={isLoading} />
            )}
          </TabsContent>

          <TabsContent value="my-reps" className="mt-6">
            {isLoading ? (
              <Loading />
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500 mb-2">
                  Set your location to see your representatives
                </p>
                <p className="text-sm text-gray-400">
                  This feature is coming soon
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
