// import fs from 'fs';
// import { supabase } from './supabase-client';

// async function setupDatabase() {
//   try {
//     console.log('Setting up database tables...');

//     // Read SQL file
//     const sqlContent = fs.readFileSync('./setup-supabase-tables.sql', 'utf-8');

//     // Split SQL commands
//     const sqlCommands = sqlContent
//       .split(';')
//       .filter(cmd => cmd.trim() !== '')
//       .map(cmd => cmd.trim() + ';');

//     // Execute each SQL command
//     for (const command of sqlCommands) {
//       console.log('Executing SQL command:', command.substring(0, 50) + '...');
//       const { error } = await supabase.rpc('exec_sql', { sql_query: command });

//       if (error) {
//         console.error('Error executing SQL command:', error.message);
//         console.error('SQL command was:', command);
//       } else {
//         console.log('SQL command executed successfully');
//       }
//     }

//     console.log('Database setup completed successfully!');
//   } catch (error) {
//     console.error('Error setting up database:', error);
//   }
// }

// // Call the setup function
// setupDatabase();
