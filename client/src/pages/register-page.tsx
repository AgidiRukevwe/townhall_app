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
const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const auth = useAuth();
  const user = auth.user;

  // Safely access mutation
  const registerMutation = auth?.registerMutation;
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // If user is already logged in, redirect to home
  if (user) {
    navigate("/");
    return null;
  }

  // Registration form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormValues) => {
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
        description:
          "The registration functionality is not currently available.",
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
      <div className="w-full max-w-md md:max-w-xs mx-auto">
        <div className="flex flex-col items-center mb-8">
          <THLogo className="mb-6" />
          <h2 className="text-2xl font-bold text-center text-[#262626]">
            Create an account
          </h2>
          <p className="mt-2 text-[14px] md:text-[16px] text-center text-[#737373] font-medium">
            Sign up to get started
          </p>
        </div>

        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-[#262626] font-semibold text-[12px] md:text-[14px]">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="olivia@untitledui.com"
                        type="email"
                        autoComplete="email"
                        className="pr-4"
                        onFocus={() => setFocusedField("email")}
                        // onBlur={() => setFocusedField(null)}
                        {...field}
                      />
                    </FormControl>
                    {/* Show hint text only when focused or has error */}
                    {(focusedField === "email" || fieldState.error) && (
                      <p
                        className={`text-[12px] md:text-[14px] mt-1 ${
                          fieldState.error ? "text-[#EF4444]" : "text-[#737373]"
                        }`}
                      >
                        {fieldState.error
                          ? fieldState.error.message
                          : "Enter your email address"}
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
                    <FormLabel className="text-[#262626] font-semibold text-[12px] md:text-[14px]">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          className="pr-10"
                          onFocus={() => setFocusedField("password")}
                          // onBlur={() => setFocusedField(null)}
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
                    {(focusedField === "password" || fieldState.error) && (
                      <p
                        className={`text-[12px] md:text-[14px] mt-1 ${
                          fieldState.error ? "text-[#EF4444]" : "text-[#737373]"
                        }`}
                      >
                        {fieldState.error
                          ? fieldState.error.message
                          : "Password must be at least 6 characters"}
                      </p>
                    )}
                    <FormMessage className="sr-only" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-[#262626] font-semibold text-[12px] md:text-[14px]">
                      Confirm password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          className="pr-10"
                          onFocus={() => setFocusedField("confirmPassword")}
                          // onBlur={() => setFocusedField(null)}
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
                    {/* Show hint text only when focused or has error */}
                    {(focusedField === "confirmPassword" ||
                      fieldState.error) && (
                      <p
                        className={`text-[12px] md:text-[14px] mt-1 ${
                          fieldState.error ? "text-[#EF4444]" : "text-[#737373]"
                        }`}
                      >
                        {fieldState.error
                          ? fieldState.error.message
                          : "Re-enter your password to confirm"}
                      </p>
                    )}
                    <FormMessage className="sr-only" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="black"
                size="default"
                className="w-full font-medium"
                disabled={
                  !form.formState.isValid ||
                  registerMutation?.isPending ||
                  false
                }
              >
                {registerMutation?.isPending ? "Signing up..." : "Sign up"}
              </Button>

              <div className="text-[14px] md:text-[16px] text-center font-medium">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/auth")}
                  className="text-[#1476FF] font-semibold hover:text-blue-700"
                >
                  Sign in
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
