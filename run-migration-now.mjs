#!/usr/bin/env node

/**
 * Run migration to add active field to pages table
 * This script will attempt to run the migration via Supabase API
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
  console.log('🚀 Pages Active Field Migration\n')

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

  console.log('📊 Supabase Bağlantı Bilgileri:')
  console.log(`   URL: ${supabaseUrl}`)
  console.log('')

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Check if column already exists
  console.log('🔍 Active kolonu kontrol ediliyor...')
  const { error: testError, data: testData } = await supabase
    .from('pages')
    .select('id, title, active')
    .limit(1)

  if (!testError && testData) {
    console.log('✅ Active kolonu zaten mevcut!')
    console.log(`   Örnek: ${testData[0]?.title} - Active: ${testData[0]?.active}`)
    return
  }

  console.log('⚠️  Active kolonu bulunamadı. Migration gerekli.\n')

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

  // Try to execute via Supabase REST API
  console.log('⏳ Migration çalıştırılmaya çalışılıyor...')
  
  try {
    // Try using Supabase Management API
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
    
    // Use Supabase REST API to execute SQL via RPC (if available)
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
      
      // Verify
      const { data: verifyData } = await supabase
        .from('pages')
        .select('id, title, active')
        .limit(1)

      if (verifyData && verifyData.length > 0) {
        console.log(`✅ Doğrulandı: ${verifyData[0].title} - Active: ${verifyData[0].active}`)
      }
      
      console.log('')
      console.log('🎉 Migration tamamlandı!')
      return
    } else {
      const errorText = await response.text()
      console.log('⚠️  RPC yöntemi çalışmadı')
      throw new Error(`RPC failed: ${errorText}`)
    }

  } catch (error) {
    console.log('')
    console.log('⚠️  Otomatik migration çalıştırılamadı.')
    console.log('')
    console.log('📋 Migration\'ı manuel olarak çalıştırmanız gerekiyor:')
    console.log('')
    console.log('1. Supabase Dashboard\'a gidin:')
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
    console.log(`   https://app.supabase.com/project/${projectRef}`)
    console.log('')
    console.log('2. SQL Editor > New Query')
    console.log('')
    console.log('3. Aşağıdaki SQL\'i yapıştırın ve "Run" butonuna tıklayın:')
    console.log('')
    console.log('─'.repeat(60))
    console.log(migrationSQL)
    console.log('─'.repeat(60))
    console.log('')
    console.log('✅ Migration\'ı çalıştırdıktan sonra sayfayı yenileyin!')
    console.log('')
    process.exit(0)
  }
}

runMigration().catch(console.error)

