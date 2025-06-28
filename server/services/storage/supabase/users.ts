// import { supabase } from "../../lib/supabase-client";
// import { InsertUser, User } from "@shared/schema";
// import { randomUUID } from "crypto";

// export async function getUserById(id: string): Promise<User | undefined> {
//   // ...original getUserById logic...
// }

// export async function getUserByEmail(email: string): Promise<User | undefined> {
//   // ...original getUserByEmail logic...
// }

// export async function getUserByUsername(
//   username: string
// ): Promise<User | undefined> {
//   // ...original getUserByUsername logic...
// }

// export async function createUser(userData: InsertUser): Promise<User> {
//   // ...original createUser logic...
// }

import { randomUUID } from "crypto";
import { InsertUser, User } from "@shared/schema";
import { supabase } from "server/supabase-client";

export const Users = {
  async getUserById(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error?.code === "PGRST116") return undefined;
    if (error) {
      console.error("Error fetching user by ID:", error.message);
      return undefined;
    }

    return data ? formatUser(data) : undefined;
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error?.code === "PGRST116") return undefined;
    if (error) {
      console.error("Error fetching user by email:", error.message);
      return undefined;
    }

    return data ? formatUser(data) : undefined;
  },

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error?.code === "PGRST116") return undefined;
    if (error) {
      console.error("Error fetching user by username:", error.message);
      return undefined;
    }

    return data ? formatUser(data) : undefined;
  },

  async createUser(userData: InsertUser): Promise<User> {
    const newUser = {
      ...userData,
      id: randomUUID(),
      is_anonymous: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("users")
      .insert(newUser)
      .select("*")
      .single();

    if (error) {
      console.error("Error creating user:", error.message);
      throw new Error("Failed to create user: " + error.message);
    }

    if (!data) throw new Error("Failed to retrieve created user");

    return formatUser(data);
  },
};

// Reuseable formatter for consistent shape
function formatUser(data: any): User {
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    password: data.password,
    isAnonymous: data.is_anonymous,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}
