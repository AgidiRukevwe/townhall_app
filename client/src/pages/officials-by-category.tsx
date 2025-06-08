import { SimpleOfficialsList } from "@/components/officials/simple-officials-list";
import { useOfficials } from "@/hooks/use-officials";
import { Loading } from "@/components/shared/loading";
import { Link, useLocation, useParams } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { useState, useEffect } from "react";
import { OfficialCard } from "@/components/officials/official-card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { toTitleCase } from "@/utils/to-title-case";

export default function OfficialsCategoryPage() {
  const [location, navigate] = useLocation();

  const PAGE_SIZE = 20;

  // Get category from URL path (last segment)
  const category = location.split("/").pop() || "";

  const { officials, isLoading, error } = useOfficials({ search: "" });

  // Filter officials client-side by category
  const filteredOfficials = officials.filter(
    (official) => official.chamber?.toLowerCase() === category.toLowerCase()
  );

  const { id: pageTitle } = useParams<{ id: string }>();

  // For navbar, assuming you have user info if needed
  const [searchInput, setSearchInput] = useState("");
  const userName = "";

  useEffect(() => console.log(pageTitle), [pageTitle]);

  // Pagination state
  const [page, setPage] = useState(1);
  const paginatedOfficials = filteredOfficials.slice(0, PAGE_SIZE * page);
  const hasMore = paginatedOfficials.length < filteredOfficials.length;

  // Handle search input and navigation with query param
  const handleSearch = (query: string) => {
    setSearchInput(query);
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <main className="flex-1 bg-white">
      <Navbar
        onSearch={handleSearch}
        initialSearchValue={searchInput}
        username={userName}
        showSearch
      />

      <div className="pt-24 md:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen">
        {/* <h1 className="text-2xl font-semibold mb-6 capitalize">{category}</h1> */}
        <div className="flex gap-x-2 md:gap-x-4 items-center mb-6">
          <Link href="/">
            <Icon name="ArrowCircleLeft2" color="#262626" />
          </Link>
          <span className="text-lg font-bold">{toTitleCase(category)}</span>
        </div>

        {error ? (
          <p className="text-red-500">
            Error loading officials:{" "}
            {error instanceof Error ? error.message : String(error)}
          </p>
        ) : isLoading ? (
          <Loading />
        ) : (
          <div className="gap-x-2flex overflow-x-auto gap-y-2 md:gap-12 pb-2 hide-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-12">
              {paginatedOfficials.map((official) => (
                <div
                  key={official.id}
                  className="md:h-full w-[170px] md:min-w-[200px] md:w-[100px] flex-shrink-0 cursor-auto"
                  onClick={() =>
                    (window.location.href = `/profile/${official.id}`)
                  }
                >
                  <OfficialCard official={official} compact />
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-6">
                <Button onClick={() => setPage((p) => p + 1)}>Load More</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
