import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth-hooks/use-auth-updated";
import { useAuthStore } from "@/store/auth-store";

import React, { useEffect } from "react";
import { useLocation } from "wouter";

function TestPage() {
  const { loginWithGoogle, loading, handleOAuthRedirect } = useAuth();

  const { user, initialize } = useAuthStore();

  const [location, navigate] = useLocation();

  useEffect(() => {
    if (user) {
      // navigate("/");
      console.log(user.username, "is logged in");
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      // Redirect handled by useEffect
    } catch (error: any) {
      alert("Google sign-in failed: " + error.message);
    }
  };
  return (
    <div>
      {!user && (
        <Button onClick={handleGoogleSignIn}>Sign in with google</Button>
      )}
    </div>
  );
}

export default TestPage;
