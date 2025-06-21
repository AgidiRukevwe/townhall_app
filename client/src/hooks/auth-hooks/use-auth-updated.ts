import { useGoogleAuth } from "./use-google-auth";
import { useEmailAuth } from "./use-email-auth";

import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAnonymousAuth } from "./use-anonymous-auth";

export function useAuth() {
  const { user, setUser, setLoading } = useAuthStore();

  const google = useGoogleAuth();
  const email = useEmailAuth();
  const anonymous = useAnonymousAuth();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const supabaseUser = session.user;
          setUser({
            id: supabaseUser.id,
            deviceId: supabaseUser.user_metadata?.device_id ?? "unknown",
            anonymous: !supabaseUser.email,
            email: supabaseUser.email ?? "",
            username: supabaseUser.user_metadata.username,
          });
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUser]);

  return {
    user,
    loading: google.loading || email.loading || anonymous.loading,
    error: google.error || email.error || anonymous.error,
    loginWithGoogle: google.loginWithGoogle,
    handleOAuthRedirect: google.handleOAuthRedirect,
    loginWithEmail: email.loginWithEmail,
    registerWithEmail: email.registerWithEmail,
    loginAnonymously: anonymous.loginAnonymously,
    logout: async () => {
      await supabase.auth.signOut();
      // setUser(null);

      // useAuthStore.setState({
      //   user: null,
      //   initialized: false,
      //   loading: false,
      // });
      // localStorage.removeItem("auth-storage");
    },
  };
}
