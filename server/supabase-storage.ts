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
    // Use a simple in-memory session store
    // This avoids PostgreSQL connection issues
    console.log("Auth: Using in-memory session store with Supabase data storage");
    this.sessionStore = new session.MemoryStore();
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
        if (error.code === 'PGRST116') {
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
          updatedAt: new Date(data.updated_at)
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
          updatedAt: new Date(data.updated_at)
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
          updatedAt: new Date(data.updated_at)
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
        is_anonymous: false
      };
      
      const { data, error } = await supabase
        .from('users')
        .insert(newUser)
        .select('*')
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
        updatedAt: new Date(data.updated_at)
      };
      
      console.log("Created new user in Supabase:", user.username);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  async getOfficials(filters?: { location?: string; category?: string; search?: string }): Promise<Official[]> {
    try {
      let query = supabase
        .from('public_officials')
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
        console.error("Error fetching public officials:", error.message);
        throw error;
      }
      
      // Map public_officials to the Official format for compatibility
      const mappedOfficials = data.map(official => {
        // Parse JSON fields if they exist
        let education: any[] = [];
        let awards: any[] = [];
        let career: any[] = [];
        
        try {
          if (official.education) {
            education = typeof official.education === 'string' 
              ? JSON.parse(official.education) 
              : official.education;
          }
          
          if (official.awards) {
            awards = typeof official.awards === 'string' 
              ? JSON.parse(official.awards) 
              : official.awards;
          }
          
          if (official.career) {
            career = typeof official.career === 'string' 
              ? JSON.parse(official.career) 
              : official.career;
          }
        } catch (e) {
          console.error("Error parsing JSON fields:", e);
        }
        
        // Create an official object that maps to our Official interface
        return {
          id: official.id,
          name: official.name,
          position: official.office || '',
          location: official.jurisdiction || '',
          party: official.party ? official.party.replace('Party: ', '') : '',
          gender: '', // Not available in public_officials table
          term: '', // Not available in public_officials table
          imageUrl: official.avatar_url || null,
          approvalRating: 50, // Default value
          approvalTrend: 0,
          createdAt: official.created_at ? new Date(official.created_at) : null,
          updatedAt: official.updated_at ? new Date(official.updated_at) : null,
          sectors: [], // Will be populated in the future
          electionHistory: [],
          careerHistory: Array.isArray(career) ? career.map((c: any) => ({
            id: randomUUID(),
            officialId: official.id,
            position: c.position || '',
            party: c.party || '',
            location: c.location || '',
            startYear: c.startYear || 0,
            endYear: c.endYear || 0,
            createdAt: new Date()
          })) : []
        };
      });
      
      return mappedOfficials;
    } catch (error) {
      console.error("Error fetching officials:", error);
      throw error;
    }
  }
  
  async getOfficialById(id: string): Promise<Official | undefined> {
    try {
      const { data, error } = await supabase
        .from('public_officials')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - official not found
          return undefined;
        }
        console.error("Error fetching public official by ID:", error.message);
        throw error;
      }
      
      const official = data;
      
      // Parse JSON fields if they exist
      let education: any[] = [];
      let awards: any[] = [];
      let career: any[] = [];
      
      try {
        if (official.education) {
          education = typeof official.education === 'string' 
            ? JSON.parse(official.education) 
            : official.education;
        }
        
        if (official.awards) {
          awards = typeof official.awards === 'string' 
            ? JSON.parse(official.awards) 
            : official.awards;
        }
        
        if (official.career) {
          career = typeof official.career === 'string' 
            ? JSON.parse(official.career) 
            : official.career;
        }
      } catch (e) {
        console.error("Error parsing JSON fields:", e);
      }
      
      // Create an official object that maps to our Official interface
      return {
        id: official.id,
        name: official.name,
        position: official.office || '',
        location: official.jurisdiction || '',
        party: official.party ? official.party.replace('Party: ', '') : '',
        gender: '', // Not available in public_officials table
        term: '', // Not available in public_officials table
        imageUrl: official.avatar_url || null,
        approvalRating: 50, // Default value
        approvalTrend: 0,
        createdAt: official.created_at ? new Date(official.created_at) : null,
        updatedAt: official.updated_at ? new Date(official.updated_at) : null,
        sectors: [], // Will be populated in the future
        electionHistory: [],
        careerHistory: Array.isArray(career) ? career.map((c: any) => ({
          id: randomUUID(),
          officialId: official.id,
          position: c.position || '',
          party: c.party || '',
          location: c.location || '',
          startYear: c.startYear || 0,
          endYear: c.endYear || 0,
          createdAt: new Date()
        })) : []
      };
    } catch (error) {
      console.error("Error fetching public official:", error);
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