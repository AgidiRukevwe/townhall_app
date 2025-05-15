import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './shared/schema';

// For migrations
async function runMigration() {
  console.log('🔄 Starting database migration...');
  
  // Get a properly formatted connection string
  let connectionString;
  
  // First check if DATABASE_URL is properly formatted
  if (process.env.DATABASE_URL && 
      (process.env.DATABASE_URL.startsWith('postgres://') || process.env.DATABASE_URL.startsWith('postgresql://'))) {
    connectionString = process.env.DATABASE_URL;
    console.log("Using properly formatted DATABASE_URL for migrations");
  } 
  // Try to construct one from PG_ variables
  else if (process.env.PGHOST && process.env.PGDATABASE && process.env.PGUSER && process.env.PGPASSWORD) {
    const port = process.env.PGPORT || '5432';
    connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${port}/${process.env.PGDATABASE}`;
    console.log("Constructed connection string from PG environment variables for migrations");
    
    // Update process.env.DATABASE_URL for other tools
    process.env.DATABASE_URL = connectionString;
  }
  // If DATABASE_URL exists but isn't properly formatted, try to fix it
  else if (process.env.DATABASE_URL) {
    console.log("DATABASE_URL exists but needs reformatting for migrations");
    
    // Attempt to convert Supabase URL format if that's what we have
    if (process.env.DATABASE_URL.includes('supabase.co')) {
      try {
        // Extract parts from URL - this is a simple approach, might need adjustment
        const url = new URL(process.env.DATABASE_URL);
        const host = url.hostname;
        const database = 'postgres'; // Default for Supabase
        
        // Construct proper PostgreSQL URL from PG variables
        connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || '5432'}/${process.env.PGDATABASE || database}`;
        
        console.log("Reformatted Supabase URL to standard PostgreSQL URL for migrations");
        process.env.DATABASE_URL = connectionString;
      } catch (e) {
        console.error("Failed to reformat Supabase URL for migrations:", e);
        throw new Error('Could not format DATABASE_URL properly');
      }
    } else {
      throw new Error('DATABASE_URL is not properly formatted');
    }
  } else {
    throw new Error('DATABASE_URL environment variable is not set and could not be constructed from PG_ variables');
  }
  
  // Type validation & safety check
  if (!connectionString) {
    throw new Error('Connection string is undefined or empty');
  }
  
  console.log(`Connection string format check: ${connectionString.startsWith('postgres://') ? '✓' : '✗'}`);
  
  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient, { schema });
  
  try {
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }

  // Create session table if it doesn't exist (for Passport)
  try {
    console.log('🔄 Setting up session table...');
    // Use the drizzle client we already have for consistent access
    await migrationClient.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      );
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);
    console.log('✅ Session table setup complete');
  } catch (error) {
    console.error('❌ Session table setup failed:', error);
  }

  // Seed initial official data using the same client
  console.log('🔄 Checking if officials exist...');
  try {
    console.log('🔄 Checking if officials exist...');
    const existingOfficials = await seedDb.select().from(schema.officials);
    
    if (existingOfficials.length === 0) {
      console.log('🔄 Seeding initial officials data...');
      
      // Insert officials
      const [tinubu] = await seedDb.insert(schema.officials).values({
        name: "Bola Ahmed Tinubu",
        position: "President",
        location: "Federal",
        party: "APC",
        gender: "Male",
        term: "2023-2027",
        imageUrl: "https://en.wikipedia.org/wiki/Bola_Tinubu#/media/File:Bola_Ahmed_Tinubu_Chatham_House_06.jpg"
      }).returning();
      
      const [shettima] = await seedDb.insert(schema.officials).values({
        name: "Kashim Shettima",
        position: "Vice President",
        location: "Federal",
        party: "APC",
        gender: "Male",
        term: "2023-2027"
      }).returning();
      
      const [sanwoOlu] = await seedDb.insert(schema.officials).values({
        name: "Babajide Sanwo-Olu",
        position: "Governor",
        location: "Lagos",
        party: "APC",
        gender: "Male",
        term: "2019-2027"
      }).returning();
      
      // Insert sectors for officials
      await seedDb.insert(schema.sectors).values([
        { name: "Economy", color: "green", officialId: tinubu.id },
        { name: "Security", color: "red", officialId: tinubu.id },
        { name: "Healthcare", color: "blue", officialId: tinubu.id },
        { name: "Education", color: "yellow", officialId: tinubu.id },
        { name: "Infrastructure", color: "purple", officialId: tinubu.id }
      ]);
      
      await seedDb.insert(schema.sectors).values([
        { name: "Economy", color: "green", officialId: shettima.id },
        { name: "Security", color: "red", officialId: shettima.id },
        { name: "Infrastructure", color: "purple", officialId: shettima.id }
      ]);
      
      await seedDb.insert(schema.sectors).values([
        { name: "Transportation", color: "orange", officialId: sanwoOlu.id },
        { name: "Healthcare", color: "blue", officialId: sanwoOlu.id },
        { name: "Education", color: "yellow", officialId: sanwoOlu.id },
        { name: "Infrastructure", color: "purple", officialId: sanwoOlu.id }
      ]);
      
      console.log('✅ Initial data seeded successfully');
    } else {
      console.log('ℹ️ Officials already exist, skipping seed');
    }
  } catch (error) {
    console.error('❌ Data seeding failed:', error);
  } finally {
    await seedClient.end();
  }

  console.log('🎉 Database setup complete');
}

runMigration().catch(console.error);