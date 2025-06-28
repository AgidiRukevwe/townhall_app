import { Request, Response } from "express";
import { storage } from "server/services/storage";

export const getOfficials = async (req: Request, res: Response) => {
  try {
    const { location, category, search } = req.query;
    const officials = await storage.getOfficials({
      location: location as string,
      category: category as string,
      search: search as string,
    });

    res.json(officials);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch officials",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getOfficialById = async (req: Request, res: Response) => {
  try {
    const official = await storage.getOfficialById(req.params.id);
    if (!official) {
      return res.status(404).json({ message: "Official not found" });
    }
    res.json(official);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch official" });
  }
};

export const getRatings = async (req: Request, res: Response) => {
  try {
    const ratingSummary = await storage.getOfficialRatings(req.params.id);
    res.json(ratingSummary);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
};
