// import { IStorage } from "server/supabase-storage";
// import { SupabaseStorage } from "./supabase";

// export const storage: IStorage = new SupabaseStorage();

import { SupabaseStorage } from "./supabase";
import { IStorage } from "./types";

let storage: IStorage;

if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  console.log("💾 Using Supabase storage");
  storage = new SupabaseStorage();
} else {
  throw new Error("Missing Supabase credentials. No fallback storage defined.");
  // You can also plug in MemStorage here if needed
  // storage = new MemStorage();
}

export { storage };
