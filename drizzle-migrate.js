// drizzle-migrate.js - Script to run Drizzle migrations
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Connection string for Supabase
const connectionString = `postgresql://postgres:${process.env.SUPABASE_DB_PASSWORD}@db.buenrbnwgxewfqvwovta.supabase.co:5432/postgres?sslmode=require`;

async function runMigration() {
  console.log('Starting database migration...');
  console.log(`Using connection string: ${connectionString.replace(/:[^:]*@/, ':****@')}`);
  
  try {
    // Set up the connection
    const migrationClient = postgres(connectionString, { max: 1 });
    const db = drizzle(migrationClient);
    
    console.log('Pushing schema to database...');
    
    // Push the schema to the database
    await db.execute(/*sql*/`
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- User profiles table
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID NOT NULL REFERENCES users(id),
        "deviceId" TEXT,
        "ipAddress" TEXT,
        "lastLogin" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Officials table
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
      
      -- Sectors table
      CREATE TABLE IF NOT EXISTS sectors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        color TEXT,
        "officialId" UUID REFERENCES officials(id),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Ratings table
      CREATE TABLE IF NOT EXISTS ratings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID REFERENCES users(id),
        "officialId" UUID REFERENCES officials(id),
        rating INTEGER NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Sector ratings table
      CREATE TABLE IF NOT EXISTS sector_ratings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "ratingId" UUID REFERENCES ratings(id),
        "sectorId" UUID REFERENCES sectors(id),
        rating INTEGER NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Elections table
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
      
      -- Careers table
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
      
      -- Petitions table
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
      
      -- Sessions table for express-session
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      );
      
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);
    
    console.log('Schema push completed successfully!');
    
    // Check if we need to seed sample data
    const officialsCountResult = await db.execute(/*sql*/`SELECT COUNT(*) FROM officials`);
    const officialsCount = parseInt(officialsCountResult[0].count || '0');
    
    if (officialsCount === 0) {
      console.log('Seeding sample officials data...');
      
      // First official - Bola Tinubu
      const bolaResult = await db.execute(/*sql*/`
        INSERT INTO officials (name, position, party, state, "imageUrl", bio, "approvalRating", "approvalTrend")
        VALUES (
          'Bola Ahmed Tinubu',
          'President',
          'APC',
          'Federal',
          'https://example.com/bola-tinubu.jpg',
          'Bola Ahmed Tinubu is the President of Nigeria, elected in 2023.',
          50,
          0
        )
        RETURNING id;
      `);
      
      const bolaId = bolaResult[0].id;
      
      // Add sectors for Bola
      await db.execute(/*sql*/`
        INSERT INTO sectors (name, description, color, "officialId")
        VALUES 
          ('Economy', 'Economic policies and management', '#4CAF50', '${bolaId}'),
          ('Security', 'National security and safety', '#F44336', '${bolaId}'),
          ('Education', 'Educational development and policies', '#2196F3', '${bolaId}'),
          ('Healthcare', 'Healthcare policies and infrastructure', '#9C27B0', '${bolaId}'),
          ('Infrastructure', 'Development of national infrastructure', '#FF9800', '${bolaId}');
      `);
      
      // Second official - Babajide Sanwoolu
      const babajideResult = await db.execute(/*sql*/`
        INSERT INTO officials (name, position, party, state, "imageUrl", bio, "approvalRating", "approvalTrend")
        VALUES (
          'Babajide Sanwoolu',
          'Governor',
          'APC',
          'Lagos',
          'https://example.com/babajide-sanwoolu.jpg',
          'Babajide Sanwoolu is the Governor of Lagos State.',
          50,
          0
        )
        RETURNING id;
      `);
      
      const babajideId = babajideResult[0].id;
      
      // Add sectors for Babajide
      await db.execute(/*sql*/`
        INSERT INTO sectors (name, description, color, "officialId")
        VALUES 
          ('Transportation', 'Public transportation and traffic management', '#4CAF50', '${babajideId}'),
          ('Housing', 'Affordable housing initiatives', '#F44336', '${babajideId}'),
          ('Education', 'State educational system', '#2196F3', '${babajideId}'),
          ('Healthcare', 'State healthcare system', '#9C27B0', '${babajideId}'),
          ('Environment', 'Environmental sustainability and waste management', '#FF9800', '${babajideId}');
      `);
      
      // Third official - Peter Obi
      const peterResult = await db.execute(/*sql*/`
        INSERT INTO officials (name, position, party, state, "imageUrl", bio, "approvalRating", "approvalTrend")
        VALUES (
          'Peter Obi',
          'Presidential Candidate',
          'Labour Party',
          'Federal',
          'https://example.com/peter-obi.jpg',
          'Peter Obi was a presidential candidate in the 2023 Nigerian general election.',
          50,
          0
        )
        RETURNING id;
      `);
      
      const peterId = peterResult[0].id;
      
      // Add sectors for Peter
      await db.execute(/*sql*/`
        INSERT INTO sectors (name, description, color, "officialId")
        VALUES 
          ('Economy', 'Economic policies and plans', '#4CAF50', '${peterId}'),
          ('Education', 'Educational reform proposals', '#2196F3', '${peterId}'),
          ('Governance', 'Transparency and accountability', '#673AB7', '${peterId}'),
          ('Youth Development', 'Policies for youth empowerment', '#E91E63', '${peterId}'),
          ('Foreign Policy', 'International relations and diplomacy', '#00BCD4', '${peterId}');
      `);
      
      console.log('Sample data seeding completed!');
    } else {
      console.log(`Officials data already exists (${officialsCount} records found). Skipping sample data seeding.`);
    }
    
    // Close the connection
    await migrationClient.end();
    
    console.log('Database migration completed successfully!');
    return true;
  } catch (error) {
    console.error('Error during migration:', error);
    return false;
  }
}

// Execute the migration
runMigration()
  .then((success) => {
    if (success) {
      console.log('✅ Migration process completed successfully.');
      process.exit(0);
    } else {
      console.error('❌ Migration process failed.');
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('💥 Unhandled error during migration:', err);
    process.exit(1);
  });