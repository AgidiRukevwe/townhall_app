import { useState } from "react";
import { getDeviceId, getUserIP } from "@/lib/fingerprint";
import { anonymousLogin, createUserProfile } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";

export function useAnonymousAuth() {
  const { setUser, setLoading, loading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const loginAnonymously = async () => {
    setLoading(true);
    setError(null);

    try {
      const deviceId = await getDeviceId();
      const ipAddress = await getUserIP();

      const { data, error: loginError } = await anonymousLogin(deviceId);

      if (loginError) throw new Error(loginError.message);

      if (data.user) {
        await createUserProfile(data.user.id, deviceId, ipAddress);

        setUser({
          id: data.user.id,
          anonymous: true,
          deviceId,
        });
      }
    } catch (err) {
      console.error("Anonymous login error:", err);
      setError(
        err instanceof Error ? err.message : "Unknown anonymous login error"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loginAnonymously,
    loading,
    error,
  };
}
