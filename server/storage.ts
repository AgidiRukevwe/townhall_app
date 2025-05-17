import { MemStorage } from "./mem-storage";
import { SupabaseStorage } from "./supabase-storage";

// For now, use memory storage to ensure the app works
// We can set up the Supabase database tables later
console.log('💾 Using in-memory storage for development');
export const storage = new MemStorage();