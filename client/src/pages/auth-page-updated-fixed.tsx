import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/use-auth.tsx";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { THLogo } from "@/components/ui/th-logo";

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPageUpdated() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const auth = useAuth();
  const user = auth.user;
  
  // Check for mutation-based auth
  const hasMutations = typeof auth === 'object' && auth !== null && 'loginMutation' in auth;
  
  // Safely access mutations
  const loginMutation = hasMutations ? auth.loginMutation : null;
  const registerMutation = hasMutations ? auth.registerMutation : null;
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // If user is already logged in, redirect to home
  if (user) {
    navigate("/");
    return null;
  }

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    if (loginMutation) {
      loginMutation.mutate({
        username: data.email, // Using email as username
        password: data.password,
      }, {
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

  const onRegisterSubmit = (data: RegisterFormValues) => {
    if (registerMutation) {
      registerMutation.mutate(
        {
          email: data.email,
          password: data.password,
          username: data.email, // Using email as username
        },
        {
          onError: (error) => {
            toast({
              title: "Registration failed",
              description: error.message,
              variant: "destructive",
            });
          },
        }
      );
    } else {
      toast({
        title: "Registration not available",
        description: "The registration functionality is not currently available.",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex min-h-screen bg-[#FFFFFF] flex-col items-center justify-center px-4 py-12 font-['Satoshi']">
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <THLogo className="mb-6" />
          <h2 className="text-2xl font-bold text-center text-[#262626]">
            {isLogin ? "Welcome to Townhall" : "Welcome back to Townhall"}
          </h2>
          <p className="mt-2 text-[14px] md:text-[16px] text-center text-[#737373] font-medium">
            {isLogin ? "Sign up to get started" : "Sign in to continue"}
          </p>
        </div>

        <div className="w-full">
          {isLogin ? (
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#262626] font-semibold text-[14px] md:text-[16px]">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="olivia@untitledui.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-[12px] md:text-[14px] text-[#737373] mt-1">This is a hint text to help user.</p>
                      <FormMessage className="text-[12px] md:text-[14px] text-[#EF4444]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#262626] font-semibold text-[14px] md:text-[16px]">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            className="pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-4"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-[#BFBFBF]" />
                            ) : (
                              <Eye className="h-5 w-5 text-[#BFBFBF]" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <p className="text-[12px] md:text-[14px] text-[#737373] mt-1">This is a hint text to help user.</p>
                      <FormMessage className="text-[12px] md:text-[14px] text-[#EF4444]" />
                    </FormItem>
                  )}
                />

                <div className="text-[14px] md:text-[16px] font-medium">
                  <button 
                    type="button" 
                    className="text-[#737373] hover:text-[#262626]"
                  >
                    Forgot passwords ?
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="black"
                  size="default"
                  className="w-full font-medium"
                  disabled={loginMutation ? loginMutation.isPending : false}
                >
                  {loginMutation && loginMutation.isPending ? (
                    <>
                      <span className="text-[#8c8c8c]">Signing in...</span>
                    </>
                  ) : (
                    "Sign up"
                  )}
                </Button>

                <div className="text-[14px] md:text-[16px] text-center font-medium">
                  Already have an account ?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="text-[#1476FF] font-semibold hover:text-blue-700"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#262626] font-semibold text-[14px] md:text-[16px]">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="olivia@untitledui.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-[12px] md:text-[14px] text-[#737373] mt-1">This is a hint text to help user.</p>
                      <FormMessage className="text-[12px] md:text-[14px] text-[#EF4444]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#262626] font-semibold text-[14px] md:text-[16px]">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            className="pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-4"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-[#BFBFBF]" />
                            ) : (
                              <Eye className="h-5 w-5 text-[#BFBFBF]" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <p className="text-[12px] md:text-[14px] text-[#737373] mt-1">This is a hint text to help user.</p>
                      <FormMessage className="text-[12px] md:text-[14px] text-[#EF4444]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#262626] font-semibold text-[14px] md:text-[16px]">Confirm password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            className="pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-4"
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5 text-[#BFBFBF]" />
                            ) : (
                              <Eye className="h-5 w-5 text-[#BFBFBF]" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <p className="text-[12px] md:text-[14px] text-[#737373] mt-1">This is a hint text to help user.</p>
                      <FormMessage className="text-[12px] md:text-[14px] text-[#EF4444]" />
                    </FormItem>
                  )}
                />

                <div className="text-[14px] md:text-[16px] font-medium">
                  <button 
                    type="button" 
                    className="text-[#737373] hover:text-[#262626]"
                  >
                    Forgot passwords ?
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="black"
                  size="default"
                  className="w-full font-medium"
                  disabled={registerMutation ? registerMutation.isPending : false}
                >
                  {registerMutation && registerMutation.isPending ? (
                    <span className="text-[#8c8c8c]">Signing in...</span>
                  ) : (
                    "Sign up"
                  )}
                </Button>

                <div className="text-[14px] md:text-[16px] text-center font-medium">
                  Already have an account ?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="text-[#1476FF] font-semibold hover:text-blue-700"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}