// use-auth.tsx (Google OAuth version using Supabase)

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  useMutation,
  useQuery,
  UseMutationResult,
} from "@tanstack/react-query";
import { supabase } from "@/lib/supabase"; // ensure you have a supabase client set up
import { useToast } from "./use-toast";
import { queryClient } from "@/lib/queryClient";

interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [error, setError] = useState<Error | null>(null);

  // Fetch user from Supabase session
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<User | null, Error>({
    queryKey: ["/auth/user"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return {
        id: data.user.id,
        email: data.user.email!,
        username: data.user.user_metadata?.full_name || data.user.email,
        avatar_url: data.user.user_metadata?.avatar_url,
      };
    },
  });

  // Google OAuth login
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error("Google login error:", error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      setError(error);
    }
  };

  // Logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
      setError(error);
      return;
    }

    queryClient.setQueryData(["/auth/user"], null);
    toast({
      title: "Logged out",
      description: "You have been logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
