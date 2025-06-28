import { Express } from "express";
import { z } from "zod";
import { authenticate } from "../../middleware/auth";
import { storage } from "../../storage";

export function ratingsRoutes(app: Express) {
  app.get("/api/officials/:id/ratings", async (req, res) => {
    try {
      const data = await storage.getOfficialRatings(req.params.id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch ratings" });
    }
  });

  app.post("/api/ratings", authenticate, async (req, res) => {
    try {
      if (!req.user)
        return res.status(401).json({ message: "User not authenticated" });

      const ratingPayloadSchema = z.object({
        officialId: z.string().uuid(),
        overallRating: z.number().min(0).max(100),
        sectorRatings: z.array(
          z.object({
            sectorId: z.string().uuid(),
            rating: z.number().min(0).max(100),
          })
        ),
      });

      const validatedData = ratingPayloadSchema.parse(req.body);

      const result = await storage.submitRating({
        ...validatedData,
        userId: req.user.id,
      });

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}
