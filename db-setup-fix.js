import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function createTables() {
  console.log('Setting up database tables...');
  
  let connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }
  
  // Add SSL requirement if not present
  if (!connectionString.includes("sslmode=")) {
    connectionString += connectionString.includes("?") 
      ? "&sslmode=require" 
      : "?sslmode=require";
  }
  
  const sql = postgres(connectionString, { ssl: true });
  
  try {
    console.log('Connected to database');
    
    // Enable the pgcrypto extension for UUID generation
    await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;
    console.log('Enabled pgcrypto extension');
    
    // Create leaders table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS leaders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        avatar_url TEXT,
        office TEXT NOT NULL,
        party TEXT,
        chamber TEXT,
        jurisdiction TEXT,
        dob TEXT,
        target_achievements TEXT,
        phone TEXT,
        email TEXT,
        parliament_address TEXT,
        education JSONB DEFAULT '[]',
        awards JSONB DEFAULT '[]',
        career JSONB DEFAULT '[]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Created leaders table');
    
    // Create users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_anonymous BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Created users table');
    
    // Create user_profiles table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id TEXT PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        device_id TEXT NOT NULL,
        ip_address TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Created user_profiles table');
    
    // Create sectors table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS sectors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        color TEXT DEFAULT 'blue',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Created sectors table');
    
    // Create ratings table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS ratings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        leader_id UUID NOT NULL REFERENCES leaders(id),
        sector_id UUID NOT NULL REFERENCES sectors(id),
        rating INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Created ratings table');
    
    // Create offices table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS offices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Created offices table');
    
    // Create office_sectors table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS office_sectors (
        office_id UUID REFERENCES offices(id),
        sector_id UUID REFERENCES sectors(id),
        PRIMARY KEY (office_id, sector_id)
      )
    `;
    console.log('Created office_sectors table');
    
    // Create petitions table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS petitions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT,
        category TEXT,
        user_id UUID NOT NULL REFERENCES users(id),
        leader_id UUID REFERENCES leaders(id),
        signature_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Created petitions table');
    
    // Seed initial data - sectors
    const sectorEntries = [
      { name: 'Healthcare', color: '#4CAF50' },
      { name: 'Education', color: '#FFC107' },
      { name: 'Infrastructure', color: '#2196F3' },
      { name: 'Economy', color: '#E91E63' },
      { name: 'Security', color: '#673AB7' }
    ];
    
    for (const sector of sectorEntries) {
      await sql`
        INSERT INTO sectors (name, color)
        VALUES (${sector.name}, ${sector.color})
        ON CONFLICT (id) DO NOTHING
      `;
    }
    console.log('Seeded initial sectors');
    
    // Seed sample leaders
    const leaders = [
      {
        name: 'Bola Ahmed Tinubu',
        office: 'President',
        party: 'APC',
        jurisdiction: 'Federal',
        avatar_url: 'https://www.vanguardngr.com/wp-content/uploads/2023/03/Bola-Tinubu.webp'
      },
      {
        name: 'Kashim Shettima',
        office: 'Vice President',
        party: 'APC',
        jurisdiction: 'Federal',
        avatar_url: 'https://dailypost.ng/wp-content/uploads/2022/07/Kashim-Shettima.jpeg'
      },
      {
        name: 'Godswill Akpabio',
        office: 'Senate President',
        party: 'APC',
        jurisdiction: 'Federal',
        avatar_url: 'https://dailypost.ng/wp-content/uploads/2023/06/Godswill-Akpabio-1.jpeg'
      },
      {
        name: 'Babajide Sanwo-Olu',
        office: 'Governor',
        party: 'APC',
        jurisdiction: 'Lagos',
        avatar_url: 'https://guardian.ng/wp-content/uploads/2023/03/Babajide-Sanwo-Olu.jpg'
      },
      {
        name: 'Peter Mbah',
        office: 'Governor',
        party: 'PDP',
        jurisdiction: 'Enugu',
        avatar_url: 'https://dailypost.ng/wp-content/uploads/2022/10/Peter-Ndubuisi-Mbah.jpeg'
      }
    ];
    
    for (const leader of leaders) {
      await sql`
        INSERT INTO leaders (name, office, party, jurisdiction, avatar_url)
        VALUES (${leader.name}, ${leader.office}, ${leader.party}, ${leader.jurisdiction}, ${leader.avatar_url})
        ON CONFLICT DO NOTHING
      `;
    }
    console.log('Seeded sample leaders');
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await sql.end();
  }
}

createTables();