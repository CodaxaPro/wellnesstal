-- =============================================
-- Add active field to pages table
-- Allows pages to be enabled/disabled independently of status
-- =============================================

-- Add active column to pages table
ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_pages_active ON pages(active);

-- Update existing pages to be active by default
UPDATE pages SET active = TRUE WHERE active IS NULL;

-- Add comment
COMMENT ON COLUMN pages.active IS 'Whether the page is active (visible) or inactive (hidden)';

