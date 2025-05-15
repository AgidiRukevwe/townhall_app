import { 
  Official, 
  RatingPayload, 
  RatingSummary,
  Sector,
  Election,
  Career,
  User as SelectUser,
  InsertUser
} from "../shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, ilike, or, and, sql } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "../shared/schema";

export interface IStorage {
  // Database utilities
  checkDatabaseConnection(): Promise<boolean>;
  
  // User methods
  getUserById(id: string): Promise<SelectUser | undefined>;
  getUserByEmail(email: string): Promise<SelectUser | undefined>;
  createUser(userData: InsertUser): Promise<SelectUser>;
  
  // Officials methods
  getOfficials(filters?: { location?: string; category?: string; search?: string }): Promise<Official[]>;
  getOfficialById(id: string): Promise<Official | undefined>;
  getOfficialRatings(officialId: string): Promise<RatingSummary>;
  submitRating(ratingData: RatingPayload & { userId: string }): Promise<{ success: boolean }>;
}

export class SupabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private connectionString: string;
  
  constructor() {
    // First format check: if DATABASE_URL starts with postgres:// or postgresql://, it's likely valid
    if (process.env.DATABASE_URL && 
        (process.env.DATABASE_URL.startsWith('postgres://') || process.env.DATABASE_URL.startsWith('postgresql://'))) {
      this.connectionString = process.env.DATABASE_URL;
      console.log("Using properly formatted DATABASE_URL for connection");
    } 
    // Otherwise try to construct a valid URL from PG_ variables
    else if (process.env.PGHOST && process.env.PGDATABASE && process.env.PGUSER && process.env.PGPASSWORD) {
      const port = process.env.PGPORT || '5432';
      this.connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${port}/${process.env.PGDATABASE}`;
      console.log("Constructed connection string from PG environment variables");
      
      // Also set DATABASE_URL for other tools that expect it
      process.env.DATABASE_URL = this.connectionString;
    } 
    // If DATABASE_URL exists but isn't properly formatted, try to fix it
    else if (process.env.DATABASE_URL) {
      console.log("DATABASE_URL exists but needs reformatting");
      
      // Attempt to convert Supabase URL format if that's what we have
      if (process.env.DATABASE_URL.includes('supabase.co')) {
        // For Supabase, we need to extract parts and reconstruct
        try {
          // Extract parts from URL - this is a simple approach, might need adjustment
          const url = new URL(process.env.DATABASE_URL);
          const host = url.hostname;
          const database = 'postgres'; // Default for Supabase
          
          // Construct proper PostgreSQL URL from PG variables
          this.connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || '5432'}/${process.env.PGDATABASE || database}`;
          
          console.log("Reformatted Supabase URL to standard PostgreSQL URL");
          process.env.DATABASE_URL = this.connectionString;
        } catch (e) {
          console.error("Failed to reformat Supabase URL:", e);
          // Fallback to constructed URL from env vars
          this.connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || '5432'}/${process.env.PGDATABASE || 'postgres'}`;
        }
      } else {
        // Fallback for development
        this.connectionString = 'postgres://postgres:postgres@localhost:5432/postgres';
        console.log("Using fallback connection string");
      }
    } else {
      // Last resort fallback
      this.connectionString = 'postgres://postgres:postgres@localhost:5432/postgres';
      console.log("Using fallback development connection string");
    }
    
    console.log(`Connection string format check: ${this.connectionString.startsWith('postgres://') ? '✓' : '✗'}`);
    
    const client = postgres(this.connectionString);
    this.db = drizzle(client, { schema });
  }
  
  // Database utilities
  async checkDatabaseConnection(): Promise<boolean> {
    try {
      // Use the existing db client to run a query through Drizzle
      const result = await this.db.execute(sql`SELECT 1 as connected`);
      
      console.log("✅ Database connection test successful");
      return true;
    } catch (error) {
      console.error("❌ Database connection test failed:", error);
      throw error;
    }
  }
  
  // User methods
  async getUserById(id: string): Promise<SelectUser | undefined> {
    try {
      const users = await this.db.select().from(schema.users)
        .where(eq(schema.users.id, id));
      return users.length > 0 ? users[0] : undefined;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }
  
  async getUserByEmail(email: string): Promise<SelectUser | undefined> {
    try {
      const users = await this.db.select().from(schema.users)
        .where(eq(schema.users.email, email));
      return users.length > 0 ? users[0] : undefined;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  }
  
  async createUser(userData: InsertUser): Promise<SelectUser> {
    try {
      const [newUser] = await this.db.insert(schema.users)
        .values({
          ...userData,
          updatedAt: new Date(),
        })
        .returning();
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  async getOfficials(filters?: { location?: string; category?: string; search?: string }): Promise<Official[]> {
    try {
      let query = this.db.select().from(schema.officials);
      
      // Apply filters
      if (filters) {
        const conditions = [];
        
        if (filters.location) {
          conditions.push(eq(schema.officials.location, filters.location));
        }
        
        if (filters.search) {
          conditions.push(
            or(
              ilike(schema.officials.name, `%${filters.search}%`),
              ilike(schema.officials.position, `%${filters.search}%`),
              ilike(schema.officials.location, `%${filters.search}%`)
            )
          );
        }
        
        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }
      }
      
      const officials = await query;
      
      // Fetch related data for each official
      const officialsWithRelations = await Promise.all(
        officials.map(async (official) => {
          const sectors = await this.db.select().from(schema.sectors)
            .where(eq(schema.sectors.officialId, official.id));
            
          const electionHistory = await this.db.select().from(schema.elections)
            .where(eq(schema.elections.officialId, official.id));
            
          const careerHistory = await this.db.select().from(schema.careers)
            .where(eq(schema.careers.officialId, official.id));
            
          return {
            ...official,
            sectors,
            electionHistory,
            careerHistory
          };
        })
      );
      
      return officialsWithRelations;
    } catch (error) {
      console.error("Error fetching officials:", error);
      throw error;
    }
  }
  
  async getOfficialById(id: string): Promise<Official | undefined> {
    try {
      const officials = await this.db.select().from(schema.officials)
        .where(eq(schema.officials.id, id));
        
      if (officials.length === 0) {
        return undefined;
      }
      
      const official = officials[0];
      
      // Fetch related data
      const sectors = await this.db.select().from(schema.sectors)
        .where(eq(schema.sectors.officialId, id));
        
      const electionHistory = await this.db.select().from(schema.elections)
        .where(eq(schema.elections.officialId, id));
        
      const careerHistory = await this.db.select().from(schema.careers)
        .where(eq(schema.careers.officialId, id));
        
      return {
        ...official,
        sectors,
        electionHistory,
        careerHistory
      };
    } catch (error) {
      console.error("Error fetching official:", error);
      throw error;
    }
  }
  
  async getOfficialRatings(officialId: string): Promise<RatingSummary> {
    try {
      // Get the current month's average rating
      const currentMonthRatings = await this.db
        .select({
          avgRating: sql<number>`avg(${schema.ratings.overallRating})`,
        })
        .from(schema.ratings)
        .where(
          and(
            eq(schema.ratings.officialId, officialId),
            sql`${schema.ratings.createdAt} >= date_trunc('month', now())`
          )
        );
      
      // Get the previous month's average rating
      const prevMonthRatings = await this.db
        .select({
          avgRating: sql<number>`avg(${schema.ratings.overallRating})`,
        })
        .from(schema.ratings)
        .where(
          and(
            eq(schema.ratings.officialId, officialId),
            sql`${schema.ratings.createdAt} >= date_trunc('month', now()) - interval '1 month'`,
            sql`${schema.ratings.createdAt} < date_trunc('month', now())`
          )
        );
      
      // Calculate change
      const currentAvg = currentMonthRatings[0]?.avgRating || 0;
      const prevAvg = prevMonthRatings[0]?.avgRating || 0;
      const monthlyChange = currentAvg - prevAvg;
      
      // Get monthly data for the chart
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const currentMonth = new Date().getMonth();
      
      const monthlyData = months.map((month, index) => {
        const isCurrentMonth = index === currentMonth;
        return {
          month,
          rating: Math.floor(Math.random() * 50) + 20, // This would be real data in production
          isCurrentMonth
        };
      });
      
      // Get sector ratings
      const sectorRatingsData = await this.db
        .select({
          sectorId: schema.sectorRatings.sectorId,
          avgRating: sql<number>`avg(${schema.sectorRatings.rating})`,
        })
        .from(schema.sectorRatings)
        .innerJoin(
          schema.ratings,
          eq(schema.ratings.id, schema.sectorRatings.ratingId)
        )
        .where(eq(schema.ratings.officialId, officialId))
        .groupBy(schema.sectorRatings.sectorId);
      
      // Get sector info for each rating
      const sectorInfo = await this.db
        .select()
        .from(schema.sectors)
        .where(eq(schema.sectors.officialId, officialId));
      
      // Combine sector ratings with sector info
      const sectorRatings = sectorRatingsData.map(rating => {
        const sector = sectorInfo.find(s => s.id === rating.sectorId);
        return {
          name: sector?.name || 'Unknown Sector',
          rating: Math.round(rating.avgRating),
          color: sector?.color || 'blue'
        };
      });
      
      // If no sector ratings exist yet, use the sectors with default ratings
      if (sectorRatings.length === 0) {
        sectorInfo.forEach(sector => {
          sectorRatings.push({
            name: sector.name,
            rating: 50, // Default rating
            color: sector.color
          });
        });
      }
      
      // Calculate sector average
      const sectorAverage = sectorRatings.length > 0
        ? Math.round(sectorRatings.reduce((sum, s) => sum + s.rating, 0) / sectorRatings.length)
        : 0;
      
      return {
        overallRating: Math.round(currentAvg),
        monthlyChange,
        monthlyData,
        sectorAverage,
        sectorMonthlyChange: Math.floor(Math.random() * 10) - 5, // Random change for demo
        sectorRatings
      };
    } catch (error) {
      console.error("Error fetching official ratings:", error);
      throw error;
    }
  }
  
  async submitRating(ratingData: RatingPayload & { userId: string }): Promise<{ success: boolean }> {
    try {
      // Start a transaction
      await this.db.transaction(async (tx) => {
        // Insert the main rating
        const [rating] = await tx
          .insert(schema.ratings)
          .values({
            userId: ratingData.userId,
            officialId: ratingData.officialId,
            overallRating: ratingData.overallRating,
          })
          .returning();
        
        // Insert sector ratings
        if (ratingData.sectorRatings.length > 0) {
          await tx
            .insert(schema.sectorRatings)
            .values(
              ratingData.sectorRatings.map(sr => ({
                ratingId: rating.id,
                sectorId: sr.sectorId,
                rating: sr.rating,
              }))
            );
        }
        
        // Update the official's approval rating
        // This would typically be done with a more sophisticated algorithm
        // that takes into account all ratings, weighted by recency
        await tx
          .update(schema.officials)
          .set({
            approvalRating: ratingData.overallRating,
            updatedAt: new Date(),
          })
          .where(eq(schema.officials.id, ratingData.officialId));
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error submitting rating:", error);
      throw error;
    }
  }
}

// In-memory fallback for development
export class MemStorage implements IStorage {
  private users: SelectUser[] = [];
  
  // Database utilities
  async checkDatabaseConnection(): Promise<boolean> {
    // In-memory storage - no database to check
    console.log("✅ Using in-memory storage, no database connection needed");
    return true;
  }
  
  // User methods
  async getUserById(id: string): Promise<SelectUser | undefined> {
    return this.users.find(user => user.id === id);
  }
  
  async getUserByEmail(email: string): Promise<SelectUser | undefined> {
    return this.users.find(user => user.email === email);
  }
  
  async createUser(userData: InsertUser): Promise<SelectUser> {
    const newUser: SelectUser = {
      id: crypto.randomUUID(),
      ...userData,
      isAnonymous: userData.isAnonymous || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }
  
  private officials: Official[] = [
    {
      id: "1",
      name: "Bola Ahmed Tinubu",
      position: "President",
      location: "Nigeria",
      party: "APC",
      gender: "Male",
      term: "2023-2027",
      imageUrl: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=350",
      approvalRating: 26,
      approvalTrend: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      sectors: [
        { id: "s1", name: "Healthcare", color: "red", officialId: "1", createdAt: new Date() },
        { id: "s2", name: "Education", color: "blue", officialId: "1", createdAt: new Date() },
        { id: "s3", name: "Security", color: "green", officialId: "1", createdAt: new Date() },
        { id: "s4", name: "Economy", color: "yellow", officialId: "1", createdAt: new Date() },
        { id: "s5", name: "Foreign Policy", color: "purple", officialId: "1", createdAt: new Date() }
      ],
      electionHistory: [
        { id: "e1", officialId: "1", year: 2023, type: "General Elections", party: "APC", position: "President", result: "won", createdAt: new Date() },
        { id: "e2", officialId: "1", year: 2019, type: "General Elections", party: "APC", position: "Senator", result: "won", createdAt: new Date() },
        { id: "e3", officialId: "1", year: 2015, type: "General Elections", party: "APC", position: "Senator", result: "won", createdAt: new Date() }
      ],
      careerHistory: [
        { id: "c1", officialId: "1", position: "Senator", party: "APC", location: "Lagos West", startYear: 2015, endYear: 2023, createdAt: new Date() },
        { id: "c2", officialId: "1", position: "Governor", party: "AD", location: "Lagos State", startYear: 1999, endYear: 2007, createdAt: new Date() },
        { id: "c3", officialId: "1", position: "Senator", party: "SDP", location: "Lagos West", startYear: 1992, endYear: 1993, createdAt: new Date() }
      ]
    },
    {
      id: "2",
      name: "Babajide Sanwoolu",
      position: "Governor",
      location: "Lagos state",
      party: "APC",
      gender: "Male",
      term: "2023-2027",
      imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=350",
      approvalRating: 20,
      approvalTrend: -3,
      createdAt: new Date(),
      updatedAt: new Date(),
      sectors: [
        { id: "s6", name: "Healthcare", color: "red", officialId: "2", createdAt: new Date() },
        { id: "s7", name: "Education", color: "blue", officialId: "2", createdAt: new Date() },
        { id: "s8", name: "Security", color: "green", officialId: "2", createdAt: new Date() },
        { id: "s9", name: "Infrastructure", color: "yellow", officialId: "2", createdAt: new Date() }
      ],
      electionHistory: [
        { id: "e4", officialId: "2", year: 2023, type: "General Elections", party: "APC", position: "Governor", result: "won", createdAt: new Date() },
        { id: "e5", officialId: "2", year: 2019, type: "General Elections", party: "APC", position: "Governor", result: "won", createdAt: new Date() }
      ],
      careerHistory: [
        { id: "c4", officialId: "2", position: "Governor", party: "APC", location: "Lagos State", startYear: 2019, endYear: 2027, createdAt: new Date() },
        { id: "c5", officialId: "2", position: "Commissioner", party: "APC", location: "Lagos State", startYear: 2016, endYear: 2019, createdAt: new Date() }
      ]
    },
    {
      id: "3",
      name: "Michael Scott",
      position: "Senator",
      location: "Eti-Osa",
      party: "PDP",
      gender: "Male",
      term: "2023-2027",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=350",
      approvalRating: 30,
      approvalTrend: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      sectors: [
        { id: "s10", name: "Healthcare", color: "red", officialId: "3", createdAt: new Date() },
        { id: "s11", name: "Education", color: "blue", officialId: "3", createdAt: new Date() },
        { id: "s12", name: "Security", color: "green", officialId: "3", createdAt: new Date() }
      ],
      electionHistory: [
        { id: "e6", officialId: "3", year: 2023, type: "General Elections", party: "PDP", position: "Senator", result: "won", createdAt: new Date() },
        { id: "e7", officialId: "3", year: 2019, type: "General Elections", party: "PDP", position: "Senator", result: "won", createdAt: new Date() },
        { id: "e8", officialId: "3", year: 2015, type: "General Elections", party: "PDP", position: "Senator", result: "won", createdAt: new Date() }
      ],
      careerHistory: [
        { id: "c6", officialId: "3", position: "Senator", party: "PDP", location: "Eti-Osa, Lagos", startYear: 2015, endYear: 2027, createdAt: new Date() },
        { id: "c7", officialId: "3", position: "House Member", party: "PDP", location: "Eti-Osa, Lagos", startYear: 2011, endYear: 2015, createdAt: new Date() }
      ]
    },
    {
      id: "4",
      name: "Dapo Abiodun",
      position: "Governor",
      location: "Ogun state",
      party: "APC",
      gender: "Male",
      term: "2023-2027",
      imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=350",
      approvalRating: 32,
      approvalTrend: -1,
      createdAt: new Date(),
      updatedAt: new Date(),
      sectors: [
        { id: "s13", name: "Healthcare", color: "red", officialId: "4", createdAt: new Date() },
        { id: "s14", name: "Education", color: "blue", officialId: "4", createdAt: new Date() },
        { id: "s15", name: "Security", color: "green", officialId: "4", createdAt: new Date() },
        { id: "s16", name: "Agriculture", color: "yellow", officialId: "4", createdAt: new Date() }
      ],
      electionHistory: [
        { id: "e9", officialId: "4", year: 2023, type: "General Elections", party: "APC", position: "Governor", result: "won", createdAt: new Date() },
        { id: "e10", officialId: "4", year: 2019, type: "General Elections", party: "APC", position: "Governor", result: "won", createdAt: new Date() }
      ],
      careerHistory: [
        { id: "c8", officialId: "4", position: "Governor", party: "APC", location: "Ogun State", startYear: 2019, endYear: 2027, createdAt: new Date() },
        { id: "c9", officialId: "4", position: "CEO", party: "N/A", location: "Private Sector", startYear: 2005, endYear: 2019, createdAt: new Date() }
      ]
    }
  ];
  
  async getOfficials(filters?: { location?: string; category?: string; search?: string }): Promise<Official[]> {
    let filteredOfficials = [...this.officials];
    
    if (filters) {
      if (filters.location) {
        filteredOfficials = filteredOfficials.filter(
          o => o.location.toLowerCase() === filters.location?.toLowerCase()
        );
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredOfficials = filteredOfficials.filter(
          o => o.name.toLowerCase().includes(searchLower) || 
               o.position.toLowerCase().includes(searchLower) || 
               o.location.toLowerCase().includes(searchLower)
        );
      }
    }
    
    return filteredOfficials;
  }
  
  async getOfficialById(id: string): Promise<Official | undefined> {
    return this.officials.find(o => o.id === id);
  }
  
  async getOfficialRatings(officialId: string): Promise<RatingSummary> {
    const official = await this.getOfficialById(officialId);
    
    if (!official) {
      throw new Error("Official not found");
    }
    
    // Generate monthly data for chart
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currentMonth = new Date().getMonth();
    
    const monthlyData = months.map((month, index) => {
      const isCurrentMonth = index === currentMonth;
      return {
        month,
        rating: Math.floor(Math.random() * 50) + 20, // Random rating for demo
        isCurrentMonth
      };
    });
    
    // Generate sector ratings
    const sectorRatings = official.sectors.map(sector => ({
      name: sector.name,
      rating: Math.floor(Math.random() * 50) + 25, // Random rating for demo
      color: sector.color
    }));
    
    // Calculate sector average
    const sectorAverage = Math.round(
      sectorRatings.reduce((sum, s) => sum + s.rating, 0) / sectorRatings.length
    );
    
    return {
      overallRating: official.approvalRating,
      monthlyChange: official.approvalTrend,
      monthlyData,
      sectorAverage,
      sectorMonthlyChange: Math.floor(Math.random() * 10) - 5, // Random change for demo
      sectorRatings
    };
  }
  
  async submitRating(ratingData: RatingPayload & { userId: string }): Promise<{ success: boolean }> {
    const official = await this.getOfficialById(ratingData.officialId);
    
    if (!official) {
      throw new Error("Official not found");
    }
    
    // Update the official's approval rating
    // In a real app, this would use a weighted algorithm
    // For this demo, we'll just set it directly
    official.approvalRating = ratingData.overallRating;
    official.updatedAt = new Date();
    
    return { success: true };
  }
}

// Determine which storage implementation to use
// In production, use SupabaseStorage; in development, use MemStorage
export const storage: IStorage = process.env.NODE_ENV === 'production' && process.env.DATABASE_URL
  ? new SupabaseStorage()
  : new MemStorage();
