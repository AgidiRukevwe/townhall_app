-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  device_id TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create sectors table
CREATE TABLE IF NOT EXISTS public.sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT DEFAULT '#2196F3',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_official_id UUID NOT NULL,
  user_id UUID REFERENCES public.users(id),
  sector_id UUID REFERENCES public.sectors(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create petitions table
CREATE TABLE IF NOT EXISTS public.petitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  category TEXT,
  user_id UUID REFERENCES public.users(id),
  public_official_id UUID,
  signature_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



-- Create public_officials table (if not using the existing leaders table)
CREATE TABLE IF NOT EXISTS public.public_officials (
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
  education JSONB DEFAULT '[]'::jsonb,
  awards JSONB DEFAULT '[]'::jsonb,
  career JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable row-level security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.petitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_officials ENABLE ROW LEVEL SECURITY;

-- Create policies to allow read access to all tables for all users
CREATE POLICY "Allow read access for all users" ON public.users 
  FOR SELECT USING (true);

CREATE POLICY "Allow read access for all users" ON public.user_profiles 
  FOR SELECT USING (true);

CREATE POLICY "Allow read access for all users" ON public.sectors 
  FOR SELECT USING (true);

CREATE POLICY "Allow read access for all users" ON public.ratings 
  FOR SELECT USING (true);

CREATE POLICY "Allow read access for all users" ON public.petitions 
  FOR SELECT USING (true);

CREATE POLICY "Allow read access for all users" ON public.public_officials 
  FOR SELECT USING (true);

-- Create policies to allow users to insert/update their own data
CREATE POLICY "Allow users to insert their own data" ON public.users 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to update their own data" ON public.users 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profiles" ON public.user_profiles 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to submit ratings" ON public.ratings 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to create petitions" ON public.petitions 
  FOR INSERT WITH CHECK (true);