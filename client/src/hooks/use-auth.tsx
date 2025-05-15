import React, { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { 
  User as SelectUser, 
  InsertUser 
} from "../../../shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "./use-toast";

// Define extended user type for frontend
export interface User extends SelectUser {
  username: string;
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
};

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  email: string;
  password: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      console.log("Attempting login with credentials:", { username: credentials.username });
      const res = await apiRequest("POST", "/api/login", credentials);
      const userData = await res.json();
      console.log("Login API response:", userData);
      return userData;
    },
    onSuccess: (user: User) => {
      console.log("Login successful, user data:", user);
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      });
      
      // Force a refetch of the user data
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      console.log("Attempting registration with:", { username: credentials.username, email: credentials.email });
      const res = await apiRequest("POST", "/api/register", credentials);
      const userData = await res.json();
      console.log("Registration API response:", userData);
      return userData;
    },
    onSuccess: (user: User) => {
      console.log("Registration successful, user data:", user);
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful", 
        description: `Welcome to Townhall, ${user.username}!`,
      });
      
      // Force a refetch of the user data
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      console.log("Attempting to log out");
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      console.log("Logout successful");
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logout successful",
        description: "You have been logged out successfully.",
      });
      
      // Force a refetch of the user data
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
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