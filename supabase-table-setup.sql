-- This SQL script creates the necessary tables in your Supabase dashboard
-- 1. Copy this entire script
-- 2. Go to Supabase Dashboard > SQL Editor
-- 3. Create a "New Query" and paste this script
-- 4. Run the query to create all tables in your Supabase UI

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  device_id TEXT,
  ip_address TEXT,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Officials table
CREATE TABLE IF NOT EXISTS public.officials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  party TEXT,
  state TEXT,
  image_url TEXT,
  bio TEXT,
  twitter_handle TEXT,
  facebook_handle TEXT,
  instagram_handle TEXT,
  approval_rating INTEGER DEFAULT 50,
  approval_trend INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sectors table
CREATE TABLE IF NOT EXISTS public.sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  official_id UUID REFERENCES public.officials(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings table
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  official_id UUID REFERENCES public.officials(id),
  overall_rating INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sector ratings table
CREATE TABLE IF NOT EXISTS public.sector_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating_id UUID REFERENCES public.ratings(id),
  sector_id UUID REFERENCES public.sectors(id),
  rating INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Elections table
CREATE TABLE IF NOT EXISTS public.elections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  official_id UUID REFERENCES public.officials(id),
  position TEXT NOT NULL,
  year INTEGER NOT NULL,
  result TEXT NOT NULL,
  vote_percentage NUMERIC(5,2),
  party TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Careers table
CREATE TABLE IF NOT EXISTS public.careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  official_id UUID REFERENCES public.officials(id),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  start_year INTEGER NOT NULL,
  end_year INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Petitions table
CREATE TABLE IF NOT EXISTS public.petitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  goal INTEGER NOT NULL,
  current_signatures INTEGER DEFAULT 0,
  target_official_id UUID REFERENCES public.officials(id),
  created_by_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active'
);

-- Sessions table for express-session
CREATE TABLE IF NOT EXISTS public.session (
  sid VARCHAR NOT NULL COLLATE "default" PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON public.session (expire);

-- Create RLS policies to make the tables accessible
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sector_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.petitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session ENABLE ROW LEVEL SECURITY;

-- Grant access to the authenticated role
CREATE POLICY "Allow full access to authenticated users" ON public.users FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users" ON public.user_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users" ON public.officials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users" ON public.sectors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users" ON public.ratings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users" ON public.sector_ratings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users" ON public.elections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users" ON public.careers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users" ON public.petitions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users" ON public.session FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow anon access to officials data (read-only)
CREATE POLICY "Allow public access to officials" ON public.officials FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public access to sectors" ON public.sectors FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public access to ratings" ON public.ratings FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public access to sector_ratings" ON public.sector_ratings FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public access to elections" ON public.elections FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public access to careers" ON public.careers FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public access to petitions" ON public.petitions FOR SELECT TO anon USING (true);

-- Sample officials data
INSERT INTO public.officials (name, position, party, state, bio, approval_rating)
VALUES 
  ('Bola Ahmed Tinubu', 'President', 'APC', 'Federal', 'Bola Ahmed Tinubu is the President of Nigeria, elected in 2023.', 50),
  ('Babajide Sanwoolu', 'Governor', 'APC', 'Lagos', 'Babajide Sanwoolu is the Governor of Lagos State.', 50),
  ('Peter Obi', 'Presidential Candidate', 'Labour Party', 'Federal', 'Peter Obi was a presidential candidate in the 2023 Nigerian general election.', 50)
ON CONFLICT (id) DO NOTHING;

-- Sample sectors for the officials
INSERT INTO public.sectors (name, description, color, official_id)
SELECT 'Economy', 'Economic policies and management', '#4CAF50', id FROM public.officials WHERE name = 'Bola Ahmed Tinubu'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.sectors (name, description, color, official_id)
SELECT 'Security', 'National security and safety', '#F44336', id FROM public.officials WHERE name = 'Bola Ahmed Tinubu'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.sectors (name, description, color, official_id)
SELECT 'Education', 'Educational development and policies', '#2196F3', id FROM public.officials WHERE name = 'Bola Ahmed Tinubu'
ON CONFLICT (id) DO NOTHING;

-- Need to manually add a user? Uncomment and edit below:
-- INSERT INTO public.users (email, username, password, is_anonymous)
-- VALUES ('example@email.com', 'example_user', 'password_hash_here', false)
-- ON CONFLICT (username) DO NOTHING;