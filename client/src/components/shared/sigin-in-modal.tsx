"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBreakpoint } from "@/hooks/use-breakpoints";
import GoogleLogo from "@/public/assets/illustrations/google-logo";
import SignInImage from "../../public/assets/sign-in-display.svg";
import { THLogo } from "../ui/th-logo";
import { useAuth } from "@/hooks/auth-hooks/use-auth-updated";
import { useSignInModalStore } from "@/store/signin-modal-store";

export function SignInModal() {
  const isMobile = useBreakpoint();

  const { isOpen, closeModal } = useSignInModalStore();

  const { loginWithGoogle, user, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (error: any) {
      alert("Google sign-in failed: " + error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent
        className="w-[90vw]  max-w-[650px] bg-white rounded-xl md:rounded-3xl p-2 overflow-hidden"
        style={{ borderRadius: isMobile ? "1.2rem" : "1.5rem" }}
        showClose={false}
      >
        <div className="flex flex-col md:flex-row min-h-[400px] md:min-h-[450px]">
          {/* Left side - Image placeholder */}
          <div className="w-full h-full md:w-1/2 relative bg-red-100 rounded-[16px]">
            {/* <div className="w-full h-48 md:h-full bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 relative overflow-hidden"></div> */}

            <div className="w-full h-full rounded-2xl overflow-hidden">
              <img
                src={SignInImage}
                alt="Sign in display image"
                className=" h-full w-full"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div className="flex flex-col items-center justify-center h-full">
              <THLogo />

              <div className="space-y-6 md:space-y-8 mt-8 md:mt-4 w-full">
                <div className="space-y-2 text-center">
                  <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
                    Quick sign-in to rate.
                  </h1>
                  <p className="text-text-secondary text-sm leading-tight">
                    One step closer to holding leaders accountable.
                  </p>
                </div>

                <div className="w-full flex justify-center md:pt-4">
                  <Button onClick={handleGoogleSignIn}>
                    <GoogleLogo />
                    Sign in
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom-fixed agreement text */}
            <div className="pt-6 text-center text-text-secondary text-xs w-full">
              By continuing you agree to use this app fairly.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
