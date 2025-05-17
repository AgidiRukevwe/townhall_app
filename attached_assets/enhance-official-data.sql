-- This script will update the database with the fully structured education information
-- Note: Your database uses 'school' instead of 'institution'

-- First, directly update Sen. SERIAKE DICKSON's education data
UPDATE leaders
SET education = '[
  {
    "degree": "SSCE1983",
    "school": "Government Secondary school, Toru-Ebeni"
  },
  {
    "degree": "LLB Honours1992",
    "school": "University of Science and technology, PH, Rivers State"
  },
  {
    "degree": "BL1993",
    "school": "Nigerian Law school, Lagos"
  }
]'::jsonb,
career = '[
  {
    "position": "Legal Practitioner",
    "party": "Independent",
    "location": "Bayelsa State",
    "startYear": 1993,
    "endYear": 1999
  },
  {
    "position": "Attorney General and Commissioner for Justice",
    "party": "PDP",
    "location": "Bayelsa State",
    "startYear": 2006,
    "endYear": 2007
  },
  {
    "position": "Governor",
    "party": "PDP",
    "location": "Bayelsa State",
    "startYear": 2012,
    "endYear": 2020
  },
  {
    "position": "Senator",
    "party": "PDP",
    "location": "Bayelsa West Senatorial District",
    "startYear": 2020,
    "endYear": 0
  }
]'::jsonb
WHERE id = '7e03327e-f1d6-4515-bb7c-6ed1d0db842d';

-- You can add similar updates for other officials below