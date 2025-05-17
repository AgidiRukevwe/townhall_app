import { supabase } from './supabase-client';

async function createTables() {
  console.log('Starting to create tables in Supabase...');

  try {
    // Create users table
    console.log('Creating users table...');
    const { error: usersError } = await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          is_anonymous BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    });
    
    if (usersError) {
      console.error('Error creating users table:', usersError);
    } else {
      console.log('Users table created successfully or already exists');
    }

    // Create user_profiles table
    console.log('Creating user_profiles table...');
    const { error: profilesError } = await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS user_profiles (
          id TEXT PRIMARY KEY,
          user_id UUID REFERENCES users(id),
          device_id TEXT NOT NULL,
          ip_address TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    });
    
    if (profilesError) {
      console.error('Error creating user_profiles table:', profilesError);
    } else {
      console.log('User_profiles table created successfully or already exists');
    }

    // Check if tables exist by querying them
    console.log('Checking if tables exist...');
    
    const { data: usersData, error: usersCheckError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    console.log('Users table check:', usersCheckError ? 'Failed' : 'Successful');
    
    if (usersCheckError) {
      console.error('Error checking users table:', usersCheckError);
    }
    
    const { data: leadersData, error: leadersCheckError } = await supabase
      .from('leaders')
      .select('count')
      .limit(1);
    
    console.log('Leaders table check:', leadersCheckError ? 'Failed' : 'Successful');
    
    if (leadersCheckError) {
      console.error('Error checking leaders table:', leadersCheckError);
    } else {
      // If we can access the leaders table, let's count how many records are there
      console.log(`Found ${leadersData?.length > 0 ? leadersData[0].count : 0} leaders in the database`);
    }

    console.log('Table setup completed.');

  } catch (error) {
    console.error('Error during table creation:', error);
  }
}

// Run the function
createTables().catch(console.error);