import { Request, Response } from "express";
import { storage } from "server/services/storage";

export const testDatabaseConnection = async (req: Request, res: Response) => {
  try {
    await storage.checkDatabaseConnection();
    res.json({ success: true, message: "Database connection successful" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
