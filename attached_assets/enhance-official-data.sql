-- Add more education and career data for Sen. SERIAKE DICKSON
UPDATE leaders 
SET education = '[
  {
    "institution": "Mopa Secondary School, Mopa",
    "degree": "SSCE",
    "field": "Secondary Education",
    "startYear": 1979,
    "endYear": 1983
  },
  {
    "institution": "Rivers State University of Science and Technology",
    "degree": "LLB Honours",
    "field": "Law",
    "startYear": 1988,
    "endYear": 1992
  },
  {
    "institution": "Nigerian Law School",
    "degree": "BL",
    "field": "Legal Practice",
    "startYear": 1992,
    "endYear": 1993
  }
]'::jsonb,
career = '[
  {
    "position": "Legal Practitioner",
    "party": "",
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
WHERE id = '7e03327e-f1d6-4515-bb7c-6ed1d0db842d';  -- Sen. SERIAKE DICKSON

-- You can add similar updates for other officials below