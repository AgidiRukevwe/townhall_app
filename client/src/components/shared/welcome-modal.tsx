"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import WelcomeImage from "../../public/assets/welcome-image.svg";
import { useBreakpoint } from "@/hooks/use-breakpoints";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function WelcomeModal({
  isOpen,
  onClose,
  onContinue,
}: WelcomeModalProps) {
  const features = [
    "See who represents you",
    "Rate your leaders overall and by sector",
    "View public sentiment over time",
  ];

  const isMobile = useBreakpoint();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* // <Dialog open={isOpen}> */}
      <DialogContent
        className="w-[340px] md:w-[450px] bg-white rounded-xl md:rounded-3xl p-2 md:p-4"
        style={{ borderRadius: isMobile ? "1.2rem" : "1.5rem" }}
        showClose={false}
      >
        <div className="relative">
          <div className="relative p-2">
            {/* Header */}
            <div className="text-left mb-8">
              <h1 className="text-xl md:text-2xl font-medium text-left">
                👋 Welcome to Townhall
              </h1>
            </div>
            <div className="w-full rounded-2xl">
              <img src={WelcomeImage} alt="Welcome Image" className="mb-4" />
            </div>
            {/* Description */}
            <div className="mb-8">
              <p className="text-text-secondary text-sm mb-6">
                Hey there — welcome! This is a stripped-down proof of concept,
                built to test a simple idea: what if tracking and rating your
                leaders transparently could actually lead to real
                accountability?
              </p>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-4 text-text-primary">
                  You can:
                </h3>
                <ul className="space-y-1">
                  {features.map((text, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-1 h-1 bg-text-secondary rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-text-secondary text-sm">
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-text-secondary text-sm">
                <p className="mb-2">
                  Some features are still in progress — your feedback helps
                  shape what comes next.
                </p>
                <p className="flex items-center text-sm">
                  Thanks for being part of the experiment{" "}
                  <span
                    className="ml-1 text-yellow-500"
                    role="img"
                    aria-label="heart"
                  >
                    💛
                  </span>
                </p>
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-end">
              <Button onClick={onContinue}>Continue</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
