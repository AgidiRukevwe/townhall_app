-- Drop the constraint that's causing the issue
ALTER TABLE ratings DROP CONSTRAINT IF EXISTS ratings_leader_id_sector_id_user_id_key;

-- Re-create a proper constraint that allows updates
-- This will ensure a user can only have one rating per official/sector combination
-- but will not prevent updates
ALTER TABLE ratings ADD CONSTRAINT ratings_leader_id_sector_id_user_id_key 
  UNIQUE (leader_id, sector_id, user_id);

-- Make sure the ratings range is correct (0-100)
ALTER TABLE ratings DROP CONSTRAINT IF EXISTS ratings_rating_check;
ALTER TABLE ratings ADD CONSTRAINT ratings_rating_check 
  CHECK (rating >= 0 AND rating <= 100);