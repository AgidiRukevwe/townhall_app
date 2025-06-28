import { Official } from "@shared/schema";
import { randomUUID } from "crypto";
import { supabase } from "server/supabase-client";

export const Officials = {
  async getOfficials(filters?: {
    location?: string;
    category?: string;
    search?: string;
  }): Promise<Official[]> {
    try {
      let query = supabase.from("leaders").select(`
        *,
        party:parties (
          id,
          name,
          acronym,
          logo_url
        )
      `);

      if (filters) {
        if (filters.location) {
          query = query.eq("jurisdiction", filters.location);
        }

        if (filters.search) {
          const sanitizedSearch = filters.search.replace(/'/g, "''");
          query = query.or(
            `name.ilike.%${sanitizedSearch}%,office.ilike.%${sanitizedSearch}%,jurisdiction.ilike.%${sanitizedSearch}%`
          );
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((leader: any): Official => {
        const education = safeParseJson(leader.education);
        const career = safeParseJson(leader.career);

        return {
          id: leader.id,
          name: leader.name,
          position: leader.office || "",
          location: leader.jurisdiction || "",
          party: leader.party || "",
          gender: "",
          term: "",
          imageUrl: leader.avatar_url || null,
          bio: leader.bio || null,
          approvalRating: 0,
          approvalTrend: 0,
          chamber: leader.chamber || "",
          createdAt: leader.created_at ? new Date(leader.created_at) : null,
          updatedAt: leader.updated_at ? new Date(leader.updated_at) : null,
          sectors: [],
          education: education.map((e: any) => ({
            id: randomUUID(),
            officialId: leader.id,
            institution: e.school || e.institution || "",
            degree: e.degree || "",
            field: e.field || "",
            startYear: e.startYear || 0,
            endYear: e.endYear || 0,
          })),
          electionHistory: [],
          careerHistory: career.map((c: any) => ({
            id: randomUUID(),
            officialId: leader.id,
            position: c.office || c.position || "",
            party: c.party || "",
            location: c.location || "",
            startYear: c.startYear || 0,
            endYear: c.endYear || 0,
            date: c.date || "",
            createdAt: new Date(),
          })),
        };
      });
    } catch (error) {
      console.error("Error in getOfficials:", error);
      throw error;
    }
  },

  async getOfficialById(id: string): Promise<Official | undefined> {
    try {
      const { data: leader, error } = await supabase
        .from("leaders")
        .select("*, party:parties(id, name, acronym, logo_url)")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!leader) return undefined;

      const education = safeParseJson(leader.education);
      const career = safeParseJson(leader.career);

      const { data: sectorsData, error: sectorsError } = await supabase
        .from("leader_sectors")
        .select("*")
        .eq("leader_id", id);

      if (sectorsError) console.warn("Error fetching sectors:", sectorsError);

      return {
        id: leader.id,
        name: leader.name,
        position: leader.office || "",
        location: leader.jurisdiction || "",
        party: leader.party || "",
        gender: "",
        term: "",
        imageUrl: leader.avatar_url || null,
        bio: leader.bio || null,
        approvalRating: 0,
        approvalTrend: 0,
        chamber: leader.chamber || "",
        createdAt: leader.created_at ? new Date(leader.created_at) : null,
        updatedAt: leader.updated_at ? new Date(leader.updated_at) : null,
        sectors: sectorsData || [],
        education: education.map((e: any) => ({
          id: randomUUID(),
          officialId: leader.id,
          institution: e.school || e.institution || "",
          degree: e.degree || "",
          field: e.field || "",
          startYear: e.startYear || 0,
          endYear: e.endYear || 0,
        })),
        electionHistory: [],
        careerHistory: career.map((c: any) => ({
          id: randomUUID(),
          officialId: leader.id,
          position: c.office || c.position || "",
          party: c.party || "",
          location: c.location || "",
          startYear: c.startYear || 0,
          endYear: c.endYear || 0,
          date: c.date || "",
          createdAt: new Date(),
        })),
      };
    } catch (error) {
      console.error("Error in getOfficialById:", error);
      return undefined;
    }
  },
};

function safeParseJson(input: any): any[] {
  try {
    if (!input) return [];
    if (typeof input === "string") return JSON.parse(input);
    if (Array.isArray(input)) return input;
    return [];
  } catch (e) {
    console.warn("Failed to parse JSON:", e);
    return [];
  }
}
