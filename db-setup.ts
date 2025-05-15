import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './shared/schema';

// For migrations
async function runMigration() {
  console.log('🔄 Starting database migration...');
  
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
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
  const client = postgres(process.env.DATABASE_URL);
  try {
    console.log('🔄 Setting up session table...');
    await client.query(`
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
  } finally {
    await client.end();
  }

  // Seed initial official data
  const seedClient = postgres(process.env.DATABASE_URL);
  const seedDb = drizzle(seedClient);
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