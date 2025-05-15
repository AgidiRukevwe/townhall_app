import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/use-auth.tsx";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

// Login form validation schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const auth = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Get user safely
  const user = auth?.user || null;
  
  // We'll use an effect for navigation to avoid React hook rules violation
  React.useEffect(() => {
    // If user is already logged in, redirect to home
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Check for mutations in auth object safely
  const loginMutation = auth && 'loginMutation' in auth ? auth.loginMutation : null;

  // Login form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    if (loginMutation) {
      loginMutation.mutate(data, {
        onSuccess: (user) => {
          toast({
            title: "Login successful",
            description: "Welcome back! Redirecting to home page...",
            variant: "default",
          });
          
          // Add a small delay before redirecting to ensure toast is seen
          setTimeout(() => {
            navigate("/");
          }, 1500);
        },
        onError: (error) => {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
        },
      });
    } else {
      toast({
        title: "Login not available",
        description: "The login functionality is not currently available.",
        variant: "destructive",
      });
    }
  };

  const isLoading = loginMutation && loginMutation.isPending;

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign in to your account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading ? true : false}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => navigate("/register")}
                >
                  Register here
                </Button>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}