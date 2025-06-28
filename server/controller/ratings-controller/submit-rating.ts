import { Request, Response } from "express";
import { storage } from "server/services/storage";
import { z } from "zod";

export const submitRating = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const schema = z.object({
      officialId: z.string().uuid(),
      overallRating: z.number().min(0).max(100),
      sectorRatings: z.array(
        z.object({
          sectorId: z.string().uuid(),
          rating: z.number().min(0).max(100),
        })
      ),
    });

    const data = schema.parse(req.body);
    const result = await storage.submitRating({ ...data, userId: req.user.id });
    console.log(data);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to submit rating", error });
  }
};
