import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuthStore();

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (signInError) throw new Error(signInError.message);

      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to login with Google";
      setError(message);
      console.error("Google login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthRedirect = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      setError(sessionError.message);
      console.log("Error getting session", sessionError);
      return;
    }

    if (session) {
      const supaUser = session.user;

      // Prepare user data
      const userPayload = {
        id: supaUser.id,
        device_id: supaUser.user_metadata?.device_id ?? "google",
        username:
          supaUser.user_metadata?.full_name ??
          supaUser.email?.split("@")[0] ??
          "unknown",
        provider: "google",
        email: supaUser.email ?? "",
        password: null, // Google users won't have this
        is_anonymous: false,
      };

      // Upsert into `users` table
      const { error: upsertError } = await supabase
        .from("users")
        .upsert(userPayload, { onConflict: "id" });

      if (upsertError) {
        console.error("Failed to upsert user:", upsertError);
        setError(upsertError.message);
        return;
      }

      // Update local auth state
      setUser({
        id: userPayload.id,
        anonymous: false,
        deviceId: userPayload.device_id,
      });
    }
  };

  return {
    loginWithGoogle,
    handleOAuthRedirect,
    loading,
    error,
  };
}

// import { useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { useAuthStore } from "@/store/auth-store";

// export function useGoogleAuth() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const { setUser } = useAuthStore();

//   const loginWithGoogle = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const { data, error: signInError } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//         options: {
//           redirectTo: `${window.location.origin}/auth/callback`,
//         },
//       });

//       if (signInError) throw new Error(signInError.message);

//       return data;
//     } catch (err) {
//       const message =
//         err instanceof Error ? err.message : "Failed to login with Google";
//       setError(message);
//       console.error("Google login error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOAuthRedirect = async () => {
//     const {
//       data: { session },
//       error: sessionError,
//     } = await supabase.auth.getSession();

//     if (sessionError) {
//       setError(sessionError.message);
//       return;
//     }

//     if (session) {
//       const { user } = session;

//       setUser({
//         id: user.id,
//         anonymous: false,
//         deviceId: user.user_metadata?.device_id ?? "google",
//         // email: user.email ?? "",
//         // name: user.user_metadata?.full_name ?? "",
//       });
//     }
//   };

//   return {
//     loginWithGoogle,
//     handleOAuthRedirect,
//     loading,
//     error,
//   };
// }
