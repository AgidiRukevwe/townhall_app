-- Add bio column to leaders table
ALTER TABLE public.leaders 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Note: No need to add to "officials" table as it doesn't exist in the schema
-- The application maps leaders table data to the Official interface

-- Comment explaining the change
COMMENT ON COLUMN public.leaders.bio IS 'Biographical information about the leader';

-- If you want to add sample data to existing leaders:
-- UPDATE public.leaders
-- SET bio = 'No biographical information available yet.'
-- WHERE bio IS NULL;