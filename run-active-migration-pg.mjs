#!/usr/bin/env node

/**
 * Run migration to add active field to pages table
 * Using direct PostgreSQL connection
 */

import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { Client } = pg
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
  console.log('🚀 Pages Active Field Migration (PostgreSQL Direct)\n')

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

  // Extract connection info from Supabase URL
  // Supabase connection string format: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
  // We need to get the connection string from Supabase Dashboard or use the service role key
  
  console.log('📊 Supabase Bilgileri:')
  console.log(`   URL: ${supabaseUrl}`)
  console.log('')
  console.log('⚠️  PostgreSQL bağlantı bilgileri .env.local\'de yok.')
  console.log('')
  console.log('📋 Migration\'ı manuel olarak çalıştırmanız gerekiyor:')
  console.log('')
  console.log('1. Supabase Dashboard\'a gidin:')
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
  if (projectRef) {
    console.log(`   https://app.supabase.com/project/${projectRef}`)
  }
  console.log('')
  console.log('2. SQL Editor > New Query')
  console.log('')
  console.log('3. Aşağıdaki SQL\'i çalıştırın:')
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
  
  console.log('─'.repeat(60))
  console.log(migrationSQL)
  console.log('─'.repeat(60))
  console.log('')
  console.log('✅ Migration\'ı çalıştırdıktan sonra sayfayı yenileyin!')
  console.log('')
  
  // Try to get database connection string from Supabase
  // Supabase provides connection pooler URL in dashboard
  // But we can't access it programmatically without the password
  
  console.log('💡 Alternatif: Supabase CLI kullanarak:')
  console.log('   1. Supabase CLI\'yi yükleyin: npm install -g supabase')
  console.log('   2. supabase link --project-ref ' + (projectRef || 'YOUR_PROJECT_REF'))
  console.log('   3. supabase db push')
  console.log('')
  
  process.exit(0)
}

runMigration().catch(console.error)

