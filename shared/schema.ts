import { pgTable, text, uuid, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isAnonymous: boolean("is_anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Profiles Table
export const userProfiles = pgTable("user_profiles", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  deviceId: text("device_id").notNull(),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leaders Table (replacing Officials)
export const leaders = pgTable("leaders", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  office: text("office").notNull(), // role/position
  party: text("party"),
  chamber: text("chamber"),
  jurisdiction: text("jurisdiction"),
  dob: text("dob"),
  targetAchievements: text("target_achievements"),
  phone: text("phone"),
  email: text("email"),
  parliamentAddress: text("parliament_address"),
  education: text("education"),
  awards: text("awards"),
  career: text("career"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sectors Table
export const sectors = pgTable("sectors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  color: text("color").default("blue"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Ratings Table
export const ratings = pgTable("ratings", {
  id: uuid("id").primaryKey().defaultRandom(),
  leaderId: uuid("leader_id").notNull().references(() => leaders.id),
  sectorId: uuid("sector_id").notNull().references(() => sectors.id),
  rating: integer("rating").notNull(),
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

// Offices Table (replaces Elections)
export const offices = pgTable("offices", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Office Sectors Table (replacing careers)
export const officeSectors = pgTable("office_sectors", {
  officeId: uuid("office_id").references(() => offices.id),
  sectorId: uuid("sector_id").references(() => sectors.id),
});

// Petitions Table - maintain for future implementation
export const petitions = pgTable("petitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location"),
  category: text("category"),
  userId: uuid("user_id").notNull().references(() => users.id),
  leaderId: uuid("leader_id").references(() => leaders.id),
  signatureCount: integer("signature_count").default(0),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod Schemas
export const userSchema = createInsertSchema(users);
export const userProfileSchema = createInsertSchema(userProfiles);
export const leaderSchema = createInsertSchema(leaders);
export const sectorSchema = createInsertSchema(sectors);
export const ratingSchema = createInsertSchema(ratings);
export const sectorRatingSchema = createInsertSchema(sectorRatings);
export const officeSchema = createInsertSchema(offices);
export const officeSectorSchema = createInsertSchema(officeSectors);
export const petitionSchema = createInsertSchema(petitions);

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof userSchema>;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof userProfileSchema>;

export type Leader = typeof leaders.$inferSelect;
export type InsertLeader = z.infer<typeof leaderSchema>;

export type Sector = typeof sectors.$inferSelect;
export type InsertSector = z.infer<typeof sectorSchema>;

export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof ratingSchema>;

export type SectorRating = typeof sectorRatings.$inferSelect;
export type InsertSectorRating = z.infer<typeof sectorRatingSchema>;

export type Office = typeof offices.$inferSelect;
export type InsertOffice = z.infer<typeof officeSchema>;

export type OfficeSector = typeof officeSectors.$inferSelect;
export type InsertOfficeSector = z.infer<typeof officeSectorSchema>;

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
      users: {
        Row: User;
        Insert: InsertUser;
        Update: Partial<InsertUser>;
      };
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
