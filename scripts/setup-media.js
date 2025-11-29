const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupMedia() {
  console.log('Setting up media gallery...\n')

  // 1. Check media_files table
  console.log('1. Checking media_files table...')
  const { error: mediaCheckError } = await supabase
    .from('media_files')
    .select('id')
    .limit(1)

  if (mediaCheckError && mediaCheckError.code === 'PGRST205') {
    console.log('   ✗ Table does not exist - will create via SQL')
  } else if (!mediaCheckError) {
    console.log('   ✓ media_files table exists')
  } else {
    console.log('   ? Error checking:', mediaCheckError.message)
  }

  // 2. Check media_categories table
  console.log('2. Checking media_categories table...')
  const { error: catCheckError } = await supabase
    .from('media_categories')
    .select('id')
    .limit(1)

  if (catCheckError && catCheckError.code === 'PGRST205') {
    console.log('   ✗ Table does not exist - will create via SQL')
  } else if (!catCheckError) {
    console.log('   ✓ media_categories table exists')
  } else {
    console.log('   ? Error checking:', catCheckError.message)
  }

  // 3. Create storage bucket
  console.log('3. Creating storage bucket "wellnesstal"...')

  try {
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.name === 'wellnesstal')

    if (bucketExists) {
      console.log('   ✓ Bucket "wellnesstal" already exists')
    } else {
      const { error: bucketError } = await supabase.storage.createBucket('wellnesstal', {
        public: true,
        fileSizeLimit: 10485760,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
      })

      if (bucketError) {
        console.log('   ✗ Error creating bucket:', bucketError.message)
      } else {
        console.log('   ✓ Bucket "wellnesstal" created successfully!')
      }
    }
  } catch (err) {
    console.log('   ✗ Storage error:', err.message)
  }

  // Check if tables need to be created
  const needsTables = (mediaCheckError && mediaCheckError.code === 'PGRST205') ||
                      (catCheckError && catCheckError.code === 'PGRST205')

  if (needsTables) {
    console.log('\n========================================')
    console.log('TABLES MISSING - Run this SQL in Supabase Dashboard:')
    console.log('Go to: SQL Editor -> New query')
    console.log('========================================\n')

    const sql = `
-- Media Files Table
CREATE TABLE IF NOT EXISTS media_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  thumbnail_path TEXT,
  medium_path TEXT,
  large_path TEXT,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text VARCHAR(500),
  category VARCHAR(100) DEFAULT 'general',
  tags TEXT[],
  blur_hash VARCHAR(100),
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media Categories Table
CREATE TABLE IF NOT EXISTS media_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50) DEFAULT '📁',
  color VARCHAR(20) DEFAULT '#6B7280',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_media_files_category ON media_files(category);
CREATE INDEX IF NOT EXISTS idx_media_files_created_at ON media_files(created_at DESC);

-- Default categories
INSERT INTO media_categories (name, slug, icon, color, sort_order) VALUES
  ('Genel', 'general', '📁', '#6B7280', 1),
  ('Hero Görselleri', 'hero', '🖼️', '#3B82F6', 2),
  ('Hizmetler', 'services', '✨', '#10B981', 3),
  ('Ekip', 'team', '👥', '#8B5CF6', 4),
  ('Galeri', 'gallery', '📷', '#F59E0B', 5),
  ('Logo & Marka', 'branding', '🎨', '#EC4899', 6)
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_categories ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view media files" ON media_files FOR SELECT USING (true);
CREATE POLICY "Public can view media categories" ON media_categories FOR SELECT USING (true);

-- Write policies
CREATE POLICY "Authenticated can insert media" ON media_files FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update media" ON media_files FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete media" ON media_files FOR DELETE USING (true);
`
    console.log(sql)

    // Also copy to clipboard on macOS
    try {
      require('child_process').execSync(`echo "${sql.replace(/"/g, '\\"')}" | pbcopy`)
      console.log('\n✓ SQL copied to clipboard!')
    } catch (e) {
      // Clipboard copy failed, that's ok
    }
  } else {
    console.log('\n✓ All tables exist!')
  }

  console.log('\n========================================')
  console.log('Setup complete!')
  console.log('========================================')
}

setupMedia().catch(console.error)
