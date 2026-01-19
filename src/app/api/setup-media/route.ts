import { NextResponse } from 'next/server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

export async function POST() {
  const results: string[] = []

  try {
    // 1. Create media_files table using raw SQL via RPC
    // Since we can't run raw SQL, we'll check if tables exist and create test data

    // Check if media_files table exists
    const { error: checkError } = await supabase
      .from('media_files')
      .select('id')
      .limit(1)

    if (checkError && checkError.code === 'PGRST205') {
      results.push('❌ media_files tablosu yok - SQL Editor\'da manuel oluşturulmalı')
    } else {
      results.push('✅ media_files tablosu mevcut')
    }

    // Check if media_categories table exists
    const { error: catError } = await supabase
      .from('media_categories')
      .select('id')
      .limit(1)

    if (catError && catError.code === 'PGRST205') {
      results.push('❌ media_categories tablosu yok - SQL Editor\'da manuel oluşturulmalı')
    } else {
      results.push('✅ media_categories tablosu mevcut')
    }

    // Check storage bucket
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.name === 'wellnesstal')

    if (bucketExists) {
      results.push('✅ wellnesstal bucket mevcut')
    } else {
      const { error: bucketError } = await supabase.storage.createBucket('wellnesstal', {
        public: true,
        fileSizeLimit: 10485760,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
      })
      if (bucketError) {
        results.push(`❌ Bucket oluşturulamadı: ${bucketError.message}`)
      } else {
        results.push('✅ wellnesstal bucket oluşturuldu')
      }
    }

    const needsManualSetup = results.some(r => r.includes('❌'))

    return NextResponse.json({
      success: !needsManualSetup,
      results,
      sql: needsManualSetup ? `
-- Supabase SQL Editor'da çalıştırın:

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

CREATE INDEX IF NOT EXISTS idx_media_files_category ON media_files(category);
CREATE INDEX IF NOT EXISTS idx_media_files_created_at ON media_files(created_at DESC);

INSERT INTO media_categories (name, slug, icon, color, sort_order) VALUES
  ('Genel', 'general', '📁', '#6B7280', 1),
  ('Hero Görselleri', 'hero', '🖼️', '#3B82F6', 2),
  ('Hizmetler', 'services', '✨', '#10B981', 3),
  ('Ekip', 'team', '👥', '#8B5CF6', 4),
  ('Galeri', 'gallery', '📷', '#F59E0B', 5),
  ('Logo & Marka', 'branding', '🎨', '#EC4899', 6)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view media files" ON media_files FOR SELECT USING (true);
CREATE POLICY "Public can view media categories" ON media_categories FOR SELECT USING (true);
CREATE POLICY "Auth can insert media" ON media_files FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth can update media" ON media_files FOR UPDATE USING (true);
CREATE POLICY "Auth can delete media" ON media_files FOR DELETE USING (true);
      ` : null
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      results
    }, { status: 500 })
  }
}
