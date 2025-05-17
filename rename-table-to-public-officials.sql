-- Enable pgcrypto extension for UUID generation if it doesn't exist
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- First, check if the leaders table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'leaders'
    ) THEN
        -- Create a new public_officials table with the same structure as leaders
        CREATE TABLE public.public_officials AS TABLE public.leaders;
        
        -- Add primary key constraint to public_officials
        ALTER TABLE public.public_officials ADD PRIMARY KEY (id);
        
        -- Drop the leaders table
        DROP TABLE public.leaders CASCADE;
        
        -- Update references in ratings table
        ALTER TABLE public.ratings 
        RENAME COLUMN leader_id TO public_official_id;
        
        -- Update references in petitions table if it exists
        IF EXISTS (
            SELECT FROM pg_tables
            WHERE schemaname = 'public'
            AND tablename = 'petitions'
        ) THEN
            ALTER TABLE public.petitions 
            RENAME COLUMN leader_id TO public_official_id;
        END IF;
        
        -- Enable RLS on public_officials table
        ALTER TABLE public.public_officials ENABLE ROW LEVEL SECURITY;
        
        -- Create policy for public_officials
        CREATE POLICY "Allow read access for all users" 
        ON public.public_officials FOR SELECT USING (true);
        
        RAISE NOTICE 'Successfully renamed leaders table to public_officials';
    ELSE
        RAISE NOTICE 'The leaders table does not exist, no action needed';
    END IF;
END $$;