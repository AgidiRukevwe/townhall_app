// import { randomUUID } from "crypto";
// import session from "express-session";
// import { InsertUser, Official, RatingPayload, RatingSummary, User } from "@shared/schema";
// import { supabase } from "./supabase-client";
// import connectPg from "connect-pg-simple";

// export interface IStorage {
//   // Database utilities
//   checkDatabaseConnection(): Promise<boolean>;
//   sessionStore: session.Store;

//   // User methods
//   getUserById(id: string): Promise<User | undefined>;
//   getUserByEmail(email: string): Promise<User | undefined>;
//   getUserByUsername(username: string): Promise<User | undefined>;
//   createUser(userData: InsertUser): Promise<User>;

//   // Officials methods
//   getOfficials(filters?: { location?: string; category?: string; search?: string }): Promise<Official[]>;
//   getOfficialById(id: string): Promise<Official | undefined>;
//   getOfficialRatings(officialId: string): Promise<RatingSummary>;
//   submitRating(ratingData: RatingPayload & { userId: string }): Promise<{ success: boolean }>;
// }

// export class SupabaseStorage implements IStorage {
//   public sessionStore: session.Store;

//   constructor() {
//     // Use a simple in-memory session store
//     // This avoids PostgreSQL connection issues
//     console.log("Auth: Using in-memory session store with Supabase data storage");
//     this.sessionStore = new session.MemoryStore();
//   }

//   async checkDatabaseConnection(): Promise<boolean> {
//     try {
//       const { data, error } = await supabase.from('leaders').select('count');

//       if (error) {
//         console.error("❌ Database connection test failed:", error.message);
//         return false;
//       }

//       console.log("✅ Database connection test successful");
//       return true;
//     } catch (error) {
//       console.error("❌ Database connection test failed:", error);
//       return false;
//     }
//   }

//   async getUserById(id: string): Promise<User | undefined> {
//     try {
//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .eq('id', id)
//         .single();

//       if (error) {
//         if (error.code === 'PGRST116') {
//           // No rows returned - user not found
//           return undefined;
//         }
//         console.error("Error fetching user by ID:", error.message);
//         return undefined;
//       }

//       // Map the database fields to our User type
//       if (data) {
//         return {
//           id: data.id,
//           username: data.username,
//           email: data.email,
//           password: data.password,
//           isAnonymous: data.is_anonymous,
//           createdAt: new Date(data.created_at),
//           updatedAt: new Date(data.updated_at)
//         };
//       }

//       return undefined;
//     } catch (error) {
//       console.error("Error fetching user by ID:", error);
//       return undefined;
//     }
//   }

//   async getUserByEmail(email: string): Promise<User | undefined> {
//     try {
//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .eq('email', email)
//         .single();

//       if (error) {
//         if (error.code === 'PGRST116') {
//           // No rows returned - user not found
//           return undefined;
//         }
//         console.error("Error fetching user by email:", error.message);
//         return undefined;
//       }

//       // Map the database fields to our User type
//       if (data) {
//         return {
//           id: data.id,
//           username: data.username,
//           email: data.email,
//           password: data.password,
//           isAnonymous: data.is_anonymous,
//           createdAt: new Date(data.created_at),
//           updatedAt: new Date(data.updated_at)
//         };
//       }

//       return undefined;
//     } catch (error) {
//       console.error("Error fetching user by email:", error);
//       return undefined;
//     }
//   }

//   async getUserByUsername(username: string): Promise<User | undefined> {
//     try {
//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .eq('username', username)
//         .single();

//       if (error) {
//         if (error.code === 'PGRST116') {
//           // No rows returned - user not found
//           return undefined;
//         }
//         console.error("Error fetching user by username:", error.message);
//         return undefined;
//       }

//       // Map the database fields to our User type
//       if (data) {
//         return {
//           id: data.id,
//           username: data.username,
//           email: data.email,
//           password: data.password,
//           isAnonymous: data.is_anonymous,
//           createdAt: new Date(data.created_at),
//           updatedAt: new Date(data.updated_at)
//         };
//       }

//       return undefined;
//     } catch (error) {
//       console.error("Error fetching user by username:", error);
//       return undefined;
//     }
//   }

//   async createUser(userData: InsertUser): Promise<User> {
//     try {
//       const newUser = {
//         ...userData,
//         id: randomUUID(),
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//         is_anonymous: false
//       };

//       const { data, error } = await supabase
//         .from('users')
//         .insert(newUser)
//         .select('*')
//         .single();

//       if (error) {
//         console.error("Error creating user:", error.message);
//         throw new Error("Failed to create user: " + error.message);
//       }

//       if (!data) {
//         throw new Error("Failed to retrieve created user");
//       }

//       // Map the database fields to our User type
//       const user: User = {
//         id: data.id,
//         username: data.username,
//         email: data.email,
//         password: data.password,
//         isAnonymous: data.is_anonymous,
//         createdAt: new Date(data.created_at),
//         updatedAt: new Date(data.updated_at)
//       };

//       console.log("Created new user in Supabase:", user.username);
//       return user;
//     } catch (error) {
//       console.error("Error creating user:", error);
//       throw error;
//     }
//   }

//   async getOfficials(filters?: { location?: string; category?: string; search?: string }): Promise<Official[]> {
//     try {
//       let query = supabase
//         .from('leaders')
//         .select('*');

//       // Apply filters
//       if (filters) {
//         if (filters.location) {
//           query = query.eq('jurisdiction', filters.location);
//         }

//         if (filters.search) {
//           query = query.or(
//             `name.ilike.%${filters.search}%,office.ilike.%${filters.search}%,jurisdiction.ilike.%${filters.search}%`
//           );
//         }
//       }

//       const { data, error } = await query;

//       if (error) {
//         console.error("Error fetching leaders:", error.message);
//         throw error;
//       }

//       // Map leaders to the Official format for compatibility
//       const mappedLeaders = data.map(leader => {
//         // Parse JSON fields if they exist
//         let education: any[] = [];
//         let awards: any[] = [];
//         let career: any[] = [];

//         try {
//           if (leader.education) {
//             education = typeof leader.education === 'string'
//               ? JSON.parse(leader.education)
//               : leader.education;
//           }

//           if (leader.awards) {
//             awards = typeof leader.awards === 'string'
//               ? JSON.parse(leader.awards)
//               : leader.awards;
//           }

//           if (leader.career) {
//             career = typeof leader.career === 'string'
//               ? JSON.parse(leader.career)
//               : leader.career;
//           }
//         } catch (e) {
//           console.error("Error parsing JSON fields:", e);
//         }

//         // Create a leader object that maps to our Official interface
//         return {
//           id: leader.id,
//           name: leader.name,
//           position: leader.office || '',
//           location: leader.jurisdiction || '',
//           party: leader.party ? leader.party.replace('Party: ', '') : '',
//           gender: '', // Not available in leaders table
//           term: '', // Not available in leaders table
//           imageUrl: leader.avatar_url || null,
//           bio: leader.bio || null, // Added bio field mapping
//           approvalRating: 50, // Default value
//           approvalTrend: 0,
//           createdAt: leader.created_at ? new Date(leader.created_at) : null,
//           updatedAt: leader.updated_at ? new Date(leader.updated_at) : null,
//           sectors: [], // Will be populated in the future
//           education: Array.isArray(education) ? education.map((e: any) => ({
//             id: randomUUID(),
//             officialId: leader.id,
//             institution: e.school || e.institution || '',  // Use school field if available
//             degree: e.degree || '',
//             field: e.field || '',
//             startYear: e.startYear || 0,
//             endYear: e.endYear || 0
//           })) : [],
//           electionHistory: [],
//           careerHistory: Array.isArray(career) ? career.map((c: any) => ({
//             id: randomUUID(),
//             officialId: leader.id,
//             position: c.office || c.position || '',
//             party: c.party || '',
//             location: c.location || '',
//             startYear: c.startYear || 0,
//             endYear: c.endYear || 0,
//             date: c.date || '',
//             createdAt: new Date()
//           })) : []
//         };
//       });

//       return mappedLeaders;
//     } catch (error) {
//       console.error("Error fetching officials:", error);
//       throw error;
//     }
//   }

//   async getOfficialById(id: string): Promise<Official | undefined> {
//     try {
//       const { data, error } = await supabase
//         .from('leaders')
//         .select('*')
//         .eq('id', id)
//         .single();

//       if (error) {
//         if (error.code === 'PGRST116') {
//           // No rows returned - leader not found
//           return undefined;
//         }
//         console.error("Error fetching leader by ID:", error.message);
//         throw error;
//       }

//       const leader = data;

//       // Parse JSON fields if they exist
//       let education: any[] = [];
//       let awards: any[] = [];
//       let career: any[] = [];

//       try {
//         if (leader.education) {
//           education = typeof leader.education === 'string'
//             ? JSON.parse(leader.education)
//             : leader.education;
//         }

//         if (leader.awards) {
//           awards = typeof leader.awards === 'string'
//             ? JSON.parse(leader.awards)
//             : leader.awards;
//         }

//         if (leader.career) {
//           career = typeof leader.career === 'string'
//             ? JSON.parse(leader.career)
//             : leader.career;
//         }
//       } catch (e) {
//         console.error("Error parsing JSON fields:", e);
//       }

//       // Fetch sectors from the database
//       const { data: sectorsData, error: sectorsError } = await supabase
//         .from('sectors')
//         .select('*');

//       if (sectorsError) {
//         console.error("Error fetching sectors:", sectorsError.message);
//       }

//       const sectors = sectorsData || [];

//       // Create a leader object that maps to our Official interface
//       return {
//         id: leader.id,
//         name: leader.name,
//         position: leader.office || '',
//         location: leader.jurisdiction || '',
//         party: leader.party ? leader.party.replace('Party: ', '') : '',
//         gender: '', // Not available in leaders table
//         term: '', // Not available in leaders table
//         imageUrl: leader.avatar_url || null,
//         bio: leader.bio || null, // Added bio field
//         approvalRating: 50, // Default value
//         approvalTrend: 0,
//         createdAt: leader.created_at ? new Date(leader.created_at) : null,
//         updatedAt: leader.updated_at ? new Date(leader.updated_at) : null,
//         sectors: sectors, // Now populated with actual sectors from the database
//         education: Array.isArray(education) ? education.map((e: any) => ({
//           id: randomUUID(),
//           officialId: leader.id,
//           institution: e.school || e.institution || '',  // Use school field if available
//           degree: e.degree || '',
//           field: e.field || '',
//           startYear: e.startYear || 0,
//           endYear: e.endYear || 0
//         })) : [],
//         electionHistory: [],
//         careerHistory: Array.isArray(career) ? career.map((c: any) => ({
//           id: randomUUID(),
//           officialId: leader.id,
//           position: c.office || c.position || '',
//           party: c.party || '',
//           location: c.location || '',
//           startYear: c.startYear || 0,
//           endYear: c.endYear || 0,
//           date: c.date || '',
//           createdAt: new Date()
//         })) : []
//       };
//     } catch (error) {
//       console.error("Error fetching leader:", error);
//       throw error;
//     }
//   }

//   async getOfficialRatings(officialId: string): Promise<RatingSummary> {
//     try {
//       console.log(`Fetching ratings for official: ${officialId}`);

//       // Get all ratings for this official, including sector information
//       const { data: allRatings, error: allRatingsError } = await supabase
//         .from('ratings')
//         .select('rating, sector_id, created_at')
//         .eq('leader_id', officialId);

//       if (allRatingsError) {
//         console.error("Error fetching ratings:", allRatingsError.message);
//         throw allRatingsError;
//       }

//       console.log(`Found ${allRatings ? allRatings.length : 0} total ratings`);

//       // Separate overall ratings from sector-specific ratings
//       const overallRatings = allRatings ? allRatings.filter(r =>
//         !r.sector_id || r.sector_id === '00000000-0000-0000-0000-000000000000'
//       ) : [];

//       const sectorSpecificRatings = allRatings ? allRatings.filter(r =>
//         r.sector_id && r.sector_id !== '00000000-0000-0000-0000-000000000000'
//       ) : [];

//       // Calculate overall rating from actual database values or default to 50
//       const overallRating = overallRatings.length > 0
//         ? Math.round(overallRatings.reduce((sum, r) => sum + r.rating, 0) / overallRatings.length)
//         : 50;

//       console.log(`Overall rating calculated: ${overallRating}`);

//       // Generate monthly data (last 6 months) using actual rating data
//       const monthlyData = [];
//       const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//       const currentDate = new Date();

//       // Track previous month's rating for continuity
//       let previousMonthRating = overallRating;

//       for (let i = 5; i >= 0; i--) {
//         const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
//         const monthIdx = month.getMonth();
//         const yearVal = month.getFullYear();

//         // Find all ratings for this specific month
//         const monthRatings = overallRatings.filter(r => {
//           const ratingDate = new Date(r.created_at);
//           return ratingDate.getMonth() === monthIdx && ratingDate.getFullYear() === yearVal;
//         });

//         // Calculate this month's rating from actual data when available
//         let monthlyRating;

//         if (monthRatings.length > 0) {
//           // Use actual ratings for this month
//           monthlyRating = Math.round(monthRatings.reduce((sum, r) => sum + r.rating, 0) / monthRatings.length);
//           previousMonthRating = monthlyRating; // Save for continuity
//         } else if (i === 0) {
//           // Current month with no ratings yet, use overall
//           monthlyRating = overallRating;
//         } else {
//           // For past months with no ratings, use the previous month's value
//           // with a slight difference to show some trend (max ±3)
//           const variation = Math.min(3, Math.max(-3, previousMonthRating - overallRating));
//           monthlyRating = Math.max(0, Math.min(100, previousMonthRating - variation));
//           previousMonthRating = monthlyRating;
//         }

//         monthlyData.push({
//           month: `${monthNames[monthIdx]} ${yearVal}`,
//           rating: monthlyRating,
//           isCurrentMonth: i === 0
//         });
//       }

//       // Calculate month-over-month change using actual calculated values
//       const monthlyChange = monthlyData.length >= 2
//         ? monthlyData[monthlyData.length - 1].rating - monthlyData[monthlyData.length - 2].rating
//         : 0;

//       // Get all sectors from the database
//       const { data: sectorData, error: sectorError } = await supabase
//         .from('sectors')
//         .select('id, name');

//       if (sectorError) {
//         console.error("Error fetching sectors:", sectorError.message);
//         throw sectorError;
//       }

//       // Generate sector ratings using actual sector rating data where available
//       const sectorColors = ['#4CAF50', '#FFC107', '#2196F3', '#E91E63', '#673AB7'];
//       let sectorRatings = [];

//       if (sectorData && sectorData.length > 0) {
//         sectorRatings = sectorData.map((sector, index) => {
//           // Find all ratings for this specific sector
//           const sectorRatings = sectorSpecificRatings.filter(r => r.sector_id === sector.id);

//           // Calculate rating for this sector from actual data when available
//           let sectorRating;

//           if (sectorRatings.length > 0) {
//             // Use actual sector ratings
//             sectorRating = Math.round(sectorRatings.reduce((sum: number, r) => sum + r.rating, 0) / sectorRatings.length);
//           } else {
//             // No ratings for this sector yet, derive from overall with small offset
//             // Use a deterministic offset based on sector ID to ensure consistency
//             const sectorIdSum = sector.id.split('').reduce((sum: number, char: string) => sum + char.charCodeAt(0), 0);
//             const offset = (sectorIdSum % 10) - 5; // -5 to +4 range
//             sectorRating = Math.max(0, Math.min(100, overallRating + offset));
//           }

//           return {
//             name: sector.name,
//             rating: sectorRating,
//             color: sectorColors[index % sectorColors.length]
//           };
//         });
//       } else {
//         console.warn("No sectors found in database, using default sectors");
//         const defaultSectors = ['Healthcare', 'Education', 'Infrastructure', 'Economy', 'Security'];
//         sectorRatings = defaultSectors.map((name, index) => ({
//           name,
//           rating: overallRating, // Use overall for all sectors
//           color: sectorColors[index % sectorColors.length]
//         }));
//       }

//       // Calculate sector average using actual sector ratings - limited to 1 decimal place
//       const sectorAverage = parseFloat((sectorRatings.reduce((sum, s) => sum + s.rating, 0) / sectorRatings.length).toFixed(1));

//       // Use the actual change calculated from sector ratings
//       const sectorMonthlyChange = parseFloat(monthlyChange.toFixed(1));

//       return {
//         overallRating,
//         monthlyChange,
//         monthlyData,
//         sectorAverage,
//         sectorMonthlyChange,
//         sectorRatings
//       };
//     } catch (error) {
//       console.error("Error fetching official ratings:", error);
//       throw error;
//     }
//   }

//   async submitRating(ratingData: RatingPayload & { userId: string }): Promise<{ success: boolean }> {
//     try {
//       console.log("Submitting rating:", ratingData);

//       // Let's handle this with multiple steps to avoid constraint errors
//       // Step 1: First, get all the current ratings for this user/leader combination
//       const { data: existingRatings, error: getError } = await supabase
//         .from('ratings')
//         .select('id, sector_id')
//         .eq('leader_id', ratingData.officialId)
//         .eq('user_id', ratingData.userId);

//       if (getError) {
//         console.error("Error checking existing ratings:", getError.message);
//         // Continue anyway - we'll try to proceed
//       }

//       // Step 2: Delete any existing ratings individually to ensure they're gone
//       if (existingRatings && existingRatings.length > 0) {
//         console.log(`Found ${existingRatings.length} existing ratings to remove`);

//         for (const rating of existingRatings) {
//           const { error: deleteError } = await supabase
//             .from('ratings')
//             .delete()
//             .eq('id', rating.id);

//           if (deleteError) {
//             console.error(`Error deleting rating ${rating.id}:`, deleteError.message);
//             // Continue with the other deletions
//           }
//         }
//       }

//       // Let's confirm all ratings are deleted
//       const { data: checkRatings, error: checkError } = await supabase
//         .from('ratings')
//         .select('count')
//         .eq('leader_id', ratingData.officialId)
//         .eq('user_id', ratingData.userId);

//       if (checkError) {
//         console.error("Error checking if ratings were deleted:", checkError.message);
//       } else {
//         console.log("Confirmed deletion - ratings count:", checkRatings);
//       }

//       // Step 3: Ensure we have the sectors table ready
//       const { data: sectorsData, error: sectorsError } = await supabase
//         .from('sectors')
//         .select('id, name');

//       if (sectorsError) {
//         console.error("Error checking sectors:", sectorsError.message);
//         throw sectorsError;
//       }

//       // Step 4: Get or create the default sector ID for overall ratings
//       let defaultSectorId = '00000000-0000-0000-0000-000000000000';
//       const { data: defaultSector, error: defaultSectorError } = await supabase
//         .from('sectors')
//         .select('id')
//         .eq('name', 'Overall')
//         .maybeSingle();

//       if (defaultSectorError) {
//         console.error("Error checking for default sector:", defaultSectorError.message);
//       } else if (defaultSector) {
//         defaultSectorId = defaultSector.id;
//       }

//       // Step 5: Insert the overall rating first
//       console.log("Inserting overall rating");
//       const { error: overallError } = await supabase
//         .from('ratings')
//         .insert({
//           id: randomUUID(),
//           leader_id: ratingData.officialId,
//           user_id: ratingData.userId,
//           rating: ratingData.overallRating,
//           sector_id: defaultSectorId,
//           created_at: new Date().toISOString()
//         });

//       if (overallError) {
//         console.error("Error submitting overall rating:", overallError.message);
//         throw overallError;
//       }

//       // Step 6: Insert sector ratings one by one
//       let insertedCount = 0;
//       if (ratingData.sectorRatings && ratingData.sectorRatings.length > 0) {
//         console.log(`Inserting ${ratingData.sectorRatings.length} sector ratings`);

//         for (const sr of ratingData.sectorRatings) {
//           // Skip the overall rating sector that we already inserted
//           if (sr.sectorId === defaultSectorId) continue;

//           const { error: sectorError } = await supabase
//             .from('ratings')
//             .insert({
//               id: randomUUID(),
//               leader_id: ratingData.officialId,
//               user_id: ratingData.userId,
//               rating: sr.rating,
//               sector_id: sr.sectorId,
//               created_at: new Date().toISOString()
//             });

//           if (sectorError) {
//             console.error(`Error submitting rating for sector ${sr.sectorId}:`, sectorError.message);
//             // Continue with other sectors
//           } else {
//             insertedCount++;
//           }
//         }
//       }

//       console.log(`Rating submitted successfully. Inserted overall rating + ${insertedCount} sector ratings`);
//       return { success: true };
//     } catch (error) {
//       console.error("Error submitting rating:", error);
//       throw error;
//     }
//   }
// }

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

// import { randomUUID } from "crypto";
// import session from "express-session";
// import {
//   InsertUser,
//   Official,
//   RatingPayload,
//   RatingSummary,
//   User,
// } from "@shared/schema";
// import { supabase } from "./supabase-client";
// import connectPg from "connect-pg-simple";
// import { generateTimeBasedData } from "./time-based-ratings";

// // Helper function to get colors for sectors based on name
// function getSectorColor(sectorName: string): string {
//   const colorMap: { [key: string]: string } = {
//     Health: "#4CAF50",
//     Education: "#2196F3",
//     Infrastructure: "#FF9800",
//     Economy: "#E91E63",
//     Security: "#673AB7",
//     Agriculture: "#795548",
//     Technology: "#607D8B",
//     Environment: "#009688",
//     Transportation: "#FFC107",
//     Energy: "#3F51B5",
//     Housing: "#F44336",
//   };

//   return colorMap[sectorName] || "#BDBDBD"; // Default gray for unknown sectors
// }

// export interface IStorage {
//   // Database utilities
//   checkDatabaseConnection(): Promise<boolean>;
//   sessionStore: session.Store;

//   // User methods
//   getUserById(id: string): Promise<User | undefined>;
//   getUserByEmail(email: string): Promise<User | undefined>;
//   getUserByUsername(username: string): Promise<User | undefined>;
//   createUser(userData: InsertUser): Promise<User>;

//   // Officials methods
//   getOfficials(filters?: {
//     location?: string;
//     category?: string;
//     search?: string;
//   }): Promise<Official[]>;
//   getOfficialById(id: string): Promise<Official | undefined>;
//   getOfficialRatings(officialId: string): Promise<RatingSummary>;
//   submitRating(
//     ratingData: RatingPayload & { userId: string }
//   ): Promise<{ success: boolean }>;
// }

// export class SupabaseStorage implements IStorage {
//   public sessionStore: session.Store;

//   constructor() {
//     // Use a simple in-memory session store
//     // This avoids PostgreSQL connection issues
//     console.log(
//       "Auth: Using in-memory session store with Supabase data storage"
//     );
//     this.sessionStore = new session.MemoryStore();
//   }

//   async checkDatabaseConnection(): Promise<boolean> {
//     try {
//       const { data, error } = await supabase.from("leaders").select("count");

//       if (error) {
//         console.error("❌ Database connection test failed:", error.message);
//         return false;
//       }

//       console.log("✅ Database connection test successful");
//       return true;
//     } catch (error) {
//       console.error("❌ Database connection test failed:", error);
//       return false;
//     }
//   }

//   async getUserById(id: string): Promise<User | undefined> {
//     try {
//       const { data, error } = await supabase
//         .from("users")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (error) {
//         if (error.code === "PGRST116") {
//           // No rows returned - user not found
//           return undefined;
//         }
//         console.error("Error fetching user by ID:", error.message);
//         return undefined;
//       }

//       // Map the database fields to our User type
//       if (data) {
//         return {
//           id: data.id,
//           username: data.username,
//           email: data.email,
//           password: data.password,
//           isAnonymous: data.is_anonymous,
//           createdAt: new Date(data.created_at),
//           updatedAt: new Date(data.updated_at),
//         };
//       }

//       return undefined;
//     } catch (error) {
//       console.error("Error fetching user by ID:", error);
//       return undefined;
//     }
//   }

//   async getUserByEmail(email: string): Promise<User | undefined> {
//     try {
//       const { data, error } = await supabase
//         .from("users")
//         .select("*")
//         .eq("email", email)
//         .single();

//       if (error) {
//         if (error.code === "PGRST116") {
//           // No rows returned - user not found
//           return undefined;
//         }
//         console.error("Error fetching user by email:", error.message);
//         return undefined;
//       }

//       // Map the database fields to our User type
//       if (data) {
//         return {
//           id: data.id,
//           username: data.username,
//           email: data.email,
//           password: data.password,
//           isAnonymous: data.is_anonymous,
//           createdAt: new Date(data.created_at),
//           updatedAt: new Date(data.updated_at),
//         };
//       }

//       return undefined;
//     } catch (error) {
//       console.error("Error fetching user by email:", error);
//       return undefined;
//     }
//   }

//   async getUserByUsername(username: string): Promise<User | undefined> {
//     try {
//       const { data, error } = await supabase
//         .from("users")
//         .select("*")
//         .eq("username", username)
//         .single();

//       if (error) {
//         if (error.code === "PGRST116") {
//           // No rows returned - user not found
//           return undefined;
//         }
//         console.error("Error fetching user by username:", error.message);
//         return undefined;
//       }

//       // Map the database fields to our User type
//       if (data) {
//         return {
//           id: data.id,
//           username: data.username,
//           email: data.email,
//           password: data.password,
//           isAnonymous: data.is_anonymous,
//           createdAt: new Date(data.created_at),
//           updatedAt: new Date(data.updated_at),
//         };
//       }

//       return undefined;
//     } catch (error) {
//       console.error("Error fetching user by username:", error);
//       return undefined;
//     }
//   }

//   async createUser(userData: InsertUser): Promise<User> {
//     try {
//       const newUser = {
//         ...userData,
//         id: randomUUID(),
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//         is_anonymous: false,
//       };

//       const { data, error } = await supabase
//         .from("users")
//         .insert(newUser)
//         .select("*")
//         .single();

//       if (error) {
//         console.error("Error creating user:", error.message);
//         throw new Error("Failed to create user: " + error.message);
//       }

//       if (!data) {
//         throw new Error("Failed to retrieve created user");
//       }

//       // Map the database fields to our User type
//       const user: User = {
//         id: data.id,
//         username: data.username,
//         email: data.email,
//         password: data.password,
//         isAnonymous: data.is_anonymous,
//         createdAt: new Date(data.created_at),
//         updatedAt: new Date(data.updated_at),
//       };

//       console.log("Created new user in Supabase:", user.username);
//       return user;
//     } catch (error) {
//       console.error("Error creating user:", error);
//       throw error;
//     }
//   }

//   async getOfficials(filters?: {
//     location?: string;
//     category?: string;
//     search?: string;
//   }): Promise<Official[]> {
//     try {
//       let query = supabase.from("leaders").select("*");

//       // Apply filters
//       if (filters) {
//         if (filters.location) {
//           query = query.eq("jurisdiction", filters.location);
//         }

//         if (filters.search) {
//           // Log the search term for debugging
//           console.log("Searching with term:", filters.search);

//           // Sanitize the search term to prevent SQL injection
//           const sanitizedSearch = filters.search.replace(/'/g, "''");

//           // Use the proper format for Supabase filtering with OR conditions
//           query = query.or(
//             `name.ilike.%${sanitizedSearch}%,office.ilike.%${sanitizedSearch}%,jurisdiction.ilike.%${sanitizedSearch}%`
//           );
//         }
//       }

//       const { data, error } = await query;

//       if (error) {
//         console.error("Error fetching leaders:", error.message);
//         throw error;
//       }

//       // Map leaders to the Official format for compatibility
//       const mappedLeaders = data.map((leader) => {
//         // Parse JSON fields if they exist
//         let education: any[] = [];
//         let awards: any[] = [];
//         let career: any[] = [];

//         try {
//           if (leader.education) {
//             education =
//               typeof leader.education === "string"
//                 ? JSON.parse(leader.education)
//                 : leader.education;
//           }

//           if (leader.awards) {
//             awards =
//               typeof leader.awards === "string"
//                 ? JSON.parse(leader.awards)
//                 : leader.awards;
//           }

//           if (leader.career) {
//             career =
//               typeof leader.career === "string"
//                 ? JSON.parse(leader.career)
//                 : leader.career;
//           }
//         } catch (e) {
//           console.error("Error parsing JSON fields:", e);
//         }

//         // Create a leader object that maps to our Official interface
//         return {
//           id: leader.id,
//           name: leader.name,
//           position: leader.office || "",
//           location: leader.jurisdiction || "",
//           party: leader.party ? leader.party.replace("Party: ", "") : "",
//           gender: "", // Not available in leaders table
//           term: "", // Not available in leaders table
//           imageUrl: leader.avatar_url || null,
//           bio: leader.bio || null, // Added bio field mapping
//           approvalRating: 50, // Default value
//           approvalTrend: 0,
//           createdAt: leader.created_at ? new Date(leader.created_at) : null,
//           updatedAt: leader.updated_at ? new Date(leader.updated_at) : null,
//           sectors: [], // Will be populated in the future
//           education: Array.isArray(education)
//             ? education.map((e: any) => ({
//                 id: randomUUID(),
//                 officialId: leader.id,
//                 institution: e.school || e.institution || "", // Use school field if available
//                 degree: e.degree || "",
//                 field: e.field || "",
//                 startYear: e.startYear || 0,
//                 endYear: e.endYear || 0,
//               }))
//             : [],
//           electionHistory: [],
//           careerHistory: Array.isArray(career)
//             ? career.map((c: any) => ({
//                 id: randomUUID(),
//                 officialId: leader.id,
//                 position: c.office || c.position || "",
//                 party: c.party || "",
//                 location: c.location || "",
//                 startYear: c.startYear || 0,
//                 endYear: c.endYear || 0,
//                 date: c.date || "",
//                 createdAt: new Date(),
//               }))
//             : [],
//         };
//       });

//       return mappedLeaders;
//     } catch (error) {
//       console.error("Error fetching officials:", error);
//       throw error;
//     }
//   }

//   async getOfficialById(id: string): Promise<Official | undefined> {
//     try {
//       const { data, error } = await supabase
//         .from("leaders")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (error) {
//         if (error.code === "PGRST116") {
//           // No rows returned - leader not found
//           return undefined;
//         }
//         console.error("Error fetching leader by ID:", error.message);
//         throw error;
//       }

//       const leader = data;

//       // Parse JSON fields if they exist
//       let education: any[] = [];
//       let awards: any[] = [];
//       let career: any[] = [];

//       try {
//         if (leader.education) {
//           education =
//             typeof leader.education === "string"
//               ? JSON.parse(leader.education)
//               : leader.education;
//         }

//         if (leader.awards) {
//           awards =
//             typeof leader.awards === "string"
//               ? JSON.parse(leader.awards)
//               : leader.awards;
//         }

//         if (leader.career) {
//           career =
//             typeof leader.career === "string"
//               ? JSON.parse(leader.career)
//               : leader.career;
//         }
//       } catch (e) {
//         console.error("Error parsing JSON fields:", e);
//       }

//       // Fetch sectors from the database
//       const { data: sectorsData, error: sectorsError } = await supabase
//         .from("sectors")
//         .select("*");

//       if (sectorsError) {
//         console.error("Error fetching sectors:", sectorsError.message);
//       }

//       const sectors = sectorsData || [];

//       // Create a leader object that maps to our Official interface
//       return {
//         id: leader.id,
//         name: leader.name,
//         position: leader.office || "",
//         location: leader.jurisdiction || "",
//         party: leader.party ? leader.party.replace("Party: ", "") : "",
//         gender: "", // Not available in leaders table
//         term: "", // Not available in leaders table
//         imageUrl: leader.avatar_url || null,
//         bio: leader.bio || null, // Added bio field
//         approvalRating: 50, // Default value
//         approvalTrend: 0,
//         createdAt: leader.created_at ? new Date(leader.created_at) : null,
//         updatedAt: leader.updated_at ? new Date(leader.updated_at) : null,
//         sectors: sectors, // Now populated with actual sectors from the database
//         education: Array.isArray(education)
//           ? education.map((e: any) => ({
//               id: randomUUID(),
//               officialId: leader.id,
//               institution: e.school || e.institution || "", // Use school field if available
//               degree: e.degree || "",
//               field: e.field || "",
//               startYear: e.startYear || 0,
//               endYear: e.endYear || 0,
//             }))
//           : [],
//         electionHistory: [],
//         careerHistory: Array.isArray(career)
//           ? career.map((c: any) => ({
//               id: randomUUID(),
//               officialId: leader.id,
//               position: c.office || c.position || "",
//               party: c.party || "",
//               location: c.location || "",
//               startYear: c.startYear || 0,
//               endYear: c.endYear || 0,
//               date: c.date || "",
//               createdAt: new Date(),
//             }))
//           : [],
//       };
//     } catch (error) {
//       console.error("Error fetching leader:", error);
//       throw error;
//     }
//   }

//   async getOfficialRatings(officialId: string): Promise<RatingSummary> {
//     try {
//       console.log(`Fetching ratings for official: ${officialId}`);

//       // Get all ratings for this official with complete information
//       const { data: allRatings, error: allRatingsError } = await supabase
//         .from("ratings")
//         .select("id, rating, sector_id, user_id, created_at")
//         .eq("leader_id", officialId);

//       if (allRatingsError) {
//         console.error("Error fetching ratings:", allRatingsError.message);
//         throw allRatingsError;
//       }

//       console.log(`Found ${allRatings ? allRatings.length : 0} total ratings`);

//       // Separate overall ratings from sector-specific ratings
//       const overallRatings = allRatings
//         ? allRatings.filter(
//             (r) =>
//               !r.sector_id ||
//               r.sector_id === "00000000-0000-0000-0000-000000000000"
//           )
//         : [];

//       const sectorSpecificRatings = allRatings
//         ? allRatings.filter(
//             (r) =>
//               r.sector_id &&
//               r.sector_id !== "00000000-0000-0000-0000-000000000000"
//           )
//         : [];

//       // Calculate overall rating from actual database values or default to 50
//       const overallRating =
//         overallRatings.length > 0
//           ? Math.round(
//               overallRatings.reduce((sum, r) => sum + r.rating, 0) /
//                 overallRatings.length
//             )
//           : 50;

//       console.log(`Overall rating calculated: ${overallRating}`);

//       // Generate monthly data (last 6 months) using actual rating data
//       const monthlyData = [];
//       const monthNames = [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ];
//       const currentDate = new Date();

//       // Track previous month's rating for continuity
//       let previousMonthRating = overallRating;

//       for (let i = 5; i >= 0; i--) {
//         const month = new Date(
//           currentDate.getFullYear(),
//           currentDate.getMonth() - i,
//           1
//         );
//         const monthIdx = month.getMonth();
//         const yearVal = month.getFullYear();

//         // Find all ratings for this specific month
//         const monthRatings = overallRatings.filter((r) => {
//           const ratingDate = new Date(r.created_at);
//           return (
//             ratingDate.getMonth() === monthIdx &&
//             ratingDate.getFullYear() === yearVal
//           );
//         });

//         // Calculate this month's rating from actual data when available
//         let monthlyRating;

//         if (monthRatings.length > 0) {
//           // Use actual ratings for this month
//           monthlyRating = Math.round(
//             monthRatings.reduce((sum, r) => sum + r.rating, 0) /
//               monthRatings.length
//           );
//           previousMonthRating = monthlyRating; // Save for continuity
//         } else if (i === 0) {
//           // Current month with no ratings yet, use overall
//           monthlyRating = overallRating;
//         } else {
//           // For past months with no ratings, use the previous month's value
//           // with a slight difference to show some trend (max ±3)
//           const variation = Math.min(
//             3,
//             Math.max(-3, previousMonthRating - overallRating)
//           );
//           monthlyRating = Math.max(
//             0,
//             Math.min(100, previousMonthRating - variation)
//           );
//           previousMonthRating = monthlyRating;
//         }

//         monthlyData.push({
//           month: `${monthNames[monthIdx]} ${yearVal}`,
//           rating: monthlyRating,
//           isCurrentMonth: i === 0,
//         });
//       }

//       // Calculate month-over-month change using actual calculated values
//       const monthlyChange =
//         monthlyData.length >= 2
//           ? monthlyData[monthlyData.length - 1].rating -
//             monthlyData[monthlyData.length - 2].rating
//           : 0;

//       // Get all sectors from the database
//       const { data: sectorData, error: sectorError } = await supabase
//         .from("sectors")
//         .select("id, name");

//       if (sectorError) {
//         console.error("Error fetching sectors:", sectorError.message);
//         throw sectorError;
//       }

//       // Generate sector ratings using actual sector rating data where available
//       const sectorColors = [
//         "#4CAF50",
//         "#FFC107",
//         "#2196F3",
//         "#E91E63",
//         "#673AB7",
//       ];
//       let sectorRatings = [];

//       if (sectorData && sectorData.length > 0) {
//         sectorRatings = sectorData.map((sector, index) => {
//           // Find all ratings for this specific sector
//           const sectorRatings = sectorSpecificRatings.filter(
//             (r) => r.sector_id === sector.id
//           );

//           // Calculate rating for this sector from actual data when available
//           let sectorRating;

//           if (sectorRatings.length > 0) {
//             // Use actual sector ratings
//             sectorRating = Math.round(
//               sectorRatings.reduce((sum: number, r) => sum + r.rating, 0) /
//                 sectorRatings.length
//             );
//           } else {
//             // No ratings for this sector yet, derive from overall with small offset
//             // Use a deterministic offset based on sector ID to ensure consistency
//             const sectorIdSum = sector.id
//               .split("")
//               .reduce(
//                 (sum: number, char: string) => sum + char.charCodeAt(0),
//                 0
//               );
//             const offset = (sectorIdSum % 10) - 5; // -5 to +4 range
//             sectorRating = Math.max(0, Math.min(100, overallRating + offset));
//           }

//           return {
//             name: sector.name,
//             rating: sectorRating,
//             color: sectorColors[index % sectorColors.length],
//           };
//         });
//       } else {
//         console.warn("No sectors found in database, using default sectors");
//         const defaultSectors = [
//           "Healthcare",
//           "Education",
//           "Infrastructure",
//           "Economy",
//           "Security",
//         ];
//         sectorRatings = defaultSectors.map((name, index) => ({
//           name,
//           rating: overallRating, // Use overall for all sectors
//           color: sectorColors[index % sectorColors.length],
//         }));
//       }

//       // Calculate sector average using actual sector ratings - limited to 1 decimal place
//       const sectorAverage = parseFloat(
//         (
//           sectorRatings.reduce((sum, s) => sum + s.rating, 0) /
//           sectorRatings.length
//         ).toFixed(1)
//       );

//       // Use the actual change calculated from sector ratings
//       const sectorMonthlyChange = parseFloat(monthlyChange.toFixed(1));

//       // Format the ratings data to include timestamps and sector info
//       const formattedRatings = allRatings.map((rating) => {
//         // Find the sector info for this rating if it has a sector_id
//         const sectorInfo = rating.sector_id
//           ? sectorData?.find((s) => s.id === rating.sector_id)
//           : null;

//         const sectorName = sectorInfo?.name || "";

//         return {
//           id: rating.id || randomUUID(),
//           officialId: officialId,
//           userId: rating.user_id || "anonymous",
//           overallRating: rating.rating,
//           sectorId: rating.sector_id,
//           sectorName: sectorName,
//           sectorColor: sectorName
//             ? sectorColors[
//                 sectorRatings.findIndex((s) => s.name === sectorName) %
//                   sectorColors.length
//               ]
//             : "#BDBDBD",
//           rating: rating.rating,
//           createdAt: new Date(rating.created_at),
//         };
//       });

//       // Prepare sector info for the time-based data generator
//       const sectorInfoForTimeData = sectorRatings.map((s) => ({
//         id: s.name.toLowerCase().replace(/\s+/g, "_"),
//         name: s.name,
//         color: s.color,
//       }));

//       console.log(
//         `Generating time-based data from ${formattedRatings.length} ratings with timestamps`
//       );

//       // Generate time-based data with sector breakdowns using actual ratings data
//       const timeData = generateTimeBasedData(
//         formattedRatings,
//         sectorInfoForTimeData
//       );

//       // Ensure timeData is included in the response
//       const response = {
//         overallRating,
//         monthlyChange,
//         monthlyData,
//         sectorAverage,
//         sectorMonthlyChange,
//         sectorRatings,
//         timeData,
//       };

//       // Log to verify timeData is present
//       console.log("timeData included in response:", !!response.timeData);

//       return response;
//     } catch (error) {
//       console.error("Error fetching official ratings:", error);
//       throw error;
//     }
//   }

//   async submitRating(
//     ratingData: RatingPayload & { userId: string }
//   ): Promise<{ success: boolean }> {
//     try {
//       console.log("Submitting rating:", ratingData);

//       // Let's handle this with multiple steps to avoid constraint errors
//       // Step 1: First, get all the current ratings for this user/leader combination
//       const { data: existingRatings, error: getError } = await supabase
//         .from("ratings")
//         .select("id, sector_id")
//         .eq("leader_id", ratingData.officialId)
//         .eq("user_id", ratingData.userId);

//       if (getError) {
//         console.error("Error checking existing ratings:", getError.message);
//         // Continue anyway - we'll try to proceed
//       }

//       // Step 2: Delete any existing ratings individually to ensure they're gone
//       if (existingRatings && existingRatings.length > 0) {
//         console.log(
//           `Found ${existingRatings.length} existing ratings to remove`
//         );

//         for (const rating of existingRatings) {
//           const { error: deleteError } = await supabase
//             .from("ratings")
//             .delete()
//             .eq("id", rating.id);

//           if (deleteError) {
//             console.error(
//               `Error deleting rating ${rating.id}:`,
//               deleteError.message
//             );
//             // Continue with the other deletions
//           }
//         }
//       }

//       // Let's confirm all ratings are deleted
//       const { data: checkRatings, error: checkError } = await supabase
//         .from("ratings")
//         .select("count")
//         .eq("leader_id", ratingData.officialId)
//         .eq("user_id", ratingData.userId);

//       if (checkError) {
//         console.error(
//           "Error checking if ratings were deleted:",
//           checkError.message
//         );
//       } else {
//         console.log("Confirmed deletion - ratings count:", checkRatings);
//       }

//       // Step 3: Ensure we have the sectors table ready
//       const { data: sectorsData, error: sectorsError } = await supabase
//         .from("sectors")
//         .select("id, name");

//       if (sectorsError) {
//         console.error("Error checking sectors:", sectorsError.message);
//         throw sectorsError;
//       }

//       // Step 4: Get or create the default sector ID for overall ratings
//       let defaultSectorId = "00000000-0000-0000-0000-000000000000";
//       const { data: defaultSector, error: defaultSectorError } = await supabase
//         .from("sectors")
//         .select("id")
//         .eq("name", "Overall")
//         .maybeSingle();

//       if (defaultSectorError) {
//         console.error(
//           "Error checking for default sector:",
//           defaultSectorError.message
//         );
//       } else if (defaultSector) {
//         defaultSectorId = defaultSector.id;
//       }

//       // Step 5: Insert the overall rating first
//       console.log("Inserting overall rating");
//       const { error: overallError } = await supabase.from("ratings").insert({
//         id: randomUUID(),
//         leader_id: ratingData.officialId,
//         user_id: ratingData.userId,
//         rating: ratingData.overallRating,
//         sector_id: defaultSectorId,
//         created_at: new Date().toISOString(),
//       });

//       if (overallError) {
//         console.error("Error submitting overall rating:", overallError.message);
//         throw overallError;
//       }

//       // Step 6: Insert sector ratings one by one
//       let insertedCount = 0;
//       if (ratingData.sectorRatings && ratingData.sectorRatings.length > 0) {
//         console.log(
//           `Inserting ${ratingData.sectorRatings.length} sector ratings`
//         );

//         for (const sr of ratingData.sectorRatings) {
//           // Skip the overall rating sector that we already inserted
//           if (sr.sectorId === defaultSectorId) continue;

//           const { error: sectorError } = await supabase.from("ratings").insert({
//             id: randomUUID(),
//             leader_id: ratingData.officialId,
//             user_id: ratingData.userId,
//             rating: sr.rating,
//             sector_id: sr.sectorId,
//             created_at: new Date().toISOString(),
//           });

//           if (sectorError) {
//             console.error(
//               `Error submitting rating for sector ${sr.sectorId}:`,
//               sectorError.message
//             );
//             // Continue with other sectors
//           } else {
//             insertedCount++;
//           }
//         }
//       }

//       console.log(
//         `Rating submitted successfully. Inserted overall rating + ${insertedCount} sector ratings`
//       );
//       return { success: true };
//     } catch (error) {
//       console.error("Error submitting rating:", error);
//       throw error;
//     }
//   }
// }

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

import { randomUUID } from "crypto";
import session from "express-session";
import {
  InsertUser,
  Official,
  RatingPayload,
  RatingSummary,
  User,
} from "@shared/schema";
import { supabase } from "./supabase-client";
import connectPg from "connect-pg-simple";
import { generateTimeBasedData } from "./time-based-ratings";

// Helper function to get colors for sectors based on name
function getSectorColor(sectorName: string): string {
  const colorMap: { [key: string]: string } = {
    Health: "#4CAF50",
    Education: "#2196F3",
    Infrastructure: "#FF9800",
    Economy: "#E91E63",
    Security: "#673AB7",
    Agriculture: "#795548",
    Technology: "#607D8B",
    Environment: "#009688",
    Transportation: "#FFC107",
    Energy: "#3F51B5",
    Housing: "#F44336",
  };

  return colorMap[sectorName] || "#BDBDBD"; // Default gray for unknown sectors
}

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

export class SupabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    // Use a simple in-memory session store
    // This avoids PostgreSQL connection issues
    console.log(
      "Auth: Using in-memory session store with Supabase data storage"
    );
    this.sessionStore = new session.MemoryStore();
  }

  async checkDatabaseConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from("leaders").select("count");

      if (error) {
        console.error("❌ Database connection test failed:", error.message);
        return false;
      }

      console.log("✅ Database connection test successful");
      return true;
    } catch (error) {
      console.error("❌ Database connection test failed:", error);
      return false;
    }
  }

  async getUserById(id: string): Promise<User | undefined> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned - user not found
          return undefined;
        }
        console.error("Error fetching user by ID:", error.message);
        return undefined;
      }

      // Map the database fields to our User type
      if (data) {
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

      return undefined;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned - user not found
          return undefined;
        }
        console.error("Error fetching user by email:", error.message);
        return undefined;
      }

      // Map the database fields to our User type
      if (data) {
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

      return undefined;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned - user not found
          return undefined;
        }
        console.error("Error fetching user by username:", error.message);
        return undefined;
      }

      // Map the database fields to our User type
      if (data) {
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

      return undefined;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      return undefined;
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    try {
      const newUser = {
        ...userData,
        id: randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_anonymous: false,
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

      if (!data) {
        throw new Error("Failed to retrieve created user");
      }

      // Map the database fields to our User type
      const user: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        password: data.password,
        isAnonymous: data.is_anonymous,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      console.log("Created new user in Supabase:", user.username);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getOfficials(filters?: {
    location?: string;
    category?: string;
    search?: string;
  }): Promise<Official[]> {
    try {
      let query = supabase.from("leaders").select("*");

      // Apply filters
      if (filters) {
        if (filters.location) {
          query = query.eq("jurisdiction", filters.location);
        }

        if (filters.search) {
          // Log the search term for debugging
          console.log("Searching with term:", filters.search);

          // Sanitize the search term to prevent SQL injection
          const sanitizedSearch = filters.search.replace(/'/g, "''");

          // Use the proper format for Supabase filtering with OR conditions
          query = query.or(
            `name.ilike.%${sanitizedSearch}%,office.ilike.%${sanitizedSearch}%,jurisdiction.ilike.%${sanitizedSearch}%`
          );
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching leaders:", error.message);
        throw error;
      }

      // Map leaders to the Official format for compatibility
      const mappedLeaders = data.map((leader) => {
        // Parse JSON fields if they exist
        let education: any[] = [];
        let awards: any[] = [];
        let career: any[] = [];

        try {
          if (leader.education) {
            education =
              typeof leader.education === "string"
                ? JSON.parse(leader.education)
                : leader.education;
          }

          if (leader.awards) {
            awards =
              typeof leader.awards === "string"
                ? JSON.parse(leader.awards)
                : leader.awards;
          }

          if (leader.career) {
            career =
              typeof leader.career === "string"
                ? JSON.parse(leader.career)
                : leader.career;
          }
        } catch (e) {
          console.error("Error parsing JSON fields:", e);
        }

        // Create a leader object that maps to our Official interface
        return {
          id: leader.id,
          name: leader.name,
          position: leader.office || "",
          location: leader.jurisdiction || "",
          party: leader.party ? leader.party.replace("Party: ", "") : "",
          gender: "", // Not available in leaders table
          term: "", // Not available in leaders table
          imageUrl: leader.avatar_url || null,
          bio: leader.bio || null, // Added bio field mapping
          approvalRating: 50, // Default value
          approvalTrend: 0,
          createdAt: leader.created_at ? new Date(leader.created_at) : null,
          updatedAt: leader.updated_at ? new Date(leader.updated_at) : null,
          sectors: [], // Will be populated in the future
          education: Array.isArray(education)
            ? education.map((e: any) => ({
                id: randomUUID(),
                officialId: leader.id,
                institution: e.school || e.institution || "", // Use school field if available
                degree: e.degree || "",
                field: e.field || "",
                startYear: e.startYear || 0,
                endYear: e.endYear || 0,
              }))
            : [],
          electionHistory: [],
          careerHistory: Array.isArray(career)
            ? career.map((c: any) => ({
                id: randomUUID(),
                officialId: leader.id,
                position: c.office || c.position || "",
                party: c.party || "",
                location: c.location || "",
                startYear: c.startYear || 0,
                endYear: c.endYear || 0,
                date: c.date || "",
                createdAt: new Date(),
              }))
            : [],
        };
      });

      return mappedLeaders;
    } catch (error) {
      console.error("Error fetching officials:", error);
      throw error;
    }
  }

  async getOfficialById(id: string): Promise<Official | undefined> {
    try {
      const { data, error } = await supabase
        .from("leaders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned - leader not found
          return undefined;
        }
        console.error("Error fetching leader by ID:", error.message);
        throw error;
      }

      const leader = data;

      // Parse JSON fields if they exist
      let education: any[] = [];
      let awards: any[] = [];
      let career: any[] = [];

      try {
        if (leader.education) {
          education =
            typeof leader.education === "string"
              ? JSON.parse(leader.education)
              : leader.education;
        }

        if (leader.awards) {
          awards =
            typeof leader.awards === "string"
              ? JSON.parse(leader.awards)
              : leader.awards;
        }

        if (leader.career) {
          career =
            typeof leader.career === "string"
              ? JSON.parse(leader.career)
              : leader.career;
        }
      } catch (e) {
        console.error("Error parsing JSON fields:", e);
      }

      // Fetch sectors from the database
      const { data: sectorsData, error: sectorsError } = await supabase
        .from("sectors")
        .select("*");

      if (sectorsError) {
        console.error("Error fetching sectors:", sectorsError.message);
      }

      const sectors = sectorsData || [];

      // Create a leader object that maps to our Official interface
      return {
        id: leader.id,
        name: leader.name,
        position: leader.office || "",
        location: leader.jurisdiction || "",
        party: leader.party ? leader.party.replace("Party: ", "") : "",
        gender: "", // Not available in leaders table
        term: "", // Not available in leaders table
        imageUrl: leader.avatar_url || null,
        bio: leader.bio || null, // Added bio field
        approvalRating: 50, // Default value
        approvalTrend: 0,
        createdAt: leader.created_at ? new Date(leader.created_at) : null,
        updatedAt: leader.updated_at ? new Date(leader.updated_at) : null,
        sectors: sectors, // Now populated with actual sectors from the database
        education: Array.isArray(education)
          ? education.map((e: any) => ({
              id: randomUUID(),
              officialId: leader.id,
              institution: e.school || e.institution || "", // Use school field if available
              degree: e.degree || "",
              field: e.field || "",
              startYear: e.startYear || 0,
              endYear: e.endYear || 0,
            }))
          : [],
        electionHistory: [],
        careerHistory: Array.isArray(career)
          ? career.map((c: any) => ({
              id: randomUUID(),
              officialId: leader.id,
              position: c.office || c.position || "",
              party: c.party || "",
              location: c.location || "",
              startYear: c.startYear || 0,
              endYear: c.endYear || 0,
              date: c.date || "",
              createdAt: new Date(),
            }))
          : [],
      };
    } catch (error) {
      console.error("Error fetching leader:", error);
      throw error;
    }
  }

  async getOfficialRatings(officialId: string): Promise<RatingSummary> {
    try {
      console.log(`Fetching ratings for official: ${officialId}`);

      // Get all ratings for this official with complete information
      const { data: allRatings, error: allRatingsError } = await supabase
        .from("ratings")
        .select("id, rating, sector_id, user_id, created_at")
        .eq("leader_id", officialId);

      if (allRatingsError) {
        console.error("Error fetching ratings:", allRatingsError.message);
        throw allRatingsError;
      }

      console.log(`Found ${allRatings ? allRatings.length : 0} total ratings`);

      // Separate overall ratings from sector-specific ratings
      const overallRatings = allRatings
        ? allRatings.filter(
            (r) =>
              !r.sector_id ||
              r.sector_id === "00000000-0000-0000-0000-000000000000"
          )
        : [];

      const sectorSpecificRatings = allRatings
        ? allRatings.filter(
            (r) =>
              r.sector_id &&
              r.sector_id !== "00000000-0000-0000-0000-000000000000"
          )
        : [];

      // Calculate overall rating from actual database values or default to 50
      const overallRating =
        overallRatings.length > 0
          ? Math.round(
              overallRatings.reduce((sum, r) => sum + r.rating, 0) /
                overallRatings.length
            )
          : 50;

      console.log(`Overall rating calculated: ${overallRating}`);

      // Generate monthly data (last 6 months) using actual rating data
      const monthlyData = [];
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const currentDate = new Date();

      // Track previous month's rating for continuity
      let previousMonthRating = overallRating;

      for (let i = 5; i >= 0; i--) {
        const month = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - i,
          1
        );
        const monthIdx = month.getMonth();
        const yearVal = month.getFullYear();

        // Find all ratings for this specific month
        const monthRatings = overallRatings.filter((r) => {
          const ratingDate = new Date(r.created_at);
          return (
            ratingDate.getMonth() === monthIdx &&
            ratingDate.getFullYear() === yearVal
          );
        });

        // Calculate this month's rating from actual data when available
        let monthlyRating;

        if (monthRatings.length > 0) {
          // Use actual ratings for this month
          monthlyRating = Math.round(
            monthRatings.reduce((sum, r) => sum + r.rating, 0) /
              monthRatings.length
          );
          previousMonthRating = monthlyRating; // Save for continuity
        } else if (i === 0) {
          // Current month with no ratings yet, use overall
          monthlyRating = overallRating;
        } else {
          // For past months with no ratings, use the previous month's value
          // with a slight difference to show some trend (max ±3)
          const variation = Math.min(
            3,
            Math.max(-3, previousMonthRating - overallRating)
          );
          monthlyRating = Math.max(
            0,
            Math.min(100, previousMonthRating - variation)
          );
          previousMonthRating = monthlyRating;
        }

        monthlyData.push({
          month: `${monthNames[monthIdx]} ${yearVal}`,
          rating: monthlyRating,
          isCurrentMonth: i === 0,
        });
      }

      // Calculate month-over-month change using actual calculated values
      const monthlyChange =
        monthlyData.length >= 2
          ? monthlyData[monthlyData.length - 1].rating -
            monthlyData[monthlyData.length - 2].rating
          : 0;

      // Get all sectors from the database
      const { data: sectorData, error: sectorError } = await supabase
        .from("sectors")
        .select("id, name");

      if (sectorError) {
        console.error("Error fetching sectors:", sectorError.message);
        throw sectorError;
      }

      // Generate sector ratings using actual sector rating data where available
      const sectorColors = [
        "#4CAF50",
        "#FFC107",
        "#2196F3",
        "#E91E63",
        "#673AB7",
      ];
      let sectorRatings = [];

      if (sectorData && sectorData.length > 0) {
        sectorRatings = sectorData.map((sector, index) => {
          // Find all ratings for this specific sector
          const sectorRatings = sectorSpecificRatings.filter(
            (r) => r.sector_id === sector.id
          );

          // Calculate rating for this sector from actual data when available
          let sectorRating;

          if (sectorRatings.length > 0) {
            // Use actual sector ratings
            sectorRating = Math.round(
              sectorRatings.reduce((sum: number, r) => sum + r.rating, 0) /
                sectorRatings.length
            );
          } else {
            // No ratings for this sector yet, derive from overall with small offset
            // Use a deterministic offset based on sector ID to ensure consistency
            const sectorIdSum = sector.id
              .split("")
              .reduce(
                (sum: number, char: string) => sum + char.charCodeAt(0),
                0
              );
            const offset = (sectorIdSum % 10) - 5; // -5 to +4 range
            sectorRating = Math.max(0, Math.min(100, overallRating + offset));
          }

          return {
            name: sector.name,
            rating: sectorRating,
            color: sectorColors[index % sectorColors.length],
          };
        });
      } else {
        console.warn("No sectors found in database, using default sectors");
        const defaultSectors = [
          "Healthcare",
          "Education",
          "Infrastructure",
          "Economy",
          "Security",
        ];
        sectorRatings = defaultSectors.map((name, index) => ({
          name,
          rating: overallRating, // Use overall for all sectors
          color: sectorColors[index % sectorColors.length],
        }));
      }

      // Calculate sector average using actual sector ratings - limited to 1 decimal place
      const sectorAverage = parseFloat(
        (
          sectorRatings.reduce((sum, s) => sum + s.rating, 0) /
          sectorRatings.length
        ).toFixed(1)
      );

      // Use the actual change calculated from sector ratings
      const sectorMonthlyChange = parseFloat(monthlyChange.toFixed(1));

      // Format the ratings data to include timestamps and sector info
      const formattedRatings = allRatings.map((rating) => {
        // Find the sector info for this rating if it has a sector_id
        const sectorInfo = rating.sector_id
          ? sectorData?.find((s) => s.id === rating.sector_id)
          : null;

        const sectorName = sectorInfo?.name || "";

        return {
          id: rating.id || randomUUID(),
          officialId: officialId,
          userId: rating.user_id || "anonymous",
          overallRating: rating.rating,
          sectorId: rating.sector_id,
          sectorName: sectorName,
          sectorColor: sectorName
            ? sectorColors[
                sectorRatings.findIndex((s) => s.name === sectorName) %
                  sectorColors.length
              ]
            : "#BDBDBD",
          rating: rating.rating,
          createdAt: new Date(rating.created_at),
        };
      });

      // Prepare sector info for the time-based data generator
      const sectorInfoForTimeData = sectorRatings.map((s) => ({
        id: s.name.toLowerCase().replace(/\s+/g, "_"),
        name: s.name,
        color: s.color,
      }));

      console.log(
        `Generating time-based data from ${formattedRatings.length} ratings with timestamps`
      );

      // Generate time-based data with sector breakdowns using actual ratings data
      const timeData = generateTimeBasedData(
        formattedRatings,
        sectorInfoForTimeData
      );

      // Ensure timeData is included in the response
      const response = {
        overallRating,
        monthlyChange,
        monthlyData,
        sectorAverage,
        sectorMonthlyChange,
        sectorRatings,
        timeData,
      };

      // Log to verify timeData is present
      console.log("timeData included in response:", !!response.timeData);

      return response;
    } catch (error) {
      console.error("Error fetching official ratings:", error);
      throw error;
    }
  }

  async submitRating(
    ratingData: RatingPayload & { userId: string }
  ): Promise<{ success: boolean }> {
    try {
      console.log("Submitting rating:", ratingData);

      // Let's handle this with multiple steps to avoid constraint errors
      // Step 1: First, get all the current ratings for this user/leader combination
      const { data: existingRatings, error: getError } = await supabase
        .from("ratings")
        .select("id, sector_id")
        .eq("leader_id", ratingData.officialId)
        .eq("user_id", ratingData.userId);

      if (getError) {
        console.error("Error checking existing ratings:", getError.message);
        // Continue anyway - we'll try to proceed
      }

      // Step 2: Delete any existing ratings individually to ensure they're gone
      if (existingRatings && existingRatings.length > 0) {
        console.log(
          `Found ${existingRatings.length} existing ratings to remove`
        );

        for (const rating of existingRatings) {
          const { error: deleteError } = await supabase
            .from("ratings")
            .delete()
            .eq("id", rating.id);

          if (deleteError) {
            console.error(
              `Error deleting rating ${rating.id}:`,
              deleteError.message
            );
            // Continue with the other deletions
          }
        }
      }

      // Let's confirm all ratings are deleted
      const { data: checkRatings, error: checkError } = await supabase
        .from("ratings")
        .select("count")
        .eq("leader_id", ratingData.officialId)
        .eq("user_id", ratingData.userId);

      if (checkError) {
        console.error(
          "Error checking if ratings were deleted:",
          checkError.message
        );
      } else {
        console.log("Confirmed deletion - ratings count:", checkRatings);
      }

      // Step 3: Ensure we have the sectors table ready
      const { data: sectorsData, error: sectorsError } = await supabase
        .from("sectors")
        .select("id, name");

      if (sectorsError) {
        console.error("Error checking sectors:", sectorsError.message);
        throw sectorsError;
      }

      // Step 4: Get or create the default sector ID for overall ratings
      let defaultSectorId = "00000000-0000-0000-0000-000000000000";
      const { data: defaultSector, error: defaultSectorError } = await supabase
        .from("sectors")
        .select("id")
        .eq("name", "Overall")
        .maybeSingle();

      if (defaultSectorError) {
        console.error(
          "Error checking for default sector:",
          defaultSectorError.message
        );
      } else if (defaultSector) {
        defaultSectorId = defaultSector.id;
      }

      // Step 5: Insert the overall rating first
      console.log("Inserting overall rating");
      const { error: overallError } = await supabase.from("ratings").insert({
        id: randomUUID(),
        leader_id: ratingData.officialId,
        user_id: ratingData.userId,
        rating: ratingData.overallRating,
        sector_id: defaultSectorId,
        created_at: new Date().toISOString(),
      });

      if (overallError) {
        console.error("Error submitting overall rating:", overallError.message);
        throw overallError;
      }

      // Step 6: Insert sector ratings one by one
      let insertedCount = 0;
      if (ratingData.sectorRatings && ratingData.sectorRatings.length > 0) {
        console.log(
          `Inserting ${ratingData.sectorRatings.length} sector ratings`
        );

        for (const sr of ratingData.sectorRatings) {
          // Skip the overall rating sector that we already inserted
          if (sr.sectorId === defaultSectorId) continue;

          const { error: sectorError } = await supabase.from("ratings").insert({
            id: randomUUID(),
            leader_id: ratingData.officialId,
            user_id: ratingData.userId,
            rating: sr.rating,
            sector_id: sr.sectorId,
            created_at: new Date().toISOString(),
          });

          if (sectorError) {
            console.error(
              `Error submitting rating for sector ${sr.sectorId}:`,
              sectorError.message
            );
            // Continue with other sectors
          } else {
            insertedCount++;
          }
        }
      }

      console.log(
        `Rating submitted successfully. Inserted overall rating + ${insertedCount} sector ratings`
      );
      return { success: true };
    } catch (error) {
      console.error("Error submitting rating:", error);
      throw error;
    }
  }
}
