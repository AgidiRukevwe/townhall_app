// import type { Express } from "express";
// import { createServer, type Server } from "http";
// import { storage } from "./storage";
// import { ratingSchema } from "../shared/schema";
// import { z } from "zod";
// import { setupAuth } from "./auth";

// export async function registerRoutes(app: Express): Promise<Server> {
//   // Set up authentication routes
//   setupAuth(app);

//   // Test endpoint for database connection
//   app.get("/api/db-test", async (req, res) => {
//     try {
//       // Just a ping to check database connectivity
//       await storage.checkDatabaseConnection();
//       res.json({ success: true, message: "Database connection successful" });
//     } catch (error) {
//       console.error("Database connection test failed:", error);
//       res.status(500).json({
//         success: false,
//         message: "Database connection failed",
//         error: error instanceof Error ? error.message : String(error),
//       });
//     }
//   });
//   // Officials routes
//   app.get("/api/officials", async (req, res) => {
//     try {
//       const location = req.query.location as string | undefined;
//       const category = req.query.category as string | undefined;
//       const search = req.query.search as string | undefined;

//       console.log("Fetching officials with filters:", {
//         location,
//         category,
//         search,
//       });

//       const officials = await storage.getOfficials({
//         location,
//         category,
//         search,
//       });

//       console.log(`Successfully fetched ${officials.length} officials`);
//       res.json(officials);
//     } catch (error) {
//       console.error("Error fetching officials:", error);

//       // Send more detailed error information
//       const errorMessage =
//         error instanceof Error ? error.message : String(error);
//       const errorStack = error instanceof Error ? error.stack : undefined;

//       res.status(500).json({
//         message: "Failed to fetch officials",
//         error: errorMessage,
//         stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
//       });
//     }
//   });

//   app.get("/api/officials/:id", async (req, res) => {
//     try {
//       const official = await storage.getOfficialById(req.params.id);

//       if (!official) {
//         return res.status(404).json({ message: "Official not found" });
//       }

//       res.json(official);
//     } catch (error) {
//       console.error("Error fetching official:", error);
//       res.status(500).json({ message: "Failed to fetch official" });
//     }
//   });

//   // Ratings routes
//   app.get("/api/officials/:id/ratings", async (req, res) => {
//     try {
//       const ratingSummary = await storage.getOfficialRatings(req.params.id);
//       res.json(ratingSummary);
//     } catch (error) {
//       console.error("Error fetching ratings:", error);
//       res.status(500).json({ message: "Failed to fetch ratings" });
//     }
//   });

//   app.post("/api/ratings", async (req, res) => {
//     try {
//       // Check if user is authenticated
//       if (!req.isAuthenticated()) {
//         return res.status(401).json({ message: "Authentication required" });
//       }

//       // Use the authenticated user's ID
//       const userId = req.user.id;

//       // Validate request body
//       const ratingPayloadSchema = z.object({
//         officialId: z.string().uuid(),
//         overallRating: z.number().min(0).max(100),
//         sectorRatings: z.array(
//           z.object({
//             sectorId: z.string().uuid(),
//             rating: z.number().min(0).max(100),
//           })
//         ),
//       });

//       const validatedData = ratingPayloadSchema.parse({
//         officialId: req.body.officialId,
//         overallRating: req.body.overallRating,
//         sectorRatings: req.body.sectorRatings,
//       });

//       // Submit rating with userId from authenticated user
//       const result = await storage.submitRating({
//         ...validatedData,
//         userId,
//       });

//       console.log(
//         `Rating submitted for official ${validatedData.officialId} by user ${userId}`
//       );

//       res.status(201).json(result);
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         return res.status(400).json({
//           message: "Invalid rating data",
//           errors: error.errors,
//         });
//       }

//       console.error("Error submitting rating:", error);
//       res.status(500).json({ message: "Failed to submit rating" });
//     }
//   });

//   // Sector performance endpoint with time period and sector filtering
//   app.get("/api/officials/:id/performance", async (req, res) => {
//     type PeriodKey = "1 Dy" | "1 Wk" | "1 Yr" | "This year";

//     try {
//       const { id } = req.params;
//       const { sector, period } = req.query;

//       // Get the full ratings data
//       const ratingsData = await storage.getOfficialRatings(id);

//       // If no specific filtering requested, return all data
//       if (!sector && !period) {
//         return res.json(ratingsData);
//       }

//       // Handle filtering by time period and/or sector
//       const response: any = {
//         officialId: id,
//         overallRating: ratingsData.overallRating,
//       };

//       // If time period is specified
//       if (period && typeof period === "string") {
//         if (!ratingsData.timeData?.periods[period as PeriodKey]) {
//           return res.status(400).json({
//             message: `Invalid time period: ${period}. Valid options are: 1 Dy, 1 Wk, 1 Yr, This year`,
//           });
//         }

//         response.timePeriod = period;
//         response.timeLabels =
//           ratingsData.timeData.periods[period as PeriodKey].label;

//         // If both time period and sector are specified
//         if (sector && typeof sector === "string") {
//           // Check if the requested sector exists
//           const sectorExists = ratingsData.sectorRatings.some(
//             (s) => s.name.toLowerCase() === sector.toLowerCase()
//           );

//           if (!sectorExists) {
//             return res.status(400).json({
//               message: `Invalid sector: ${sector}. Valid options are: ${ratingsData.sectorRatings
//                 .map((s) => s.name)
//                 .join(", ")}`,
//             });
//           }

//           // Find the sector (case-insensitive match)
//           const sectorData = Object.entries(
//             ratingsData.timeData.sectorData[period as PeriodKey]
//           ).find(([key]) => key.toLowerCase() === sector.toLowerCase());

//           if (sectorData) {
//             const [sectorName, data] = sectorData;
//             response.sector = sectorName;
//             response.sectorId = data.sectorId;
//             response.color = data.color;
//             response.data = data.data;
//           } else {
//             return res.status(404).json({
//               message: `No data found for sector: ${sector} in period: ${period}`,
//             });
//           }
//         }
//         // If only time period is specified, return data for all sectors in that period
//         else {
//           response.allSectors =
//             ratingsData.timeData.sectorData[period as PeriodKey];
//           response.overallData =
//             ratingsData.timeData.periods[period as PeriodKey].data;
//         }
//       }
//       // If only sector is specified, return that sector's data for all time periods
//       else if (sector && typeof sector === "string") {
//         // Check if the requested sector exists
//         const sectorExists = ratingsData.sectorRatings.some(
//           (s) => s.name.toLowerCase() === sector.toLowerCase()
//         );

//         if (!sectorExists) {
//           return res.status(400).json({
//             message: `Invalid sector: ${sector}. Valid options are: ${ratingsData.sectorRatings
//               .map((s) => s.name)
//               .join(", ")}`,
//           });
//         }

//         // Get data for this sector across all time periods
//         const sectorAllPeriods: any = {};

//         Object.entries(ratingsData.timeData?.sectorData ?? {}).forEach(
//           ([periodKey, periodData]) => {
//             const sectorData = Object.entries(periodData).find(
//               ([key]) => key.toLowerCase() === sector.toLowerCase()
//             );

//             if (sectorData) {
//               const [_, data] = sectorData;
//               sectorAllPeriods[periodKey] = {
//                 sectorId: data.sectorId,
//                 color: data.color,
//                 data: data.data,
//                 timeLabels:
//                   ratingsData.timeData?.periods[periodKey as PeriodKey].label,
//               };
//             }
//           }
//         );

//         response.sector = sector;
//         response.allPeriods = sectorAllPeriods;
//       }

//       res.json(response);
//     } catch (error) {
//       console.error("Error fetching sector performance data:", error);
//       res.status(500).json({
//         message: "Failed to fetch sector performance data",
//         error: error instanceof Error ? error.message : String(error),
//       });
//     }
//   });

//   // Petitions placeholder route
//   app.post("/api/petitions", async (req, res) => {
//     // This is a placeholder for the petitions feature
//     res.status(501).json({ message: "Petitions feature coming soon" });
//   });

//   const httpServer = createServer(app);
//   return httpServer;
// }

type PeriodKey = "1 Dy" | "1 Wk" | "1 Yr" | "This year";

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
  app.get("/api/db-test", async (req, res) => {
    try {
      // Just a ping to check database connectivity
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
  // Officials routes
  app.get("/api/officials", async (req, res) => {
    try {
      const location = req.query.location as string | undefined;
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;

      console.log("Fetching officials with filters:", {
        location,
        category,
        search,
      });

      const officials = await storage.getOfficials({
        location,
        category,
        search,
      });

      console.log(`Successfully fetched ${officials.length} officials`);
      res.json(officials);
    } catch (error) {
      console.error("Error fetching officials:", error);

      // Send more detailed error information
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      res.status(500).json({
        message: "Failed to fetch officials",
        error: errorMessage,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
      });
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

  // Sector performance endpoint with time period and sector filtering
  app.get("/api/officials/:id/performance", async (req, res) => {
    try {
      const { id } = req.params;
      const { sector, period } = req.query;

      // Get the full ratings data
      const ratingsData = await storage.getOfficialRatings(id);

      // If no specific filtering requested, return all data
      if (!sector && !period) {
        return res.json(ratingsData);
      }

      // Handle filtering by time period and/or sector
      const response: any = {
        officialId: id,
        overallRating: ratingsData.overallRating,
      };

      // If time period is specified
      if (period && typeof period === "string") {
        if (!ratingsData.timeData?.periods[period as PeriodKey]) {
          return res
            .status(400)
            .json({
              message: `Invalid time period: ${period}. Valid options are: 1 Dy, 1 Wk, 1 Yr, This year`,
            });
        }

        response.timePeriod = period;
        response.timeLabels =
          ratingsData.timeData.periods[period as PeriodKey].label;

        // If both time period and sector are specified
        if (sector && typeof sector === "string") {
          // Check if the requested sector exists
          const sectorExists = ratingsData.sectorRatings.some(
            (s) => s.name.toLowerCase() === sector.toLowerCase()
          );

          if (!sectorExists) {
            return res.status(400).json({
              message: `Invalid sector: ${sector}. Valid options are: ${ratingsData.sectorRatings
                .map((s) => s.name)
                .join(", ")}`,
            });
          }

          // Find the sector (case-insensitive match)
          const sectorData = Object.entries(
            ratingsData.timeData.sectorData[period as PeriodKey]
          ).find(([key]) => key.toLowerCase() === sector.toLowerCase());

          if (sectorData) {
            const [sectorName, data] = sectorData;
            response.sector = sectorName;
            response.sectorId = data.sectorId;
            response.color = data.color;
            response.data = data.data;
          } else {
            return res
              .status(404)
              .json({
                message: `No data found for sector: ${sector} in period: ${period}`,
              });
          }
        }
        // If only time period is specified, return data for all sectors in that period
        else {
          response.allSectors =
            ratingsData.timeData.sectorData[period as PeriodKey];
          response.overallData =
            ratingsData.timeData.periods[period as PeriodKey].data;
        }
      }
      // If only sector is specified, return that sector's data for all time periods
      else if (sector && typeof sector === "string") {
        // Check if the requested sector exists
        const sectorExists = ratingsData.sectorRatings.some(
          (s) => s.name.toLowerCase() === sector.toLowerCase()
        );

        if (!sectorExists) {
          return res.status(400).json({
            message: `Invalid sector: ${sector}. Valid options are: ${ratingsData.sectorRatings
              .map((s) => s.name)
              .join(", ")}`,
          });
        }

        // Get data for this sector across all time periods
        const sectorAllPeriods: any = {};

        Object.entries(ratingsData.timeData?.sectorData ?? {}).forEach(
          ([periodKey, periodData]) => {
            const sectorData = Object.entries(periodData).find(
              ([key]) => key.toLowerCase() === sector.toLowerCase()
            );

            if (sectorData) {
              const [_, data] = sectorData;
              sectorAllPeriods[periodKey] = {
                sectorId: data.sectorId,
                color: data.color,
                data: data.data,
                timeLabels:
                  ratingsData.timeData?.periods[periodKey as PeriodKey].label,
              };
            }
          }
        );

        response.sector = sector;
        response.allPeriods = sectorAllPeriods;
      }

      res.json(response);
    } catch (error) {
      console.error("Error fetching sector performance data:", error);
      res.status(500).json({
        message: "Failed to fetch sector performance data",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // New approval ratings endpoint with your desired format
  app.get("/api/officials/:id/approval-ratings", async (req, res) => {
    try {
      const { id } = req.params;

      // Get the full ratings data
      const ratingsData = await storage.getOfficialRatings(id);

      if (!ratingsData.timeData) {
        return res
          .status(404)
          .json({ message: "Time-based data not available" });
      }

      // Transform to your desired format
      const approvalData = {
        officialId: id,
        overallApprovalRating: ratingsData.overallRating,
        overallRatingsByPeriod: {} as any,
        sectorRatings: {} as any,
      };

      // Build overallRatingsByPeriod
      Object.entries(ratingsData.timeData.periods).forEach(
        ([period, periodData]) => {
          approvalData.overallRatingsByPeriod[period] = {
            timeLabels: periodData.label,
            data: periodData.data,
          };
        }
      );

      // Build sectorRatings
      ratingsData.sectorRatings.forEach((sector: any) => {
        const sectorName = sector.name;

        approvalData.sectorRatings[sectorName] = {
          sectorId: sectorName.toLowerCase().replace(/\s+/g, "_"),
          color: sector.color,
          overallRating: sector.rating,
          ratingsByPeriod: {} as any,
        };

        // Add period data for this sector
        Object.entries(ratingsData.timeData?.sectorData ?? {}).forEach(
          ([period, sectorData]) => {
            const sectorPeriodData = (sectorData as any)[sectorName];
            if (sectorPeriodData) {
              approvalData.sectorRatings[sectorName].ratingsByPeriod[period] = {
                timeLabels:
                  ratingsData.timeData?.periods[period as PeriodKey].label,
                data: sectorPeriodData.data,
              };
            }
          }
        );
      });

      res.json(approvalData);
    } catch (error) {
      console.error("Error fetching approval ratings data:", error);
      res.status(500).json({
        message: "Failed to fetch approval ratings data",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.post("/api/ratings", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Use the authenticated user's ID
      const userId = req.user.id;

      // Validate request body
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

      const validatedData = ratingPayloadSchema.parse({
        officialId: req.body.officialId,
        overallRating: req.body.overallRating,
        sectorRatings: req.body.sectorRatings,
      });

      // Submit rating with userId from authenticated user
      const result = await storage.submitRating({
        ...validatedData,
        userId,
      });

      console.log(
        `Rating submitted for official ${validatedData.officialId} by user ${userId}`
      );

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid rating data",
          errors: error.errors,
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
