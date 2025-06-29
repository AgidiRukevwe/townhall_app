import { Express } from "express";
// import { storage } from "../storage";

type PeriodKey = "1 Dy" | "1 Wk" | "1 Yr" | "This year";

export function performanceRoutes(app: Express) {
  app.get("/api/officials/:id/performance", async (req, res) => {
    // ... (Same logic from your performance route)
  });

  app.get("/api/officials/:id/approval-ratings", async (req, res) => {
    // ... (Same logic from your approval ratings route)
  });
}
