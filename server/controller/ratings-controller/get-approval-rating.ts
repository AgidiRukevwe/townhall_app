import { Request, Response } from "express";
import { ApprovalData } from "@shared/schema";
import { storage } from "server/services/storage";

type PeriodKey = "1 Dy" | "1 Wk" | "1 Yr" | "This year";

export const getApprovalRatings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ratingsData = await storage.getOfficialRatings(id);

    if (!ratingsData.timeData) {
      return res.status(404).json({ message: "No time data available" });
    }

    const approvalData: ApprovalData = {
      officialId: id,
      overallApprovalRating: ratingsData.overallRating,
      overallRatingsByPeriod: {},
      sectorRatings: {},
    };

    Object.entries(ratingsData.timeData.periods).forEach(([period, data]) => {
      approvalData.overallRatingsByPeriod[period] = {
        timeLabels: data.label,
        data: data.data,
      };
    });

    ratingsData.sectorRatings.forEach((sector) => {
      approvalData.sectorRatings[sector.name] = {
        sectorId: sector.name.toLowerCase().replace(/\s+/g, "_"),
        color: sector.color,
        overallRating: sector.rating,
        ratingsByPeriod: {},
      };

      Object.entries(ratingsData?.timeData?.sectorData ?? {}).forEach(
        ([period, sectors]) => {
          const sectorData = (sectors as any)[sector.name];
          if (sectorData) {
            approvalData.sectorRatings[sector.name].ratingsByPeriod[period] = {
              timeLabels:
                ratingsData.timeData?.periods[period as PeriodKey].label ?? [],
              data: sectorData.data,
            };
          }
        }
      );
    });

    res.json(approvalData);
  } catch (error) {
    res.status(500).json({ message: "Error getting approval ratings", error });
  }
};
