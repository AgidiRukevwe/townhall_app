import {
  InsertUser,
  Official,
  RatingPayload,
  RatingSummary,
  User,
} from "@shared/schema";
import session from "express-session";

export interface IStorage {
  // Database utilities
  checkDatabaseConnection(): Promise<boolean>;
  sessionStore: session.Store;

  // User methods
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(userData: InsertUser): Promise<User>;

  // Officials methods
  getOfficials(filters?: {
    location?: string;
    category?: string;
    search?: string;
  }): Promise<Official[]>;
  getOfficialById(id: string): Promise<Official | undefined>;
  getOfficialRatings(officialId: string): Promise<RatingSummary>;
  submitRating(
    ratingData: RatingPayload & { userId: string }
  ): Promise<{ success: boolean }>;
}
