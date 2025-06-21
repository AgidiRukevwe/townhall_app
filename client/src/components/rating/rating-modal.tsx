import { useState, useEffect } from "react";
import { ArrowLeft, LogIn } from "lucide-react";
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
// import { useAuth } from "@/hooks/use-auth.tsx";
import { Icon } from "../ui/icon";
import { useAuth } from "@/hooks/auth-hooks/use-auth-updated";

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
  const { user, loading } = useAuth();

  // Initialize sector ratings when modal opens
  useEffect(() => {
    if (open && sectors.length > 0 && Object.keys(sectorRatings).length === 0) {
      const initialRatings: Record<string, number> = {};
      sectors.forEach((sector) => {
        initialRatings[sector.id] = 50;
      });
      setSectorRatings(initialRatings);
    }
  }, [open, sectors]);

  const handleSectorRatingChange = (sectorId: string, value: number) => {
    setSectorRatings((prev) => ({ ...prev, [sectorId]: value }));
  };

  const handleSubmit = () => {
    const sectorRatingsArray = Object.entries(sectorRatings).map(
      ([sectorId, rating]) => ({ sectorId, rating })
    );

    console.log(
      "Submitting ratings",
      officialId,
      overallRating,
      sectorRatingsArray
    );

    submitRating(
      { officialId, overallRating, sectorRatings: sectorRatingsArray },
      {
        onSuccess: () => {
          toast({
            title: "Rating submitted",
            description: `Your rating for ${officialName} has been recorded.`,
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

  const resetModal = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setOverallRating(50);
      setSectorRatings({});
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[358px] md:max-w-md bg-white rounded-3xl "
        style={{ borderRadius: "1.5rem" }}
      >
        <DialogHeader className="justify-center  mb-6">
          {user && step === 2 && (
            <Icon
              onClick={() => setStep(1)}
              name="ArrowCircleLeft2"
              size={24}
              variant="Linear"
              color="#737373"
              className="items-center absolute left-4 top-4 cursor-pointer"
            />
          )}

          {user && (
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-1">
                {[1, 2].map((s) => (
                  <span
                    key={s}
                    className={`h-1 w-4 rounded-full transition-all ${
                      step >= s ? "bg-primary" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </DialogHeader>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {step === 1 ? (
              <>
                <DialogTitle className="text-center text-lg mb-4">
                  How would you rate their overall job performance?
                </DialogTitle>

                <div className="flex justify-center mb-8">
                  <span className="text-5xl font-bold">
                    {overallRating}
                    <span className="text-4xl">%</span>
                  </span>
                </div>

                <RatingSlider
                  value={overallRating}
                  onChange={setOverallRating}
                />

                <DialogFooter className="mt-8">
                  <Button variant="outline" onClick={resetModal}>
                    Cancel
                  </Button>
                  <Button onClick={() => setStep(2)}>Continue</Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogTitle className="text-center text-lg mb-4">
                  How would you rate their performance in these sectors?
                </DialogTitle>

                <div className="space-y-6 max-h-[50vh] scro overflow-y-auto py-2 px-1">
                  {sectors.map((sector) => (
                    <div key={sector.id}>
                      <div className="flex justify-between mb-2">
                        <label className="block text-xs font-medium text-gray-700">
                          {sector.name}
                        </label>
                      </div>
                      <RatingSlider
                        value={sectorRatings[sector.id] || 50}
                        onChange={(value: number) =>
                          handleSectorRatingChange(sector.id, value)
                        }
                      />
                    </div>
                  ))}
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    onClick={resetModal}
                    disabled={isPending}
                    className="rounded-full border border-gray-300 px-6 w-full mt-2 md:mt-0 sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="black"
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="rounded-full px-6 w-full sm:w-auto"
                  >
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
