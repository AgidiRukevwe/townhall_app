import { Express } from "express";
import { storage } from "server/services/storage";

export function officialsRoutes(app: Express) {
  app.get("/api/officials", async (req, res) => {
    try {
      const { location, category, search } = req.query;
      const officials = await storage.getOfficials({
        location: location as string,
        category: category as string,
        search: search as string,
      });
      res.json(officials);
    } catch (error) {
      console.error("Error fetching officials:", error);
      res.status(500).json({
        message: "Failed to fetch officials",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.get("/api/officials/:id", async (req, res) => {
    try {
      const official = await storage.getOfficialById(req.params.id);
      if (!official)
        return res.status(404).json({ message: "Official not found" });
      res.json(official);
    } catch (error) {
      console.error("Error fetching official:", error);
      res.status(500).json({ message: "Failed to fetch official" });
    }
  });
}
