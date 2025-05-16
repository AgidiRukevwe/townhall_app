import { randomUUID } from "crypto";
import session from "express-session";
import { InsertUser, Official, RatingPayload, RatingSummary, User } from "@shared/schema";

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

// Memory storage implementation for development
export class MemStorage implements IStorage {
  private users: User[] = [];
  public sessionStore: session.Store;
  
  constructor() {
    // Create a memory store for session
    // Use a simple Map-based store since we're in memory anyway
    this.sessionStore = new session.MemoryStore();
  }
  
  async checkDatabaseConnection(): Promise<boolean> {
    return true;
  }
  
  async getUserById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const newUser: User = {
      id: randomUUID(),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      isAnonymous: userData.isAnonymous || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.push(newUser);
    return newUser;
  }
  
  // Sample data for development
  private officials: Official[] = [
    {
      id: "1",
      name: "Bola Ahmed Tinubu",
      position: "President",
      location: "Federal",
      party: "APC",
      gender: "Male",
      term: "2023-2027",
      imageUrl: "https://www.vanguardngr.com/wp-content/uploads/2023/03/Bola-Tinubu.webp",
      approvalRating: 46,
      approvalTrend: -5,
      createdAt: new Date(),
      updatedAt: new Date(),
      sectors: [],
      electionHistory: [],
      careerHistory: []
    },
    {
      id: "2",
      name: "Kashim Shettima",
      position: "Vice President",
      location: "Federal",
      party: "APC",
      gender: "Male",
      term: "2023-2027",
      imageUrl: "https://dailypost.ng/wp-content/uploads/2022/07/Kashim-Shettima.jpeg",
      approvalRating: 51,
      approvalTrend: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      sectors: [],
      electionHistory: [],
      careerHistory: []
    },
    {
      id: "3",
      name: "Godswill Akpabio",
      position: "Senate President",
      location: "Federal",
      party: "APC",
      gender: "Male",
      term: "2023-2027",
      imageUrl: "https://dailypost.ng/wp-content/uploads/2023/06/Godswill-Akpabio-1.jpeg",
      approvalRating: 48,
      approvalTrend: -1,
      createdAt: new Date(),
      updatedAt: new Date(),
      sectors: [],
      electionHistory: [],
      careerHistory: []
    },
    {
      id: "4",
      name: "Babajide Sanwo-Olu",
      position: "Governor",
      location: "Lagos",
      party: "APC",
      gender: "Male",
      term: "2023-2027",
      imageUrl: "https://guardian.ng/wp-content/uploads/2023/03/Babajide-Sanwo-Olu.jpg",
      approvalRating: 62,
      approvalTrend: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
      sectors: [],
      electionHistory: [],
      careerHistory: []
    },
    {
      id: "5",
      name: "Peter Mbah",
      position: "Governor",
      location: "Enugu",
      party: "PDP",
      gender: "Male",
      term: "2023-2027",
      imageUrl: "https://dailypost.ng/wp-content/uploads/2022/10/Peter-Ndubuisi-Mbah.jpeg",
      approvalRating: 55,
      approvalTrend: 7,
      createdAt: new Date(),
      updatedAt: new Date(),
      sectors: [],
      electionHistory: [],
      careerHistory: []
    }
  ];
  
  async getOfficials(filters?: { location?: string; category?: string; search?: string }): Promise<Official[]> {
    let filteredOfficials = [...this.officials];
    
    if (filters) {
      if (filters.location) {
        filteredOfficials = filteredOfficials.filter(o => 
          o.location.toLowerCase() === filters.location?.toLowerCase()
        );
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredOfficials = filteredOfficials.filter(o => 
          o.name.toLowerCase().includes(searchTerm) ||
          o.position.toLowerCase().includes(searchTerm) ||
          o.location.toLowerCase().includes(searchTerm)
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
    const rating = official?.approvalRating || 50;
    const trend = official?.approvalTrend || 0;
    
    // Generate monthly data (last 6 months)
    const monthlyData = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthIdx = month.getMonth();
      
      // Generate a rating that trends toward the current rating
      const pastRating = i === 0 
        ? rating 
        : Math.max(30, Math.min(70, rating - trend * (i / 2) + (Math.random() * 10 - 5)));
      
      monthlyData.push({
        month: monthNames[monthIdx],
        rating: Math.round(pastRating),
        isCurrentMonth: i === 0
      });
    }
    
    // Generate some sample sector ratings data
    const sectorColors = ['#4CAF50', '#FFC107', '#2196F3', '#E91E63', '#673AB7'];
    const sectorRatings = [
      { name: 'Healthcare', rating: Math.floor(rating - 10 + Math.random() * 20), color: sectorColors[0] },
      { name: 'Education', rating: Math.floor(rating - 10 + Math.random() * 20), color: sectorColors[1] },
      { name: 'Infrastructure', rating: Math.floor(rating - 10 + Math.random() * 20), color: sectorColors[2] },
      { name: 'Economy', rating: Math.floor(rating - 10 + Math.random() * 20), color: sectorColors[3] },
      { name: 'Security', rating: Math.floor(rating - 10 + Math.random() * 20), color: sectorColors[4] }
    ];
    
    const sectorAverage = sectorRatings.reduce((sum, s) => sum + s.rating, 0) / sectorRatings.length;
    
    return {
      overallRating: rating,
      monthlyChange: trend,
      monthlyData,
      sectorAverage,
      sectorMonthlyChange: Math.floor(Math.random() * 6) - 3,
      sectorRatings
    };
  }
  
  async submitRating(ratingData: RatingPayload & { userId: string }): Promise<{ success: boolean }> {
    // Update the official's rating
    const official = this.officials.find(o => o.id === ratingData.officialId);
    if (official) {
      // Blend the new rating with the existing one to simulate aggregation
      official.approvalRating = Math.round((official.approvalRating * 5 + ratingData.overallRating) / 6);
      
      // Randomly update the trend
      official.approvalTrend = Math.round((official.approvalTrend + (ratingData.overallRating - official.approvalRating) / 2));
    }
    
    return { success: true };
  }
}