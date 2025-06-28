// import { Express } from "express";
// import { authRoutes } from "./auth";
// import { dbTestRoutes } from "./db-test";
// import { officialsRoutes } from "./officials";
// import { ratingsRoutes } from "./ratings";
// import { performanceRoutes } from "./performance";
// import { petitionsRoutes } from "./petitions";

// export function registerRoutes(app: Express) {
//   authRoutes(app);
//   dbTestRoutes(app);
//   officialsRoutes(app);
//   ratingsRoutes(app);
//   performanceRoutes(app);
//   petitionsRoutes(app);
// }

import { Express } from "express";
import { createServer } from "http";
import { authenticate } from "../middleware/auth";
import { testDatabaseConnection } from "server/controller/db-controller";
import {
  getApprovalRatings,
  getPerformance,
  submitRating,
} from "server/controller/ratings-controller";
import {
  getOfficialById,
  getOfficials,
  getRatings,
} from "server/controller/officials-controller";
import { postPetition } from "server/controller/petitions-controller";
import { registerAuthRoutes } from "server/auth/auth-routes";
import { setupPassport } from "server/auth/auth-config";

export async function registerRoutes(app: Express) {
  setupPassport(app);
  registerAuthRoutes(app);

  app.get("/api/db-test", testDatabaseConnection);

  // Officials
  app.get("/api/officials", getOfficials);
  app.get("/api/officials/:id", getOfficialById);
  app.get("/api/officials/:id/ratings", getRatings);

  // Ratings
  app.get("/api/officials/:id/performance", getPerformance);
  app.get("/api/officials/:id/approval-ratings", getApprovalRatings);
  app.post("/api/ratings", authenticate, submitRating);
  // app.post("/api/ratings", submitRating);

  // Petitions
  app.post("/api/petitions", postPetition);

  return createServer(app);
}
