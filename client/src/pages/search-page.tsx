import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "wouter";

import { useOfficials } from "@/hooks/use-officials";
import { Loading } from "@/components/shared/loading";
import { OfficialCard } from "@/components/officials/official-card";
import { Icon } from "@/components/ui/icon";
import EmptyState from "@/components/shared/empty-state";
import { Navbar } from "@/components/layout/navbar";
import { handleLogout } from "@/utils/handle-logout";
import { useSearchHandler } from "@/hooks/use-search";
import { Button } from "@/components/ui/button";

function SearchPage() {
  const [location, navigate] = useLocation();
  const searchQuery =
    new URLSearchParams(window.location.search).get("search") || "";

  const { officials, isLoading } = useOfficials({ search: searchQuery });
  const { searchInput, handleSearch } = useSearchHandler();

  const { id: pageTitle } = useParams<{ id: string }>();
  // const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 20;
  const paginatedOfficials = officials?.slice(0, PAGE_SIZE * page) || [];
  const hasMore = paginatedOfficials.length < (officials?.length || 0);

  useEffect(() => {
    if (pageTitle) {
      console.log(pageTitle);
    }
  }, [pageTitle]);

  if (isLoading) return <Loading message="loading officials" />;

  return (
    <main className="flex-1 bg-white w-full overflow-hidden">
      <Navbar
        onSearch={handleSearch}
        username={""}
        onLogout={handleLogout}
        showSearch={true}
      />
      <div className="pt-32 md:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen">
        {!officials || officials.length === 0 ? (
          <EmptyState
            type="not-found"
            title="No officials found"
            showRetry={false}
          />
        ) : (
          <div className="md:space-y-8 space-y-2">
            {searchQuery && (
              <div className="mb-8 rounded-lg">
                <div className="flex gap-x-2 md:gap-x-4 items-start">
                  <Link href="/">
                    <Icon name="ArrowCircleLeft2" color="#262626" />
                  </Link>
                  <div>
                    <span className="text-lg font-bold">
                      Showing results for "{searchQuery}"
                    </span>
                    <p className="text-text-secondary text-sm mt-0.5">
                      Found {officials.length} official
                      {officials.length !== 1 ? "s" : ""} matching your search
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                  <Button onClick={() => setPage((p) => p + 1)}>
                    Load More
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default SearchPage;
