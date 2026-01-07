#!/usr/bin/env node

/**
 * Run migration to add active field to pages table
 * Direct PostgreSQL connection method
 */

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
  console.log('🚀 Pages Active Field Migration (Direct Method)\n')

  const envVars = loadEnvFile()
  if (!envVars) {
    console.error('❌ .env.local dosyası bulunamadı!')
    process.exit(1)
  }

  const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'] || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL veya Service Role Key bulunamadı!')
    process.exit(1)
  }

  // Extract project ref from URL
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
  if (!projectRef) {
    console.error('❌ Geçersiz Supabase URL formatı!')
    process.exit(1)
  }

  console.log('📊 Supabase Bilgileri:')
  console.log(`   Project: ${projectRef}`)
  console.log('')

  // Read migration file
  const migrationPath = join(__dirname, 'supabase', 'migrations', '016_add_pages_active_field.sql')
  let migrationSQL
  try {
    migrationSQL = readFileSync(migrationPath, 'utf-8')
  } catch (error) {
    console.error(`❌ Migration dosyası okunamadı: ${migrationPath}`)
    process.exit(1)
  }

  console.log('📝 Migration SQL hazırlanıyor...')
  console.log('')

  // Use Supabase REST API with rpc/exec_sql if available
  // Otherwise, provide manual instructions
  try {
    console.log('⏳ Supabase Management API ile migration çalıştırılıyor...')
    
    // Try using Supabase REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ 
        query: migrationSQL 
      })
    })

    if (response.ok) {
      console.log('✅ Migration başarıyla çalıştırıldı!')
    } else {
      const errorText = await response.text()
      console.log('⚠️  RPC yöntemi çalışmadı, alternatif yöntem deneniyor...')
      throw new Error(`RPC failed: ${errorText}`)
    }

  } catch (error) {
    console.log('')
    console.log('⚠️  Otomatik migration çalıştırılamadı.')
    console.log('')
    console.log('📋 Manuel Migration Adımları:')
    console.log('')
    console.log('1. Supabase Dashboard\'a gidin:')
    console.log(`   https://app.supabase.com/project/${projectRef}`)
    console.log('')
    console.log('2. SQL Editor\'a gidin (sol menüden)')
    console.log('')
    console.log('3. "New Query" butonuna tıklayın')
    console.log('')
    console.log('4. Aşağıdaki SQL\'i yapıştırın:')
    console.log('')
    console.log('─'.repeat(60))
    console.log(migrationSQL)
    console.log('─'.repeat(60))
    console.log('')
    console.log('5. "Run" butonuna tıklayın')
    console.log('')
    console.log('✅ Migration tamamlandıktan sonra sayfayı yenileyin!')
    console.log('')
    
    // Also try to open browser
    const { default: open } = await import('open').catch(() => ({ default: () => {} }))
    const dashboardUrl = `https://app.supabase.com/project/${projectRef}/sql/new`
    console.log(`🌐 Dashboard'u açmak için: ${dashboardUrl}`)
    console.log('')
    
    process.exit(0)
  }

  // Verify
  console.log('')
  console.log('🔍 Doğrulama yapılıyor...')
  
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  const { data, error } = await supabase
    .from('pages')
    .select('id, title, active')
    .limit(1)

  if (error) {
    if (error.message.includes('active')) {
      console.log('   ⚠️  Active kolonu henüz eklenmemiş.')
      console.log('   Lütfen yukarıdaki manuel adımları takip edin.')
    } else {
      console.log(`   ❌ Doğrulama hatası: ${error.message}`)
    }
  } else {
    console.log('   ✅ Active kolonu başarıyla eklendi!')
    if (data && data.length > 0) {
      console.log(`   📄 Örnek: ${data[0].title} - Active: ${data[0].active}`)
    }
  }

  console.log('')
  console.log('🎉 İşlem tamamlandı!')
}

runMigration().catch(console.error)

