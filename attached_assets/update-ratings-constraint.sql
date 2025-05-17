-- Update the check constraint on the ratings table to allow 0-100 range
ALTER TABLE ratings DROP CONSTRAINT IF EXISTS ratings_rating_check;
ALTER TABLE ratings ADD CONSTRAINT ratings_rating_check CHECK (rating >= 0 AND rating <= 100);

-- Also let's update the sectors table to ensure we have all the needed sectors
INSERT INTO sectors (id, name) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Overall'),
  (gen_random_uuid(), 'Healthcare'),
  (gen_random_uuid(), 'Education'),
  (gen_random_uuid(), 'Infrastructure'),
  (gen_random_uuid(), 'Economy'),
  (gen_random_uuid(), 'Security'),
  (gen_random_uuid(), 'Agriculture'),
  (gen_random_uuid(), 'Technology'),
  (gen_random_uuid(), 'Environment'),
  (gen_random_uuid(), 'Transportation')
ON CONFLICT (name) DO NOTHING;