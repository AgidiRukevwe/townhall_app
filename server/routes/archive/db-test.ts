import { Express } from "express";
import { storage } from "../../storage";

export function dbTestRoutes(app: Express) {
  app.get("/api/db-test", async (req, res) => {
    try {
      await storage.checkDatabaseConnection();
      res.json({ success: true, message: "Database connection successful" });
    } catch (error) {
      console.error("Database connection test failed:", error);
      res.status(500).json({
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}
