import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";

export function useEmailAuth() {
  const { setUser, setLoading, loading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) throw new Error(loginError.message);

      if (data.user) {
        setUser({
          id: data.user.id,

          anonymous: false,
          deviceId: "unknown", // optional: extract from metadata if needed
        });
      }
    } catch (err) {
      console.error("Email login error:", err);
      setError(err instanceof Error ? err.message : "Unknown login error");
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) throw new Error(signupError.message);

      if (data.user) {
        setUser({
          id: data.user.id,
          anonymous: false,
          deviceId: "unknown",
        });
      }
    } catch (err) {
      console.error("Email registration error:", err);
      setError(
        err instanceof Error ? err.message : "Unknown registration error"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loginWithEmail,
    registerWithEmail,
    loading,
    error,
  };
}
