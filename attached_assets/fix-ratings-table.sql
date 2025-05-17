-- Add user_id column to ratings table if it doesn't exist
ALTER TABLE ratings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Make sure the unique constraint doesn't include user_id
-- First drop the existing constraint if it exists
ALTER TABLE ratings DROP CONSTRAINT IF EXISTS ratings_leader_id_sector_id_key;

-- Create a new constraint that lets users rate the same sector
ALTER TABLE ratings ADD CONSTRAINT ratings_leader_id_sector_id_user_id_key 
  UNIQUE(leader_id, sector_id, user_id);

-- Enable row-level security for all tables
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Modify or create policies for all tables
-- Allow inserts on all tables
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON ratings;
CREATE POLICY "Enable insert for authenticated users" ON ratings FOR INSERT WITH CHECK (true);

-- Policies for sectors table
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON sectors;
CREATE POLICY "Enable insert for authenticated users" ON sectors FOR INSERT WITH CHECK (true);

-- Create a "Public" role for the overall sector if it doesn't exist
INSERT INTO sectors (id, name) 
VALUES ('00000000-0000-0000-0000-000000000000', 'Overall') 
ON CONFLICT DO NOTHING;