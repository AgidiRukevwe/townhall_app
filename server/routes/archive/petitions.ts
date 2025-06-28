import { Express } from "express";

export function petitionsRoutes(app: Express) {
  app.post("/api/petitions", (req, res) => {
    res.status(501).json({ message: "Petitions feature coming soon" });
  });
}
