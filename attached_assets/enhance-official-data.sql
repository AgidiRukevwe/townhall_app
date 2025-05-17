-- This script will update the database with the fully structured education information
-- It looks like the system is already generating ID and officialId fields for us

-- First, let's see the current data to understand how it's stored
-- SELECT id, education FROM leaders WHERE id = '7e03327e-f1d6-4515-bb7c-6ed1d0db842d';

-- Update Sen. SERIAKE DICKSON's education data with institution details but keep existing IDs
WITH existing_data AS (
  SELECT id, education FROM leaders WHERE id = '7e03327e-f1d6-4515-bb7c-6ed1d0db842d'
)
UPDATE leaders
SET education = (
  SELECT jsonb_agg(
    CASE
      WHEN (education_item->>'degree') = 'SSCE1983' THEN
        jsonb_set(
          education_item,
          '{institution}',
          '"Mopa Secondary School, Mopa"'::jsonb
        )
      WHEN (education_item->>'degree') = 'LLB Honours1992' THEN
        jsonb_set(
          jsonb_set(
            education_item,
            '{institution}',
            '"Rivers State University of Science and Technology"'::jsonb
          ),
          '{field}',
          '"Law"'::jsonb
        )
      WHEN (education_item->>'degree') = 'BL1993' THEN
        jsonb_set(
          jsonb_set(
            education_item,
            '{institution}',
            '"Nigerian Law School"'::jsonb
          ),
          '{field}',
          '"Legal Practice"'::jsonb
        )
      ELSE education_item
    END
  )
  FROM existing_data, jsonb_array_elements(existing_data.education) AS education_item
)
WHERE id = '7e03327e-f1d6-4515-bb7c-6ed1d0db842d';

-- Update Sen. SERIAKE DICKSON's career data 
WITH existing_data AS (
  SELECT id, career FROM leaders WHERE id = '7e03327e-f1d6-4515-bb7c-6ed1d0db842d'
)
UPDATE leaders
SET career = (
  SELECT jsonb_agg(
    CASE
      WHEN position = 0 THEN
        jsonb_build_object(
          'id', career_item->>'id',
          'officialId', career_item->>'officialId',
          'position', 'Senator',
          'party', 'PDP',
          'location', 'Bayelsa West Senatorial District',
          'startYear', 2020,
          'endYear', 0,
          'createdAt', career_item->>'createdAt'
        )
      ELSE career_item
    END
  )
  FROM existing_data, jsonb_array_elements(COALESCE(existing_data.career, '[]'::jsonb)) WITH ORDINALITY AS t(career_item, position)
)
WHERE id = '7e03327e-f1d6-4515-bb7c-6ed1d0db842d';

-- You can add similar updates for other officials below