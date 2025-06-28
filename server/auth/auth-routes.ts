import { Express } from "express";
import passport from "passport";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAuthenticatedUser,
} from "./auth-controller";

export function registerAuthRoutes(app: Express) {
  app.post("/api/register", registerUser);
  app.post("/api/login", passport.authenticate("local"), loginUser);
  app.post("/api/logout", logoutUser);
  app.get("/api/user", getAuthenticatedUser);
}
