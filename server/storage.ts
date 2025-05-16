import { MemStorage } from "./mem-storage";

// Use memory storage for development until we resolve database issues
export const storage = new MemStorage();
console.log('💾 Using in-memory storage for development');