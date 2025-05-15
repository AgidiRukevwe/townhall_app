import { pgTable, text, uuid, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Profiles Table
export const userProfiles = pgTable("user_profiles", {
  id: text("id").primaryKey(),
  deviceId: text("device_id").notNull(),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Officials Table
export const officials = pgTable("officials", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  location: text("location").notNull(),
  party: text("party"),
  gender: text("gender"),
  term: text("term"),
  imageUrl: text("image_url"),
  approvalRating: integer("approval_rating").default(50),
  approvalTrend: integer("approval_trend").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sectors Table
export const sectors = pgTable("sectors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  color: text("color").default("blue"),
  officialId: uuid("official_id").references(() => officials.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Ratings Table
export const ratings = pgTable("ratings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  officialId: uuid("official_id").references(() => officials.id),
  overallRating: integer("overall_rating").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sector Ratings Table
export const sectorRatings = pgTable("sector_ratings", {
  id: uuid("id").primaryKey().defaultRandom(),
  ratingId: uuid("rating_id").references(() => ratings.id),
  sectorId: uuid("sector_id").references(() => sectors.id),
  rating: integer("rating").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Elections Table
export const elections = pgTable("elections", {
  id: uuid("id").primaryKey().defaultRandom(),
  officialId: uuid("official_id").references(() => officials.id),
  year: integer("year").notNull(),
  type: text("type").notNull(),
  party: text("party").notNull(),
  position: text("position").notNull(),
  result: text("result").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Career History Table
export const careers = pgTable("careers", {
  id: uuid("id").primaryKey().defaultRandom(),
  officialId: uuid("official_id").references(() => officials.id),
  position: text("position").notNull(),
  party: text("party"),
  location: text("location"),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Petitions Table
export const petitions = pgTable("petitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location"),
  category: text("category"),
  userId: text("user_id").notNull(),
  officialId: uuid("official_id").references(() => officials.id),
  signatureCount: integer("signature_count").default(0),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod Schemas
export const userProfileSchema = createInsertSchema(userProfiles);
export const officialSchema = createInsertSchema(officials);
export const sectorSchema = createInsertSchema(sectors);
export const ratingSchema = createInsertSchema(ratings);
export const sectorRatingSchema = createInsertSchema(sectorRatings);
export const electionSchema = createInsertSchema(elections);
export const careerSchema = createInsertSchema(careers);
export const petitionSchema = createInsertSchema(petitions);

// Type definitions
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof userProfileSchema>;

export type Official = typeof officials.$inferSelect & {
  sectors: Sector[];
  electionHistory: Election[];
  careerHistory: Career[];
};
export type InsertOfficial = z.infer<typeof officialSchema>;

export type Sector = typeof sectors.$inferSelect;
export type InsertSector = z.infer<typeof sectorSchema>;

export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof ratingSchema>;

export type SectorRating = typeof sectorRatings.$inferSelect;
export type InsertSectorRating = z.infer<typeof sectorRatingSchema>;

export type Election = typeof elections.$inferSelect;
export type InsertElection = z.infer<typeof electionSchema>;

export type Career = typeof careers.$inferSelect;
export type InsertCareer = z.infer<typeof careerSchema>;

export type Petition = typeof petitions.$inferSelect;
export type InsertPetition = z.infer<typeof petitionSchema>;

// API Payload Types
export interface RatingPayload {
  officialId: string;
  overallRating: number;
  sectorRatings: Array<{
    sectorId: string;
    rating: number;
  }>;
}

export interface RatingSummary {
  overallRating: number;
  monthlyChange: number;
  monthlyData: Array<{
    month: string;
    rating: number;
    isCurrentMonth: boolean;
  }>;
  sectorAverage: number;
  sectorMonthlyChange: number;
  sectorRatings: Array<{
    name: string;
    rating: number;
    color: string;
  }>;
}

// Supabase database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: InsertUserProfile;
        Update: Partial<InsertUserProfile>;
      };
      officials: {
        Row: Omit<Official, 'sectors' | 'electionHistory' | 'careerHistory'>;
        Insert: InsertOfficial;
        Update: Partial<InsertOfficial>;
      };
      sectors: {
        Row: Sector;
        Insert: InsertSector;
        Update: Partial<InsertSector>;
      };
      ratings: {
        Row: Rating;
        Insert: InsertRating;
        Update: Partial<InsertRating>;
      };
      sector_ratings: {
        Row: SectorRating;
        Insert: InsertSectorRating;
        Update: Partial<InsertSectorRating>;
      };
      elections: {
        Row: Election;
        Insert: InsertElection;
        Update: Partial<InsertElection>;
      };
      careers: {
        Row: Career;
        Insert: InsertCareer;
        Update: Partial<InsertCareer>;
      };
      petitions: {
        Row: Petition;
        Insert: InsertPetition;
        Update: Partial<InsertPetition>;
      };
    };
  };
}
