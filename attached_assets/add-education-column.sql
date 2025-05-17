-- Add education column to leaders table if it doesn't exist
ALTER TABLE leaders ADD COLUMN IF NOT EXISTS education JSONB;

-- Update a sample leader with education data for testing
UPDATE leaders 
SET education = '[
  {
    "institution": "University of Lagos",
    "degree": "Bachelor of Law",
    "field": "Law",
    "startYear": 1998,
    "endYear": 2002
  },
  {
    "institution": "Nigerian Law School",
    "degree": "Barrister at Law",
    "field": "Legal Practice",
    "startYear": 2002,
    "endYear": 2003
  }
]'::jsonb
WHERE id = '7e03327e-f1d6-4515-bb7c-6ed1d0db842d';  -- This is Sen. SERIAKE DICKSON's ID from the logs

-- You can update more leaders with education data here
-- Example:
UPDATE leaders 
SET education = '[
  {
    "institution": "Ahmadu Bello University",
    "degree": "Bachelor of Science",
    "field": "Political Science",
    "startYear": 1990,
    "endYear": 1994
  },
  {
    "institution": "University of Ibadan",
    "degree": "Master of Public Administration",
    "field": "Public Policy",
    "startYear": 1995,
    "endYear": 1997
  }
]'::jsonb
WHERE id = '342326f2-8c16-44ae-8d45-eb35cee6068f';  -- This is Hon. YUSUF GALAMBI's ID from the logs