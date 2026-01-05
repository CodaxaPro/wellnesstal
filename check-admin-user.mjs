#!/usr/bin/env node

/**
 * Admin Kullanıcı Bilgilerini Kontrol Et
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Environment variables'ları yükle
function loadEnvFile() {
  try {
    const envPath = join(__dirname, '.env.local')
    const envContent = readFileSync(envPath, 'utf-8')
    const envVars = {}
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length) {
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
          envVars[key.trim()] = value
        }
      }
    })
    
    return envVars
  } catch (error) {
    console.error('❌ .env.local dosyası bulunamadı!')
    return null
  }
}

async function checkAdminUsers() {
  console.log('🔍 Admin Kullanıcıları Kontrol Ediliyor\n')
  console.log('=' .repeat(50))
  
  const envVars = loadEnvFile()
  if (!envVars) {
    return
  }
  
  const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
  const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL veya Key bulunamadı!')
    return
  }
  
  console.log(`✅ Supabase URL: ${supabaseUrl}\n`)
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Admin kullanıcıları getir
  console.log('📋 Admin kullanıcıları getiriliyor...')
  const { data: adminUsers, error } = await supabase
    .from('admin_users')
    .select('id, username, email, role, created_at')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error(`❌ Hata: ${error.message}`)
    return
  }
  
  if (!adminUsers || adminUsers.length === 0) {
    console.log('⚠️  Hiç admin kullanıcı bulunamadı!')
    console.log('\n💡 Yeni admin kullanıcı oluşturmak için:')
    console.log('   node create-admin-user.mjs')
    return
  }
  
  console.log(`\n✅ ${adminUsers.length} admin kullanıcı bulundu:\n`)
  
  adminUsers.forEach((user, index) => {
    console.log(`${index + 1}. Kullanıcı:`)
    console.log(`   📧 Email: ${user.email}`)
    console.log(`   👤 Username: ${user.username}`)
    console.log(`   🔑 Role: ${user.role}`)
    console.log(`   📅 Oluşturulma: ${new Date(user.created_at).toLocaleString('tr-TR')}`)
    console.log('')
  })
  
  console.log('=' .repeat(50))
  console.log('\n💡 Şifre bilinmiyorsa yeni admin oluşturun:')
  console.log('   node create-admin-user.mjs <email> <password>')
}

checkAdminUsers().catch(console.error)

