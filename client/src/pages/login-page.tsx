import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/use-auth.tsx";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
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

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const auth = useAuth();
  const user = auth.user;
  
  // Safely access mutation
  const loginMutation = auth?.loginMutation;
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // If user is already logged in, redirect to home
  if (user) {
    navigate("/");
    return null;
  }

  // Login form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormValues) => {
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen bg-[#FFFFFF] flex-col items-center justify-center px-4 py-12 font-['Satoshi']">
      <div className="w-full max-w-md md:max-w-xs mx-auto">
        <div className="flex flex-col items-center mb-8">
          <THLogo className="mb-6" />
          <h2 className="text-2xl font-bold text-center text-[#262626]">
            Welcome to Townhall
          </h2>
          <p className="mt-2 text-[14px] md:text-[16px] text-center text-[#737373] font-medium">
            Sign in to continue
          </p>
        </div>

        <div className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-[#262626] font-semibold text-[12px] md:text-[14px]">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="olivia@untitledui.com"
                        type="email"
                        autoComplete="email"
                        className="pr-4"
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        {...field}
                      />
                    </FormControl>
                    {/* Show hint text only when focused or has error */}
                    {(focusedField === 'email' || fieldState.error) && (
                      <p className={`text-[12px] md:text-[14px] mt-1 ${fieldState.error ? 'text-[#EF4444]' : 'text-[#737373]'}`}>
                        {fieldState.error ? fieldState.error.message : "Enter your email address"}
                      </p>
                    )}
                    <FormMessage className="sr-only" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-[#262626] font-semibold text-[12px] md:text-[14px]">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          className="pr-10"
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
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
                    {/* Show hint text only when focused or has error */}
                    {(focusedField === 'password' || fieldState.error) && (
                      <p className={`text-[12px] md:text-[14px] mt-1 ${fieldState.error ? 'text-[#EF4444]' : 'text-[#737373]'}`}>
                        {fieldState.error ? fieldState.error.message : "Password must be at least 6 characters"}
                      </p>
                    )}
                    <FormMessage className="sr-only" />
                  </FormItem>
                )}
              />

              <div className="text-[14px] md:text-[16px] font-medium">
                <button 
                  type="button" 
                  className="text-[#737373] hover:text-[#262626]"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                variant="black"
                size="default"
                className="w-full font-medium"
                disabled={!form.formState.isValid || (loginMutation?.isPending || false)}
              >
                {loginMutation?.isPending ? "Signing in..." : "Sign in"}
              </Button>

              <div className="text-[14px] md:text-[16px] text-center font-medium">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-[#1476FF] font-semibold hover:text-blue-700"
                >
                  Sign up
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}