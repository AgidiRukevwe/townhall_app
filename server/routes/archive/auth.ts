import { Express } from "express";
import { setupAuth } from "../../auth";

export function authRoutes(app: Express) {
  setupAuth(app);
}
