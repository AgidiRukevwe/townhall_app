import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ratingSchema } from "../shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Test endpoint for database connection
  app.get('/api/db-test', async (req, res) => {
    try {
      // Just a ping to check database connectivity
      await storage.checkDatabaseConnection();
      res.json({ success: true, message: 'Database connection successful' });
    } catch (error) {
      console.error('Database connection test failed:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  // Officials routes
  app.get("/api/officials", async (req, res) => {
    try {
      const location = req.query.location as string | undefined;
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      
      const officials = await storage.getOfficials({
        location,
        category,
        search
      });
      
      res.json(officials);
    } catch (error) {
      console.error("Error fetching officials:", error);
      res.status(500).json({ message: "Failed to fetch officials" });
    }
  });

  app.get("/api/officials/:id", async (req, res) => {
    try {
      const official = await storage.getOfficialById(req.params.id);
      
      if (!official) {
        return res.status(404).json({ message: "Official not found" });
      }
      
      res.json(official);
    } catch (error) {
      console.error("Error fetching official:", error);
      res.status(500).json({ message: "Failed to fetch official" });
    }
  });

  // Ratings routes
  app.get("/api/officials/:id/ratings", async (req, res) => {
    try {
      const ratingSummary = await storage.getOfficialRatings(req.params.id);
      res.json(ratingSummary);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      res.status(500).json({ message: "Failed to fetch ratings" });
    }
  });

  app.post("/api/ratings", async (req, res) => {
    try {
      // Get userId from authenticated user or request body
      let userId = req.body.userId;
      
      // If user is authenticated, use their ID
      if (req.isAuthenticated()) {
        userId = req.user.id;
      } else if (!userId) {
        // If no userId provided and not authenticated
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Validate request body
      const ratingPayloadSchema = z.object({
        officialId: z.string().uuid(),
        overallRating: z.number().min(0).max(100),
        sectorRatings: z.array(z.object({
          sectorId: z.string().uuid(),
          rating: z.number().min(0).max(100)
        }))
      });
      
      const validatedData = ratingPayloadSchema.parse({
        officialId: req.body.officialId,
        overallRating: req.body.overallRating,
        sectorRatings: req.body.sectorRatings
      });
      
      // Submit rating with userId
      const result = await storage.submitRating({
        ...validatedData,
        userId
      });
      
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid rating data", 
          errors: error.errors 
        });
      }
      
      console.error("Error submitting rating:", error);
      res.status(500).json({ message: "Failed to submit rating" });
    }
  });
  
  // Petitions placeholder route
  app.post("/api/petitions", async (req, res) => {
    // This is a placeholder for the petitions feature
    res.status(501).json({ message: "Petitions feature coming soon" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
