import { Request, Response } from "express";
import { storage } from "server/services/storage";

type PeriodKey = "1 Dy" | "1 Wk" | "1 Yr" | "This year";

export const getPerformance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { sector, period } = req.query;
    const ratingsData = await storage.getOfficialRatings(id);
    const response: any = {
      officialId: id,
      overallRating: ratingsData.overallRating,
    };

    if (!sector && !period) return res.json(ratingsData);

    if (period && typeof period === "string") {
      if (!ratingsData.timeData?.periods[period as PeriodKey]) {
        return res.status(400).json({ message: `Invalid period: ${period}` });
      }

      response.timePeriod = period;
      response.timeLabels =
        ratingsData.timeData.periods[period as PeriodKey].label;

      if (sector && typeof sector === "string") {
        const sectorData = Object.entries(
          ratingsData.timeData.sectorData[period as PeriodKey]
        ).find(([key]) => key.toLowerCase() === sector.toLowerCase());

        if (!sectorData) {
          return res
            .status(404)
            .json({ message: `No data for sector: ${sector}` });
        }

        const [sectorName, data] = sectorData;
        Object.assign(response, {
          sector: sectorName,
          sectorId: data.sectorId,
          color: data.color,
          data: data.data,
        });
      } else {
        response.allSectors =
          ratingsData.timeData.sectorData[period as PeriodKey];
        response.overallData =
          ratingsData.timeData.periods[period as PeriodKey].data;
      }
    } else if (sector && typeof sector === "string") {
      const sectorAllPeriods: any = {};
      Object.entries(ratingsData.timeData?.sectorData ?? {}).forEach(
        ([periodKey, periodData]) => {
          const sectorData = Object.entries(periodData).find(
            ([key]) => key.toLowerCase() === sector.toLowerCase()
          );
          if (sectorData) {
            const [, data] = sectorData;
            sectorAllPeriods[periodKey] = {
              sectorId: data.sectorId,
              color: data.color,
              data: data.data,
              timeLabels:
                ratingsData.timeData?.periods[periodKey as PeriodKey].label,
            };
          }
        }
      );
      response.sector = sector;
      response.allPeriods = sectorAllPeriods;
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Error getting performance", error });
  }
};
