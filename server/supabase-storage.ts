import { randomUUID } from "crypto";
import session from "express-session";
import { InsertUser, Official, RatingPayload, RatingSummary, User } from "@shared/schema";
import { supabase } from "./supabase-client";
import connectPg from "connect-pg-simple";

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
  getOfficials(filters?: { location?: string; category?: string; search?: string }): Promise<Official[]>;
  getOfficialById(id: string): Promise<Official | undefined>;
  getOfficialRatings(officialId: string): Promise<RatingSummary>;
  submitRating(ratingData: RatingPayload & { userId: string }): Promise<{ success: boolean }>;
}

export class SupabaseStorage implements IStorage {
  public sessionStore: session.Store;
  
  constructor() {
    // Set up PostgreSQL session store
    const PostgresSessionStore = connectPg(session);
    
    // Use the database connection from environment variables
    const connectionString = process.env.DATABASE_URL as string;
    
    console.log("Auth: Using Supabase database for session store");
    
    this.sessionStore = new PostgresSessionStore({ 
      conObject: {
        connectionString,
        ssl: { rejectUnauthorized: false }
      },
      createTableIfMissing: true,
      tableName: 'sessions'
    });
  }
  
  async checkDatabaseConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('leaders').select('count');
      
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
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching user by ID:", error.message);
        return undefined;
      }
      
      return data as User;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - user not found
          return undefined;
        }
        console.error("Error fetching user by email:", error.message);
        throw error;
      }
      
      return data as User;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - user not found
          return undefined;
        }
        console.error("Error fetching user by username:", error.message);
        throw error;
      }
      
      return data as User;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      throw error;
    }
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    try {
      const newUser = {
        ...userData,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('users')
        .insert(newUser)
        .select('*')
        .single();
      
      if (error) {
        console.error("Error creating user:", error.message);
        throw error;
      }
      
      if (!data) {
        throw new Error("Failed to retrieve created user");
      }
      
      return data as User;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  async getOfficials(filters?: { location?: string; category?: string; search?: string }): Promise<Official[]> {
    try {
      let query = supabase
        .from('leaders')
        .select('*');
      
      // Apply filters
      if (filters) {
        if (filters.location) {
          query = query.eq('jurisdiction', filters.location);
        }
        
        if (filters.search) {
          query = query.or(
            `name.ilike.%${filters.search}%,office.ilike.%${filters.search}%,jurisdiction.ilike.%${filters.search}%`
          );
        }
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching leaders:", error.message);
        throw error;
      }
      
      // Map leaders to the Official format for compatibility
      const mappedLeaders = data.map(leader => {
        // Parse JSON fields if they exist
        let education: any[] = [];
        let awards: any[] = [];
        let career: any[] = [];
        
        try {
          if (leader.education) {
            education = typeof leader.education === 'string' 
              ? JSON.parse(leader.education) 
              : leader.education;
          }
          
          if (leader.awards) {
            awards = typeof leader.awards === 'string' 
              ? JSON.parse(leader.awards) 
              : leader.awards;
          }
          
          if (leader.career) {
            career = typeof leader.career === 'string' 
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
          position: leader.office || '',
          location: leader.jurisdiction || '',
          party: leader.party ? leader.party.replace('Party: ', '') : '',
          gender: '', // Not available in leaders table
          term: '', // Not available in leaders table
          imageUrl: leader.avatar_url || null,
          approvalRating: 50, // Default value
          approvalTrend: 0,
          createdAt: leader.created_at ? new Date(leader.created_at) : null,
          updatedAt: leader.updated_at ? new Date(leader.updated_at) : null,
          sectors: [], // Will be populated in the future
          electionHistory: [],
          careerHistory: Array.isArray(career) ? career.map((c: any) => ({
            id: randomUUID(),
            officialId: leader.id,
            position: c.position || '',
            party: c.party || '',
            location: c.location || '',
            startYear: c.startYear || 0,
            endYear: c.endYear || 0,
            createdAt: new Date()
          })) : []
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
        .from('leaders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
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
          education = typeof leader.education === 'string' 
            ? JSON.parse(leader.education) 
            : leader.education;
        }
        
        if (leader.awards) {
          awards = typeof leader.awards === 'string' 
            ? JSON.parse(leader.awards) 
            : leader.awards;
        }
        
        if (leader.career) {
          career = typeof leader.career === 'string' 
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
        position: leader.office || '',
        location: leader.jurisdiction || '',
        party: leader.party ? leader.party.replace('Party: ', '') : '',
        gender: '', // Not available in leaders table
        term: '', // Not available in leaders table
        imageUrl: leader.avatar_url || null,
        approvalRating: 50, // Default value
        approvalTrend: 0,
        createdAt: leader.created_at ? new Date(leader.created_at) : null,
        updatedAt: leader.updated_at ? new Date(leader.updated_at) : null,
        sectors: [], // Will be populated in the future
        electionHistory: [],
        careerHistory: Array.isArray(career) ? career.map((c: any) => ({
          id: randomUUID(),
          officialId: leader.id,
          position: c.position || '',
          party: c.party || '',
          location: c.location || '',
          startYear: c.startYear || 0,
          endYear: c.endYear || 0,
          createdAt: new Date()
        })) : []
      };
    } catch (error) {
      console.error("Error fetching leader:", error);
      throw error;
    }
  }
  
  async getOfficialRatings(officialId: string): Promise<RatingSummary> {
    try {
      // Get existing ratings from database if they exist
      const { data: ratingData, error: ratingError } = await supabase
        .from('ratings')
        .select('rating, created_at')
        .eq('leader_id', officialId);
      
      if (ratingError) {
        console.error("Error fetching ratings:", ratingError.message);
        throw ratingError;
      }
      
      // Calculate overall rating from database or use default
      const overallRating = ratingData && ratingData.length > 0
        ? Math.round(ratingData.reduce((sum, r) => sum + r.rating, 0) / ratingData.length)
        : 50;
      
      // Generate monthly data (last 6 months)
      const monthlyData = [];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentDate = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthIdx = month.getMonth();
        
        // Get ratings for this month if data exists, otherwise use simulated value
        let monthlyRating = 50;
        
        if (ratingData && ratingData.length > 0) {
          const monthRatings = ratingData.filter(r => {
            const ratingDate = new Date(r.created_at);
            return ratingDate.getMonth() === monthIdx && ratingDate.getFullYear() === month.getFullYear();
          });
          
          if (monthRatings.length > 0) {
            monthlyRating = Math.round(monthRatings.reduce((sum, r) => sum + r.rating, 0) / monthRatings.length);
          } else {
            // If no ratings for this month, use overall or simulated
            monthlyRating = i === 0 ? overallRating : Math.floor(40 + Math.random() * 30);
          }
        }
        
        monthlyData.push({
          month: monthNames[monthIdx],
          rating: monthlyRating,
          isCurrentMonth: i === 0
        });
      }
      
      // Calculate monthly change
      const currentMonthRating = monthlyData[5].rating;
      const prevMonthRating = monthlyData[4].rating;
      const monthlyChange = currentMonthRating - prevMonthRating;
      
      // Get sector information
      const { data: sectorData, error: sectorError } = await supabase
        .from('sectors')
        .select('*');
      
      if (sectorError) {
        console.error("Error fetching sectors:", sectorError.message);
        throw sectorError;
      }
      
      // Generate sector ratings
      const sectorColors = ['#4CAF50', '#FFC107', '#2196F3', '#E91E63', '#673AB7'];
      let sectorRatings = [];
      
      if (sectorData && sectorData.length > 0) {
        sectorRatings = sectorData.map((sector, index) => ({
          name: sector.name,
          rating: Math.floor(overallRating - 10 + Math.random() * 20), // Simulate ratings around overall
          color: sector.color || sectorColors[index % sectorColors.length]
        }));
      } else {
        // Fallback to default sectors if none in database
        sectorRatings = [
          { name: 'Healthcare', rating: Math.floor(overallRating - 10 + Math.random() * 20), color: sectorColors[0] },
          { name: 'Education', rating: Math.floor(overallRating - 10 + Math.random() * 20), color: sectorColors[1] },
          { name: 'Infrastructure', rating: Math.floor(overallRating - 10 + Math.random() * 20), color: sectorColors[2] },
          { name: 'Economy', rating: Math.floor(overallRating - 10 + Math.random() * 20), color: sectorColors[3] },
          { name: 'Security', rating: Math.floor(overallRating - 10 + Math.random() * 20), color: sectorColors[4] }
        ];
      }
      
      const sectorAverage = sectorRatings.reduce((sum, s) => sum + s.rating, 0) / sectorRatings.length;
      
      return {
        overallRating,
        monthlyChange,
        monthlyData,
        sectorAverage,
        sectorMonthlyChange: Math.floor(Math.random() * 6) - 3,
        sectorRatings
      };
    } catch (error) {
      console.error("Error fetching official ratings:", error);
      throw error;
    }
  }
  
  async submitRating(ratingData: RatingPayload & { userId: string }): Promise<{ success: boolean }> {
    try {
      // Insert the rating
      const { error } = await supabase
        .from('ratings')
        .insert({
          id: randomUUID(),
          leader_id: ratingData.officialId,
          user_id: ratingData.userId,
          rating: ratingData.overallRating,
          sector_id: '00000000-0000-0000-0000-000000000000', // Default for overall rating
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.error("Error submitting rating:", error.message);
        throw error;
      }
      
      // Insert sector ratings if provided
      if (ratingData.sectorRatings && ratingData.sectorRatings.length > 0) {
        const sectorRatingsToInsert = ratingData.sectorRatings.map(sr => ({
          id: randomUUID(),
          leader_id: ratingData.officialId,
          user_id: ratingData.userId,
          rating: sr.rating,
          sector_id: sr.sectorId,
          created_at: new Date().toISOString()
        }));
        
        const { error: sectorRatingError } = await supabase
          .from('ratings')
          .insert(sectorRatingsToInsert);
        
        if (sectorRatingError) {
          console.error("Error submitting sector ratings:", sectorRatingError.message);
          // We still return success since the overall rating was saved
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error submitting rating:", error);
      throw error;
    }
  }
}