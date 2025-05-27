import { SimpleOfficialsList } from "@/components/officials/simple-officials-list";
import { useOfficials } from "@/hooks/use-officials";
import { Loading } from "@/components/shared/loading";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  // const { officials, isLoading, error } = useOfficials();
  // const { user } = useAuth();
  // const [, navigate] = useLocation();
  // const [searchInput, setSearchInput] = useState("");

  // // Get username or use default
  // const userName: string =
  //   user && user !== null && typeof user === "object" && "username" in user
  //     ? (user.username as string)
  //     : "";

  // // Get search params
  // const searchParams = new URLSearchParams(window.location.search);
  // const searchQuery = searchParams.get("search");

  // const handleSearch = (query: string) => {
  //   if (query.trim()) {
  //     const params = new URLSearchParams();
  //     params.set("search", query);
  //     navigate(`/?${params.toString()}`);
  //   }
  // };

  const [, navigate] = useLocation();

  // Get search parameter from URL
  const searchParams = new URLSearchParams(window.location.search);
  const urlSearchQuery = searchParams.get("search") || "";

  // Initialize searchInput state with URL search query
  const [searchInput, setSearchInput] = useState(urlSearchQuery);

  // Use our enhanced useOfficials hook with search parameter
  const { officials, isLoading, error, searchQuery } = useOfficials({
    search: urlSearchQuery,
  });

  const { user } = useAuth();

  // Get username or use default
  const userName: string =
    user && user !== null && typeof user === "object" && "username" in user
      ? (user.username as string)
      : "";

  useEffect(() => {
    console.log("User:", user);
  }, []);

  // Update searchInput when URL changes
  // useEffect(() => {
  //   const newParams = new URLSearchParams(window.location.search);
  //   const newSearchQuery = newParams.get("search") || "";
  //   setSearchInput(newSearchQuery);
  // }, [window.location.search]);

  // const handleSearch = (query: string) => {
  //   if (query.trim()) {
  //     const params = new URLSearchParams();
  //     params.set("search", query);
  //     navigate(`/?${params.toString()}`);
  //   } else {
  //     // If search is empty, remove search param
  //     navigate("/");
  //   }
  // };

  const handleSearch = (query: string) => {
    setSearchInput(query);

    if (query.trim()) {
      const params = new URLSearchParams();
      params.set("search", query);
      navigate(`/?${params.toString()}`);
    } else {
      navigate(`/`); // clear search query if input empty
    }
  };

  useEffect(() => {
    setSearchInput(urlSearchQuery);
  }, [urlSearchQuery]);

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
        navigate("/auth");
      })
      .catch((err) => {
        console.error("Logout failed:", err);
      });
  };

  // Filter officials based on search query
  const filteredOfficials = searchQuery
    ? officials.filter(
        (official) =>
          official.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          official.position
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (official.location &&
            official.location.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : officials;

  if (error) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-red-500">
          Error loading officials:{" "}
          {error instanceof Error ? error.message : String(error)}
        </p>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-white">
      <Navbar
        onSearch={handleSearch}
        initialSearchValue={searchInput}
        username={userName}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-14   ">
        {/* Main Content */}
        {isLoading ? (
          <Loading />
        ) : (
          <SimpleOfficialsList
            officials={filteredOfficials}
            isLoading={isLoading}
          />
        )}
      </div>
    </main>
  );
}
