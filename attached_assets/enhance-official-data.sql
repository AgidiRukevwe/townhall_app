-- This script will update the database with the fully structured education information
-- Note: Your database uses 'school' instead of 'institution'
-- Career data uses 'office' and 'date' fields

-- Update Sen. SERIAKE DICKSON's education and career data
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
    "office": "Legal Practitioner",
    "date": "1993 - 1999"
  },
  {
    "office": "Attorney General and Commissioner for Justice",
    "date": "2006 - 2007"
  },
  {
    "office": "Governor of Bayelsa State",
    "date": "2012 - 2020"
  },
  {
    "office": "Senator, Bayelsa West Senatorial District",
    "date": "2020 - Present"
  }
]'::jsonb
WHERE id = '7e03327e-f1d6-4515-bb7c-6ed1d0db842d';

-- Example for another leader with the required format
UPDATE leaders
SET career = '[
  {
    "office": "MEMBER, HOUSE OF REPRESENTATIVES",
    "date": "- June 1, 2011"
  }
]'::jsonb
WHERE id = '48f7c037-e11c-495c-914f-64a5e9290cc3';

-- You can add similar updates for other officials below