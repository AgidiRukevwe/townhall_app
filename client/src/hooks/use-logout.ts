// hooks/use-logout.ts
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      // Clear the cached user data
      queryClient.setQueryData(["/api/user"], null);

      // Redirect to login
      window.location.href = "/auth";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [queryClient]);

  return logout;
}
