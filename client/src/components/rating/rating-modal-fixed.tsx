import { useState } from "react";
import { X, ArrowLeft, LogIn } from "lucide-react";
import { RatingSlider } from "./rating-slider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSubmitRating } from "@/hooks/use-ratings";
import { useToast } from "@/hooks/use-toast";
import { Sector } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth.tsx";
import { Link } from "wouter";

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  officialId: string;
  officialName: string;
  sectors: Sector[];
}

export function RatingModal({
  open,
  onOpenChange,
  officialId,
  officialName,
  sectors,
}: RatingModalProps) {
  const [step, setStep] = useState(1);
  const [overallRating, setOverallRating] = useState(50);
  const [sectorRatings, setSectorRatings] = useState<Record<string, number>>(
    {}
  );
  const { mutate: submitRating, isPending } = useSubmitRating();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();

  // Initialize sector ratings if they haven't been set yet
  if (sectors.length > 0 && Object.keys(sectorRatings).length === 0) {
    const initialRatings: Record<string, number> = {};
    sectors.forEach((sector) => {
      initialRatings[sector.id] = 50;
    });
    setSectorRatings(initialRatings);
  }

  const handleSectorRatingChange = (sectorId: string, value: number) => {
    setSectorRatings((prev) => ({
      ...prev,
      [sectorId]: value,
    }));
  };

  const handleSubmit = () => {
    const sectorRatingsArray = Object.entries(sectorRatings).map(
      ([sectorId, rating]) => ({
        sectorId,
        rating,
      })
    );

    submitRating(
      {
        officialId,
        overallRating,
        sectorRatings: sectorRatingsArray,
      },
      {
        onSuccess: () => {
          toast({
            title: "Rating submitted",
            description: `Your rating for ${officialName} has been recorded.`,
            variant: "success",
            showClose: false,
          });
          onOpenChange(false);
          setStep(1);
          setOverallRating(50);
          setSectorRatings({});
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

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setOverallRating(50);
      setSectorRatings({});
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {user && step === 2 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-4"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>

          {/* Progress bar (only show when authenticated) */}
          {user && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
              <div
                className="bg-primary h-1.5 rounded-full"
                style={{ width: step === 1 ? "50%" : "100%" }}
              ></div>
            </div>
          )}
        </DialogHeader>

        {/* Authentication check */}
        {!user && !isLoading ? (
          <>
            <DialogTitle className="text-center text-xl mb-4">
              Authentication Required
            </DialogTitle>

            <DialogDescription className="text-center mb-6">
              Please log in to rate public officials and contribute to
              transparency.
            </DialogDescription>

            <div className="flex flex-col items-center justify-center py-4">
              <LogIn className="h-12 w-12 text-primary mb-4" />
              <p className="text-center text-sm text-gray-600 mb-6">
                Your ratings help other citizens make informed decisions and
                hold officials accountable.
              </p>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  handleClose();
                  window.location.href = "/login";
                }}
              >
                Log in
              </Button>
            </DialogFooter>
          </>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          /* User is authenticated, show the rating interface */
          <>
            {step === 1 ? (
              /* Step 1: Overall Rating */
              <>
                <DialogTitle className="text-center text-xl mb-6">
                  How would you rate their overall job performance?
                </DialogTitle>

                <div className="flex justify-center mb-8">
                  <span className="text-7xl font-bold">
                    {overallRating}
                    <span className="text-4xl">%</span>
                  </span>
                </div>

                <RatingSlider
                  value={overallRating}
                  onChange={setOverallRating}
                />

                <DialogFooter className="mt-8">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button onClick={() => setStep(2)}>Continue</Button>
                </DialogFooter>
              </>
            ) : (
              /* Step 2: Sector Ratings */
              <>
                <DialogTitle className="text-center text-xl mb-6">
                  How would you rate their performance in these sectors?
                </DialogTitle>

                <div className="space-y-6 max-h-[50vh] overflow-y-auto py-2 px-1">
                  {sectors.map((sector) => (
                    <div key={sector.id}>
                      <div className="flex justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {sector.name}
                        </label>
                      </div>
                      <RatingSlider
                        value={sectorRatings[sector.id] || 50}
                        onChange={(value) =>
                          handleSectorRatingChange(sector.id, value)
                        }
                      />
                    </div>
                  ))}
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={isPending}>
                    {isPending ? "Submitting..." : "Submit ratings"}
                  </Button>
                </DialogFooter>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
