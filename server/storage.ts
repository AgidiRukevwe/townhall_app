import { MemStorage } from "./mem-storage";
import { SupabaseStorage } from "./supabase-storage";

// Determine which storage implementation to use based on environment variables
// If Supabase credentials are available, use Supabase storage, otherwise use memory storage
let useSupabase = false;

if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  useSupabase = true;
  console.log("💾 Using Supabase client storage");
} else {
  console.log("💾 Using in-memory storage for development");
}

// export const storage = useSupabase ? new SupabaseStorage() : new MemStorage();
export const storage = new SupabaseStorage();
