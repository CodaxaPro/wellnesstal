#!/usr/bin/env node

/**
 * Yeni Admin Kullanıcı Oluştur
 * 
 * Kullanım: node create-admin-user.mjs <email> <password>
 * Örnek: node create-admin-user.mjs admin@wellnesstal.de admin123
 */

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
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

async function createAdminUser() {
  const email = process.argv[2]
  const password = process.argv[3]
  
  if (!email || !password) {
    console.log('❌ Email ve şifre gereklidir!')
    console.log('\n📖 Kullanım:')
    console.log('   node create-admin-user.mjs <email> <password>')
    console.log('\n📝 Örnek:')
    console.log('   node create-admin-user.mjs admin@wellnesstal.de admin123')
    process.exit(1)
  }
  
  console.log('👤 Yeni Admin Kullanıcı Oluşturuluyor\n')
  console.log('=' .repeat(50))
  
  const envVars = loadEnvFile()
  if (!envVars) {
    process.exit(1)
  }
  
  const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
  const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL veya Key bulunamadı!')
    process.exit(1)
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Şifreyi hash'le
  console.log('🔐 Şifre hash'leniyor...')
  const passwordHash = await bcrypt.hash(password, 10)
  
  // Username'i email'den çıkar
  const username = email.split('@')[0]
  
  // Kullanıcıyı oluştur
  console.log('📝 Kullanıcı oluşturuluyor...')
  const { data: adminUser, error } = await supabase
    .from('admin_users')
    .insert({
      username: username,
      email: email,
      password_hash: passwordHash,
      role: 'admin'
    })
    .select()
    .single()
  
  if (error) {
    if (error.code === '23505') {
      console.error('❌ Bu email veya username zaten kullanılıyor!')
    } else {
      console.error(`❌ Hata: ${error.message}`)
    }
    process.exit(1)
  }
  
  console.log('\n✅ Admin kullanıcı başarıyla oluşturuldu!\n')
  console.log('📋 Kullanıcı Bilgileri:')
  console.log(`   📧 Email: ${adminUser.email}`)
  console.log(`   👤 Username: ${adminUser.username}`)
  console.log(`   🔑 Role: ${adminUser.role}`)
  console.log(`   🆔 ID: ${adminUser.id}`)
  console.log('\n💡 Artık bu bilgilerle giriş yapabilirsiniz!')
  console.log('=' .repeat(50))
}

createAdminUser().catch(console.error)

