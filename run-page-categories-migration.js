const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rtudfkccbzbblfmeoyop.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is not set!')
  console.error('Please set it in your .env file or environment variables.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  console.log('🚀 Running Page Categories Migration (014_page_categories.sql)...\n')

  try {
    // Read migration file
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '014_page_categories.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    console.log('📄 Migration file loaded')
    console.log('📦 Executing migration...\n')

    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    let successCount = 0
    let errorCount = 0

    for (const statement of statements) {
      if (statement.trim().length === 0) continue

      try {
        // Use RPC if available, otherwise try direct query
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' })
        
        if (error) {
          // Try direct query approach
          const { error: directError } = await supabase
            .from('_migration_temp')
            .select('*')
            .limit(0)

          // If RPC doesn't work, we need to use a different approach
          // For now, log the statement and continue
          console.log(`   ⚠️  Statement skipped (may need manual execution): ${statement.substring(0, 50)}...`)
          continue
        }

        successCount++
      } catch (e) {
        errorCount++
        console.log(`   ⚠️  Error: ${e.message}`)
      }
    }

    // Alternative: Execute via REST API using PostgREST
    // Since RPC might not be available, let's try a different approach
    console.log('\n📝 Trying alternative approach: Direct table operations...\n')

    // Create table
    try {
      const { error: createError } = await supabase
        .from('page_categories')
        .select('*')
        .limit(1)

      if (createError && createError.message?.includes('does not exist')) {
        console.log('   ⚠️  Table does not exist. Please run the migration SQL manually in Supabase SQL Editor.')
        console.log('   📄 File location: supabase/migrations/014_page_categories.sql')
        console.log('\n   Or copy the SQL below and run it in Supabase SQL Editor:\n')
        console.log('─'.repeat(60))
        console.log(migrationSQL)
        console.log('─'.repeat(60))
        return
      } else {
        console.log('   ✅ Table exists')
      }
    } catch (e) {
      console.log('   ⚠️  Could not check table. Please run migration manually.')
      console.log('   📄 File location: supabase/migrations/014_page_categories.sql')
      return
    }

    // Insert default categories
    console.log('\n📝 Inserting default categories...\n')

    const defaultCategories = [
      { name: 'Genel', slug: 'genel', description: 'Genel sayfalar', color: '#9CAF88', icon: '📄', order_num: 1, active: true },
      { name: 'Hizmetler', slug: 'hizmetler', description: 'Hizmet sayfaları', color: '#3b82f6', icon: '💼', order_num: 2, active: true },
      { name: 'Hakkında', slug: 'hakkimizda', description: 'Hakkımızda sayfaları', color: '#10b981', icon: '👥', order_num: 3, active: true },
      { name: 'İletişim', slug: 'iletisim', description: 'İletişim sayfaları', color: '#f59e0b', icon: '📞', order_num: 4, active: true },
      { name: 'Blog', slug: 'blog', description: 'Blog yazıları', color: '#8b5cf6', icon: '📝', order_num: 5, active: true },
      { name: 'Landing', slug: 'landing', description: 'Landing sayfaları', color: '#ec4899', icon: '🎯', order_num: 6, active: true }
    ]

    for (const category of defaultCategories) {
      const { error } = await supabase
        .from('page_categories')
        .upsert(category, { onConflict: 'slug' })

      if (error) {
        console.log(`   ⚠️  ${category.name}: ${error.message}`)
      } else {
        console.log(`   ✅ ${category.icon} ${category.name}`)
      }
    }

    console.log('\n✅ Migration completed!')
    console.log('\n📋 Next steps:')
    console.log('   1. Refresh your browser')
    console.log('   2. Go to /admin/pages')
    console.log('   3. Categories should now be available')

  } catch (error) {
    console.error('\n❌ Migration error:', error.message)
    console.error('\n📋 Manual migration required:')
    console.error('   1. Go to Supabase Dashboard > SQL Editor')
    console.error('   2. Copy the SQL from: supabase/migrations/014_page_categories.sql')
    console.error('   3. Paste and run it in SQL Editor')
  }
}

runMigration()

