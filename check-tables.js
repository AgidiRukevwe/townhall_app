import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkTables() {
  console.log('Checking database tables...');
  
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
    
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('Available tables:');
    tables.forEach(table => {
      console.log(`- ${table.table_name}`);
    });
    
    // Check if leaders table exists
    const leadersExists = tables.some(table => table.table_name === 'leaders');
    if (leadersExists) {
      console.log('\nChecking leaders table structure:');
      const columns = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'leaders'
        ORDER BY ordinal_position;
      `;
      
      columns.forEach(column => {
        console.log(`- ${column.column_name} (${column.data_type}, ${column.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
      });
    } else {
      console.log('\nLeaders table does not exist');
    }
  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    await sql.end();
  }
}

checkTables();