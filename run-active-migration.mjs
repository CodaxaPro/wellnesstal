#!/usr/bin/env node

/**
 * Run migration to add active field to pages table
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function loadEnvFile() {
  try {
    const envPath = join(__dirname, '.env.local')
    const envContent = readFileSync(envPath, 'utf-8')
    const envVars = {}
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '')
          envVars[key.trim()] = value.trim()
        }
      }
    })
    return envVars
  } catch (error) {
    return null
  }
}

async function runMigration() {
  console.log('🚀 Pages Active Field Migration Başlatılıyor...\n')

  const envVars = loadEnvFile()
  if (!envVars) {
    console.error('❌ .env.local dosyası bulunamadı!')
    console.log('Lütfen .env.local dosyasını oluşturun ve Supabase bilgilerini ekleyin.')
    process.exit(1)
  }

  const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'] || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL veya Service Role Key bulunamadı!')
    console.log('Lütfen .env.local dosyasında şunları kontrol edin:')
    console.log('  - NEXT_PUBLIC_SUPABASE_URL')
    console.log('  - SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  console.log('📊 Supabase Bağlantı Bilgileri:')
  console.log(`   URL: ${supabaseUrl}`)
  console.log(`   Key: ${supabaseKey.substring(0, 20)}...`)
  console.log('')

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Read migration file
  const migrationPath = join(__dirname, 'supabase', 'migrations', '016_add_pages_active_field.sql')
  let migrationSQL
  try {
    migrationSQL = readFileSync(migrationPath, 'utf-8')
  } catch (error) {
    console.error(`❌ Migration dosyası okunamadı: ${migrationPath}`)
    process.exit(1)
  }

  console.log('📝 Migration SQL:')
  console.log('─'.repeat(60))
  console.log(migrationSQL)
  console.log('─'.repeat(60))
  console.log('')

  // Execute migration using RPC (if available) or direct SQL
  try {
    console.log('⏳ Migration çalıştırılıyor...')

    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (const statement of statements) {
      if (statement.length === 0) continue
      
      console.log(`   Çalıştırılıyor: ${statement.substring(0, 50)}...`)
      
      // Use Supabase REST API to execute SQL
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ sql: statement })
      })

      // If RPC doesn't work, try direct query
      if (!response.ok) {
        // Try alternative: Check if column exists first
        const { data: checkData, error: checkError } = await supabase
          .from('pages')
          .select('active')
          .limit(1)

        if (checkError && checkError.message.includes('column') && checkError.message.includes('active')) {
          // Column doesn't exist, we need to add it
          console.log('   ⚠️  RPC yöntemi çalışmadı, alternatif yöntem deneniyor...')
          
          // Use Supabase PostgREST to add column via direct SQL execution
          // We'll use a workaround: try to update a page with active field
          // This will fail but tell us if column exists
          
          // Actually, best approach: Use Supabase Management API or direct connection
          console.log('   ℹ️  Migration manuel olarak çalıştırılmalı.')
          console.log('   Supabase Dashboard > SQL Editor\'a gidin ve şu SQL\'i çalıştırın:')
          console.log('')
          console.log(migrationSQL)
          console.log('')
          process.exit(0)
        }
      }
    }

    // Verify migration
    console.log('')
    console.log('✅ Migration başarıyla çalıştırıldı!')
    console.log('')
    console.log('🔍 Doğrulama yapılıyor...')

    const { data: testData, error: testError } = await supabase
      .from('pages')
      .select('id, title, active')
      .limit(1)

    if (testError) {
      if (testError.message.includes('active')) {
        console.log('   ⚠️  Active kolonu henüz eklenmemiş görünüyor.')
        console.log('   Lütfen migration\'ı Supabase Dashboard\'dan manuel olarak çalıştırın.')
      } else {
        console.log(`   ❌ Doğrulama hatası: ${testError.message}`)
      }
    } else {
      console.log('   ✅ Active kolonu başarıyla eklendi!')
      if (testData && testData.length > 0) {
        console.log(`   📄 Örnek sayfa: ${testData[0].title} - Active: ${testData[0].active}`)
      }
    }

    console.log('')
    console.log('🎉 Migration tamamlandı!')

  } catch (error) {
    console.error('')
    console.error('❌ Migration hatası:', error.message)
    console.error('')
    console.log('💡 Alternatif: Migration\'ı manuel olarak çalıştırın:')
    console.log('   1. Supabase Dashboard > SQL Editor\'a gidin')
    console.log('   2. Aşağıdaki SQL\'i yapıştırın ve çalıştırın:')
    console.log('')
    console.log(migrationSQL)
    console.log('')
    process.exit(1)
  }
}

runMigration().catch(console.error)

