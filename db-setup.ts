import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './shared/schema';

// Helper to get a standardized connection string
function getConnectionString(): string {
  // First check if DATABASE_URL is properly formatted
  if (process.env.DATABASE_URL && 
      (process.env.DATABASE_URL.startsWith('postgres://') || process.env.DATABASE_URL.startsWith('postgresql://'))) {
    console.log("Using properly formatted DATABASE_URL");
    return process.env.DATABASE_URL;
  } 
  
  // Try to construct one from PG_ variables
  if (process.env.PGHOST && process.env.PGDATABASE && process.env.PGUSER && process.env.PGPASSWORD) {
    const port = process.env.PGPORT || '5432';
    // Add sslmode=require parameter for secure connections
    const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${port}/${process.env.PGDATABASE}?sslmode=require`;
    console.log("Constructed connection string from PG environment variables with SSL enabled");
    
    // Update process.env.DATABASE_URL for other tools
    process.env.DATABASE_URL = connectionString;
    return connectionString;
  }
  
  // If DATABASE_URL exists but isn't properly formatted, try to fix it
  if (process.env.DATABASE_URL) {
    console.log("DATABASE_URL exists but needs reformatting");
    
    // Attempt to convert Supabase URL format if that's what we have
    if (process.env.DATABASE_URL.includes('supabase.co')) {
      try {
        // Extract parts and reconstruct using PG variables which should be set
        // Also add the sslmode=require parameter for secure connections
        const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || '5432'}/${process.env.PGDATABASE || 'postgres'}?sslmode=require`;
        
        console.log("Reformatted Supabase URL to standard PostgreSQL URL with SSL enabled");
        process.env.DATABASE_URL = connectionString;
        return connectionString;
      } catch (e) {
        console.error("Failed to reformat Supabase URL:", e);
        throw new Error('Could not format DATABASE_URL properly');
      }
    } else {
      throw new Error('DATABASE_URL is not properly formatted');
    }
  }
  
  throw new Error('DATABASE_URL environment variable is not set and could not be constructed from PG_ variables');
}

// Create session table using SQL
async function createSessionTable(client: postgres.Sql<{}>) {
  try {
    console.log('🔄 Setting up session table...');
    await client`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      )
    `;
    await client`CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire")`;
    console.log('✅ Session table setup complete');
  } catch (error) {
    console.error('❌ Session table setup failed:', error);
  }
}

// Seed initial official data
async function seedInitialData(db: ReturnType<typeof drizzle>) {
  try {
    console.log('🔄 Checking if officials exist...');
    const existingOfficials = await db.select().from(schema.officials);
    
    if (existingOfficials.length === 0) {
      console.log('🔄 Seeding initial officials data...');
      
      // Insert officials
      const [tinubu] = await db.insert(schema.officials).values({
        name: "Bola Ahmed Tinubu",
        position: "President",
        location: "Federal",
        party: "APC",
        gender: "Male",
        term: "2023-2027",
        imageUrl: "https://en.wikipedia.org/wiki/Bola_Tinubu#/media/File:Bola_Ahmed_Tinubu_Chatham_House_06.jpg"
      }).returning();
      
      const [shettima] = await db.insert(schema.officials).values({
        name: "Kashim Shettima",
        position: "Vice President",
        location: "Federal",
        party: "APC",
        gender: "Male",
        term: "2023-2027"
      }).returning();
      
      const [sanwoOlu] = await db.insert(schema.officials).values({
        name: "Babajide Sanwo-Olu",
        position: "Governor",
        location: "Lagos",
        party: "APC",
        gender: "Male",
        term: "2019-2027"
      }).returning();
      
      // Insert sectors for officials
      await db.insert(schema.sectors).values([
        { name: "Economy", color: "green", officialId: tinubu.id },
        { name: "Security", color: "red", officialId: tinubu.id },
        { name: "Healthcare", color: "blue", officialId: tinubu.id },
        { name: "Education", color: "yellow", officialId: tinubu.id },
        { name: "Infrastructure", color: "purple", officialId: tinubu.id }
      ]);
      
      await db.insert(schema.sectors).values([
        { name: "Economy", color: "green", officialId: shettima.id },
        { name: "Security", color: "red", officialId: shettima.id },
        { name: "Infrastructure", color: "purple", officialId: shettima.id }
      ]);
      
      await db.insert(schema.sectors).values([
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
  }
}

// Main migration function
async function runMigration() {
  console.log('🔄 Starting database migration...');
  
  // Get a valid connection string
  let connectionString: string;
  try {
    connectionString = getConnectionString();
    console.log(`Connection string format check: ${connectionString.startsWith('postgres://') ? '✓' : '✗'}`);
  } catch (error) {
    console.error('❌ Failed to get connection string:', error);
    process.exit(1);
    return; // For TypeScript
  }
  
  // Create a postgres client
  const postgresClient = postgres(connectionString, { max: 1 });
  
  try {
    // Create Drizzle client
    const db = drizzle(postgresClient, { schema });
    
    // Run migrations
    console.log('🔄 Running schema migrations...');
    try {
      await migrate(db, { migrationsFolder: './migrations' });
      console.log('✅ Schema migrations completed successfully');
    } catch (error) {
      console.error('❌ Schema migration failed:', error);
      // Don't exit - try to continue with other operations
    }
    
    // Create session table
    await createSessionTable(postgresClient);
    
    // Seed initial data
    await seedInitialData(db);
    
    console.log('🎉 Database setup complete');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    // Always close the client
    await postgresClient.end();
  }
}

runMigration().catch((error) => {
  console.error('❌ Fatal error during migration:', error);
  process.exit(1);
});