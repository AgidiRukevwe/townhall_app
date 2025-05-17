import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials');
  console.error('Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in the .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function initDatabase() {
  try {
    console.log('Setting up Supabase database tables...');
    
    // 1. Check if tables already exist
    console.log('Checking if tables already exist...');
    
    // Check if the leaders table exists and needs to be renamed
    const { data: leadersData, error: leadersError } = await supabase
      .from('leaders')
      .select('id')
      .limit(1);
    
    if (!leadersError) {
      console.log('Found leaders table. You should rename it to public_officials using the rename-table-to-public-officials.sql script.');
    } else {
      console.log('Leaders table not found or not accessible.');
    }
    
    // Check if the public_officials table exists
    const { data: officialsData, error: officialsError } = await supabase
      .from('public_officials')
      .select('id')
      .limit(1);
    
    if (!officialsError) {
      console.log('✅ public_officials table already exists, no need to create it.');
    } else {
      console.log('public_officials table does not exist or is not accessible.');
    }
    
    // Check if the users table exists
    const { data: tablesData, error: tablesError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (!tablesError) {
      console.log('✅ Users table already exists, no setup needed');
      return;
    }
    
    console.log('Users table does not exist. Creating required tables...');
    
    // 2. Read SQL script
    const sqlScript = fs.readFileSync('./supabase-tables-setup.sql', 'utf-8');
    
    // 3. Send SQL to Supabase (requires you to manually run this in the SQL Editor)
    console.log('\n=======================================');
    console.log('⚠️ IMPORTANT MANUAL STEP REQUIRED ⚠️');
    console.log('=======================================');
    console.log('Please follow these steps to set up your database:');
    console.log('1. Go to https://supabase.com/dashboard and select your project');
    console.log('2. Click "SQL Editor" in the left sidebar');
    console.log('3. Create a "New Query"');
    console.log('4. Copy and paste the SQL below:');
    console.log('\n=======================================\n');
    console.log(sqlScript);
    console.log('\n=======================================\n');
    console.log('5. Click "Run" to execute the SQL script');
    console.log('6. Once complete, restart this application');
    console.log('\n=======================================\n');
    
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Execute the initialization
initDatabase();