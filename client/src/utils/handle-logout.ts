import { queryClient } from "@/lib/queryClient";

export const handleLogout = () => {
  // Make a POST request to logout endpoint directly
  fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  })
    .then(() => {
      // Clear user data from query caches
      queryClient.setQueryData(["/api/user"], null);
      // Redirect to login page
      window.location.href = "/auth";
    })
    .catch((err) => {
      console.error("Logout failed:", err);
    });
};
