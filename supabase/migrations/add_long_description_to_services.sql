-- Add long_description column to services table
-- Run this in Supabase SQL Editor

ALTER TABLE services
ADD COLUMN IF NOT EXISTS long_description TEXT;

-- Optional: Copy existing description to long_description for existing records
UPDATE services
SET long_description = description
WHERE long_description IS NULL AND description IS NOT NULL;

