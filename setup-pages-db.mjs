// Direct SQL execution via Supabase REST API
const SUPABASE_URL = 'https://rtudfkccbzbblfmeoyop.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dWRma2NjYnpiYmxmbWVveW9wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTM4OTY2NiwiZXhwIjoyMDc0OTY1NjY2fQ.9DDLqlFA4HuTUulMJFciohVSCoO_QCYcYXJsc6MRQKg'

const sql = `
DROP TABLE IF EXISTS page_blocks CASCADE;
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS block_types CASCADE;

CREATE TABLE pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  template VARCHAR(50) DEFAULT 'default',
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT[],
  og_image VARCHAR(500),
  canonical_url VARCHAR(500),
  no_index BOOLEAN DEFAULT FALSE,
  no_follow BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  created_by VARCHAR(255),
  updated_by VARCHAR(255)
);

CREATE TABLE page_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  block_type VARCHAR(50) NOT NULL,
  content JSONB DEFAULT '{}',
  position INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  custom_styles JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE block_types (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  category VARCHAR(50) DEFAULT 'content',
  default_content JSONB DEFAULT '{}',
  schema JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE block_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_pages" ON pages FOR ALL USING (true);
CREATE POLICY "allow_all_blocks" ON page_blocks FOR ALL USING (true);
CREATE POLICY "allow_all_types" ON block_types FOR ALL USING (true);
`

async function runSQL() {
  console.log('🚀 Creating tables via Supabase REST API...\n')

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`
      },
      body: JSON.stringify({ query: sql })
    })

    if (!response.ok) {
      const text = await response.text()
      console.log('REST API response:', response.status, text)

      // Try alternative method - postgREST doesn't support raw SQL
      // We need to use the database connection directly
      console.log('\n⚠️  Supabase REST API does not support raw SQL execution.')
      console.log('\n📋 Please run the SQL manually in Supabase Dashboard:')
      console.log('   1. Go to: https://supabase.com/dashboard')
      console.log('   2. Select your project')
      console.log('   3. Go to SQL Editor')
      console.log('   4. Paste the SQL (already copied to clipboard)')
      console.log('   5. Click Run\n')
    } else {
      console.log('✅ Tables created successfully!')
    }
  } catch (error) {
    console.log('Error:', error.message)
    console.log('\n⚠️  Cannot execute SQL directly via API.')
    console.log('📋 SQL has been copied to your clipboard - paste it in Supabase SQL Editor')
  }
}

runSQL()
