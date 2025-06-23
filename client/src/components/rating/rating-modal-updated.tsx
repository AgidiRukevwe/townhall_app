"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, SkipForward, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useSubmitRating } from "@/hooks/use-ratings";
import { useToast } from "@/hooks/util-hooks/use-toast";
// import { useAuth } from "@/hooks/use-auth.tsx";
import { Sector } from "@shared/schema";
import { Icon } from "../ui/icon";
import { useRatingModalStore } from "@/store/rating-store";
import { useSelectedOfficialStore } from "@/store/selected-official-store";
import { useAuthStore } from "@/store/auth-store";
import { useOfficialsStore } from "@/store/officials-store";
import { truncateText } from "@/utils/truncate-text";
import { toTitleCase } from "@/utils/to-title-case";
import { useBreakpoint } from "@/hooks/util-hooks/use-breakpoints";
import { OfficialAvatar } from "../officials/official-avatar";

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  officialId: string;
  officialName: string;
  officialTitle: string;
  officialLocation: string;
  officialAvatar?: string;
  sectors: Sector[];
}

const ratingOptions = [
  {
    label: "Outstanding",
    value: 90,
    color: "bg-blue-500 border-blue-500 text-blue-600",
  },
  {
    label: "Effective",
    value: 75,
    color: "bg-gray-100 border-gray-300 text-gray-700",
  },
  {
    label: "Satisfactory",
    value: 60,
    color: "bg-gray-100 border-gray-300 text-gray-700",
  },
  {
    label: "Underperforming",
    value: 40,
    color: "bg-gray-100 border-gray-300 text-gray-700",
  },
  {
    label: "Failing",
    value: 20,
    color: "bg-gray-100 border-gray-300 text-gray-700",
  },
];

// Mock data
const now = null;

const mockSectors: Sector[] = [
  { id: "1", name: "Healthcare", createdAt: now },
  { id: "2", name: "Education", createdAt: now },
  { id: "3", name: "Infrastructure", createdAt: now },
  { id: "4", name: "Economy", createdAt: now },
  { id: "5", name: "Security", createdAt: now },
  { id: "6", name: "Environment", createdAt: now },
  { id: "7", name: "Agriculture", createdAt: now },
  { id: "8", name: "Technology", createdAt: now },
  { id: "9", name: "Transportation", createdAt: now },
  { id: "10", name: "Housing", createdAt: now },
];

export function RatingModal({
  sectors = mockSectors as any,
}: Partial<RatingModalProps>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [sectorRatings, setSectorRatings] = useState<Record<string, number>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = sectors.length;
  const currentSector = sectors[currentStep];
  const isLastStep = currentStep === totalSteps - 1;

  const { mutate: submitRating, isPending } = useSubmitRating();
  const { toast } = useToast();
  const { user, loading } = useAuthStore();
  const { isOpen: open, closeModal } = useRatingModalStore();

  const { official } = useSelectedOfficialStore();
  const isMobile = useBreakpoint();

  // Initialize sector ratings when modal opens`
  useEffect(() => {
    if (open && sectors.length > 0) {
      const initialRatings: Record<string, number> = {};
      sectors.forEach((sector) => {
        initialRatings[sector.id] = 0; // 0 means no rating selected
      });
      setSectorRatings(initialRatings);
      setCurrentStep(0);
    }
  }, [open, sectors]);

  useEffect(() => {
    console.log(official), [];
  });

  const handleRatingSelect = (sectorId: string, value: number) => {
    setSectorRatings((prev) => ({ ...prev, [sectorId]: value }));
  };

  const handleSubmit = () => {
    const sectorRatingsArray = Object.entries(sectorRatings).map(
      ([sectorId, rating]) => ({ sectorId, rating })
    );

    const overallRating =
      sectorRatingsArray.length > 0
        ? Math.round(
            sectorRatingsArray.reduce((sum, rating) => sum + rating.rating, 0) /
              sectorRatingsArray.length
          )
        : 50;

    console.log(
      "Submitting ratings",
      official?.id,
      overallRating,
      sectorRatingsArray
    );
    submitRating(
      {
        officialId: official?.id ?? "",
        overallRating,
        sectorRatings: sectorRatingsArray,
      },
      {
        onSuccess: () => {
          toast({
            title: "Rating submitted",
            description: `Your rating for ${official?.name} has been recorded.`,
          });
          resetModal();
        },
        onError: (error) => {
          toast({
            title: "Error submitting rating",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    if (currentSector) {
      setSectorRatings((prev) => ({ ...prev, [currentSector.id]: 0 }));
    }
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const resetModal = () => {
    // onOpenChange(false)
    closeModal();
    setTimeout(() => {
      setCurrentStep(0);
      setSectorRatings({});
    }, 300);
  };

  if (!currentSector) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent
        showClose={false}
        className="w-auto flex flex-col h-auto  bg-surface-secondary border-2 border-white rounded-3xl p-0 gap-0 overflow-y-auto hide-scrollbar"
        style={{ borderRadius: "1.5rem" }}
      >
        {/* Header */}

        <div className="flex items-center justify-between p-6 pb-6">
          <h1 className="text-xl font-semibold text-text-primary">
            Rate your leader
          </h1>
          <Icon
            name="CloseCircle"
            color="#737373"
            onClick={resetModal}
            className="cursor-pointer"
          />
        </div>

        <div className="relative px-6 pb-2">
          {/* Leader Profile */}
          <div className="flex items-center gap-2 mb-6">
            {/* <div className="relative">
              <div className="w-20 h-20 bg-surface-brand/10 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-surface-brand text-2xl font-medium">
                  🇳🇬
                </span>
              </div>
            </div> */}
            {official && (
              <div className="w-16 h-16 rounded-full overflow-hidden bg-transparent relative">
                <img
                  src={official.imageUrl ?? ""}
                  alt={official.name}
                  className={`absolute w-full h-full rounded-full scale-150 bg-surface-brand/20 left-1/2 top-1/2 brightness-120   group-hover:border-white group-hover:border-[4px] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out`}
                  style={{
                    objectFit: "cover",
                    objectPosition: "center 20%",
                  }}
                />
              </div>
              // <OfficialAvatar
              //   official={{
              //     name: official?.name,
              //     approvalRating: official?.approvalRating,
              //     imageUrl: official.imageUrl,
              //   }}
              //   height={isMobile ? "h-16" : "h-32"}
              //   width={isMobile ? "w-16" : "w-32"}
              //   showAvatar={true}
              // />
            )}
            <div>
              <h2 className="text-base font-semibold text-text-primary">
                {truncateText(toTitleCase(official?.name ?? ""), 50)}
              </h2>
              <p className="text-text-secondary text-sm">
                {truncateText(official?.location ?? "", isMobile ? 20 : 30)}
              </p>
            </div>
          </div>

          {/* The Survey section */}

          <div className="bg-white rounded-2xl p-4 mb-6 h-96 overflow-y-auto flex-grow hide-scrollbar">
            {/* Progress */}
            <div className="pb-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs  font-medium text-text-secondary">
                  Sectors {currentStep + 1} of {totalSteps}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1">
                <div
                  className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentStep + 1) / totalSteps) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question Content */}
            <div className="pb-4">
              <h3 className="text-base font-semibold text-text-primary mb-8">
                How would you rate their performance in{" "}
                {currentSector.name.toLowerCase()}
              </h3>

              {/* Rating Options */}
              <div className="flex flex-col space-y-2 ">
                {ratingOptions.map((option) => {
                  const isSelected =
                    sectorRatings[currentSector.id] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleRatingSelect(currentSector.id, option.value)
                      }
                      className={`w-[50%] px-4 py-3 rounded-full border-[1px] text-left font-medium transition-all ${
                        isSelected
                          ? "bg-blue-50 border-surface-brand  text-text-brand"
                          : "bg-transparent border-gray-200 text-text-primary hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                        {isSelected && (
                          <Icon name="TickCircle" size={16} color="#007aff" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary"
            >
              <Icon name="ArrowCircleLeft" size={16} color="#737373" />
              Previous
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="flex items-center gap-2 rounded-full px-6"
              >
                Skip
                <Icon name="Forward" size={16} color="#737373" />
              </Button>

              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 rounded-full px-6"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : isLastStep ? (
                  "Submit"
                ) : (
                  <>
                    Next
                    <Icon name="ArrowCircleRight" size={16} color="#fff" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
