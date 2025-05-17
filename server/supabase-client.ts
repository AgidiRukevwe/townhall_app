import { createClient } from '@supabase/supabase-js';
import type { Database } from '../shared/schema';

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in environment variables.');
  console.error('Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.');
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

// Test the connection
export async function testSupabaseConnection() {
  try {
    // Try a simple query to test the connection
    const { data, error } = await supabase
      .from('leaders')
      .select('count')
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error connecting to Supabase:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
}

// Utility to get all tables
export async function listTables() {
  try {
    const { data, error } = await supabase.rpc('list_tables');
    
    if (error) {
      console.error('Error listing tables:', error.message);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Failed to list tables:', error);
    return [];
  }
}