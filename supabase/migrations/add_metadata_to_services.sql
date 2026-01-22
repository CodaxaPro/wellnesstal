-- Add metadata JSONB column to services table for storing button configurations
-- Run this in Supabase SQL Editor

ALTER TABLE services
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_services_metadata ON services USING gin (metadata);

-- Optional: Add button_config column directly (alternative approach)
-- ALTER TABLE services
-- ADD COLUMN IF NOT EXISTS button_config JSONB DEFAULT '{}'::jsonb;

