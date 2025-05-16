// Supabase database setup script
import pg from 'pg';
const { Pool } = pg;
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Replace these with your actual Supabase connection details
const connectionString = `postgresql://postgres:${process.env.SUPABASE_DB_PASSWORD}@db.buenrbnwgxewfqvwovta.supabase.co:5432/postgres?sslmode=require`;

// Create a new pool
const pool = new Pool({
  connectionString,
});

async function createTables() {
  const client = await pool.connect();
  
  try {
    console.log('Connected to Supabase PostgreSQL database');
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Create users table
    console.log('Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Create user_profiles table
    console.log('Creating user_profiles table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID NOT NULL REFERENCES users(id),
        "deviceId" TEXT,
        "ipAddress" TEXT,
        "lastLogin" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Create officials table
    console.log('Creating officials table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS officials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        party TEXT,
        state TEXT,
        "imageUrl" TEXT,
        bio TEXT,
        "twitterHandle" TEXT,
        "facebookHandle" TEXT,
        "instagramHandle" TEXT,
        "approvalRating" INTEGER DEFAULT 50,
        "approvalTrend" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Create sectors table
    console.log('Creating sectors table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS sectors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        color TEXT,
        "officialId" UUID REFERENCES officials(id),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Create ratings table
    console.log('Creating ratings table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID REFERENCES users(id),
        "officialId" UUID REFERENCES officials(id),
        rating INTEGER NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Create sector_ratings table
    console.log('Creating sector_ratings table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS sector_ratings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "ratingId" UUID REFERENCES ratings(id),
        "sectorId" UUID REFERENCES sectors(id),
        rating INTEGER NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Create elections table
    console.log('Creating elections table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS elections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "officialId" UUID REFERENCES officials(id),
        position TEXT NOT NULL,
        year INTEGER NOT NULL,
        result TEXT NOT NULL,
        "votePercentage" NUMERIC(5,2),
        party TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Create careers table
    console.log('Creating careers table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS careers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "officialId" UUID REFERENCES officials(id),
        title TEXT NOT NULL,
        organization TEXT NOT NULL,
        "startYear" INTEGER NOT NULL,
        "endYear" INTEGER,
        description TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Create petitions table
    console.log('Creating petitions table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS petitions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        goal INTEGER NOT NULL,
        "currentSignatures" INTEGER DEFAULT 0,
        "targetOfficialId" UUID REFERENCES officials(id),
        "createdById" UUID REFERENCES users(id),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        status TEXT DEFAULT 'active'
      );
    `);
    
    // Create sessions table for express-session
    console.log('Creating session table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      );
      
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);
    
    // Seed officials data if they don't exist
    console.log('Checking if officials data needs to be seeded...');
    const officialsCount = await client.query('SELECT COUNT(*) FROM officials');
    
    if (parseInt(officialsCount.rows[0].count) === 0) {
      console.log('Seeding initial officials data...');
      
      // First official
      const bola = await client.query(`
        INSERT INTO officials (name, position, party, state, "imageUrl", bio)
        VALUES (
          'Bola Ahmed Tinubu',
          'President',
          'APC',
          'Federal',
          'https://example.com/bola-tinubu.jpg',
          'Bola Ahmed Tinubu is the President of Nigeria, elected in 2023.'
        )
        RETURNING id;
      `);
      
      const bolaId = bola.rows[0].id;
      
      // Add sectors for Bola
      await client.query(`
        INSERT INTO sectors (name, description, color, "officialId")
        VALUES 
          ('Economy', 'Economic policies and management', '#4CAF50', '${bolaId}'),
          ('Security', 'National security and safety', '#F44336', '${bolaId}'),
          ('Education', 'Educational development and policies', '#2196F3', '${bolaId}'),
          ('Healthcare', 'Healthcare policies and infrastructure', '#9C27B0', '${bolaId}'),
          ('Infrastructure', 'Development of national infrastructure', '#FF9800', '${bolaId}');
      `);
      
      // Second official
      const babajide = await client.query(`
        INSERT INTO officials (name, position, party, state, "imageUrl", bio)
        VALUES (
          'Babajide Sanwoolu',
          'Governor',
          'APC',
          'Lagos',
          'https://example.com/babajide-sanwoolu.jpg',
          'Babajide Sanwoolu is the Governor of Lagos State.'
        )
        RETURNING id;
      `);
      
      const babajideId = babajide.rows[0].id;
      
      // Add sectors for Babajide
      await client.query(`
        INSERT INTO sectors (name, description, color, "officialId")
        VALUES 
          ('Transportation', 'Public transportation and traffic management', '#4CAF50', '${babajideId}'),
          ('Housing', 'Affordable housing initiatives', '#F44336', '${babajideId}'),
          ('Education', 'State educational system', '#2196F3', '${babajideId}'),
          ('Healthcare', 'State healthcare system', '#9C27B0', '${babajideId}'),
          ('Environment', 'Environmental sustainability and waste management', '#FF9800', '${babajideId}');
      `);
      
      // Third official
      const peter = await client.query(`
        INSERT INTO officials (name, position, party, state, "imageUrl", bio)
        VALUES (
          'Peter Obi',
          'Presidential Candidate',
          'Labour Party',
          'Federal',
          'https://example.com/peter-obi.jpg',
          'Peter Obi was a presidential candidate in the 2023 Nigerian general election.'
        )
        RETURNING id;
      `);
      
      const peterId = peter.rows[0].id;
      
      // Add sectors for Peter
      await client.query(`
        INSERT INTO sectors (name, description, color, "officialId")
        VALUES 
          ('Economy', 'Economic policies and plans', '#4CAF50', '${peterId}'),
          ('Education', 'Educational reform proposals', '#2196F3', '${peterId}'),
          ('Governance', 'Transparency and accountability', '#673AB7', '${peterId}'),
          ('Youth Development', 'Policies for youth empowerment', '#E91E63', '${peterId}'),
          ('Foreign Policy', 'International relations and diplomacy', '#00BCD4', '${peterId}');
      `);
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Database setup completed successfully');
    
  } catch (error) {
    // Rollback transaction in case of error
    await client.query('ROLLBACK');
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    // Release client back to pool
    client.release();
    await pool.end();
  }
}

// Run the setup
createTables()
  .then(() => {
    console.log('Database setup script completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Database setup script failed:', err);
    process.exit(1);
  });