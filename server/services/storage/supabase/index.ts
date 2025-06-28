import session from "express-session";
import { Ratings } from "./ratings";
import { Users } from "./users";

import { Officials } from "./officials";

import { supabase } from "server/supabase-client";
import { IStorage } from "../types";
import { transformToSectorPeriodData } from "server/utils/ratings/get-sector-period-ratings";

export class SupabaseStorage implements IStorage {
  public sessionStore: session.Store = new session.MemoryStore();

  async checkDatabaseConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from("leaders").select("count");
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Database connection failed:", err);
      return false;
    }
  }

  //   getUserById = getUserById;
  //   getUserByEmail = getUserByEmail;
  //   getUserByUsername = getUserByUsername;
  //   createUser = createUser;

  getUserById = Users.getUserById;
  getUserByEmail = Users.getUserByEmail;
  getUserByUsername = Users.getUserByUsername;
  createUser = Users.createUser;

  getOfficials = Officials.getOfficials;
  getOfficialById = Officials.getOfficialById;
  getOfficialRatings = Ratings.getOfficialRatings;
  submitRating = Ratings.submitRating;
}
