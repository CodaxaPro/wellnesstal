#!/usr/bin/env node

/**
 * Local ve Production Senkronizasyon Kontrol Scripti
 * 
 * Bu script local ve production ortamlarının senkronize olup olmadığını kontrol eder.
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

async function checkLocalDatabase() {
  console.log('\n📊 LOCAL DATABASE KONTROLÜ\n')
  console.log('=' .repeat(50))
  
  const envVars = loadEnvFile()
  if (!envVars) {
    return null
  }
  
  const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
  const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL veya Key bulunamadı!')
    return null
  }
  
  console.log(`✅ Supabase URL: ${supabaseUrl}`)
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Tabloları kontrol et
  const tables = ['pages', 'page_blocks', 'content', 'homepage_sections']
  const localStats = {}
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.log(`⚠️  ${table}: Tablo bulunamadı veya erişim hatası`)
        localStats[table] = null
      } else {
        console.log(`✅ ${table}: ${count || 0} kayıt`)
        localStats[table] = count || 0
      }
    } catch (error) {
      console.log(`❌ ${table}: Hata - ${error.message}`)
      localStats[table] = null
    }
  }
  
  // Son güncellemeleri kontrol et
  try {
    const { data: recentPages, error } = await supabase
      .from('pages')
      .select('id, title, slug, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5)
    
    if (!error && recentPages && recentPages.length > 0) {
      console.log('\n📄 Son Güncellenen Sayfalar:')
      recentPages.forEach(page => {
        console.log(`   - ${page.title} (${page.slug}) - ${new Date(page.updated_at).toLocaleString('tr-TR')}`)
      })
    }
  } catch (error) {
    console.log('⚠️  Son güncellemeler kontrol edilemedi')
  }
  
  return { url: supabaseUrl, stats: localStats }
}

async function checkProductionDatabase(productionUrl, productionKey) {
  if (!productionUrl || !productionKey) {
    console.log('\n⚠️  Production database bilgileri sağlanmadı')
    console.log('   Production URL ve Key\'i script parametresi olarak verin:')
    console.log('   node check-sync.mjs <production_url> <production_key>')
    return null
  }
  
  console.log('\n📊 PRODUCTION DATABASE KONTROLÜ\n')
  console.log('=' .repeat(50))
  console.log(`✅ Supabase URL: ${productionUrl}`)
  
  const supabase = createClient(productionUrl, productionKey)
  
  const tables = ['pages', 'page_blocks', 'content', 'homepage_sections']
  const productionStats = {}
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.log(`⚠️  ${table}: Tablo bulunamadı veya erişim hatası`)
        productionStats[table] = null
      } else {
        console.log(`✅ ${table}: ${count || 0} kayıt`)
        productionStats[table] = count || 0
      }
    } catch (error) {
      console.log(`❌ ${table}: Hata - ${error.message}`)
      productionStats[table] = null
    }
  }
  
  return { url: productionUrl, stats: productionStats }
}

function compareStats(local, production) {
  if (!local || !production) {
    return
  }
  
  console.log('\n🔍 SENKRONİZASYON KARŞILAŞTIRMASI\n')
  console.log('=' .repeat(50))
  
  const tables = ['pages', 'page_blocks', 'content', 'homepage_sections']
  let allSynced = true
  
  tables.forEach(table => {
    const localCount = local.stats[table]
    const productionCount = production.stats[table]
    
    if (localCount === null || productionCount === null) {
      console.log(`⚠️  ${table}: Karşılaştırılamadı`)
      allSynced = false
    } else if (localCount === productionCount) {
      console.log(`✅ ${table}: Senkronize (${localCount} kayıt)`)
    } else {
      console.log(`❌ ${table}: FARKLI! Local: ${localCount}, Production: ${productionCount}`)
      allSynced = false
    }
  })
  
  if (allSynced) {
    console.log('\n✅ Tüm tablolar senkronize görünüyor!')
  } else {
    console.log('\n⚠️  Senkronizasyon sorunları tespit edildi!')
    console.log('\n📋 Çözüm Önerileri:')
    console.log('   1. Production database\'e migration\'ları uygulayın')
    console.log('   2. Veri senkronizasyonu yapın (SYNC_LOCAL_PRODUCTION.md\'ye bakın)')
    console.log('   3. Environment variables\'ları kontrol edin')
  }
  
  // URL karşılaştırması
  if (local.url !== production.url) {
    console.log('\n⚠️  FARKLI SUPABASE PROJELERİ KULLANILIYOR!')
    console.log(`   Local: ${local.url}`)
    console.log(`   Production: ${production.url}`)
    console.log('\n   Bu normal olabilir, ancak veriler farklı database\'lerde olacaktır.')
  } else {
    console.log('\n✅ Aynı Supabase projesi kullanılıyor')
  }
}

async function main() {
  console.log('🚀 Local ve Production Senkronizasyon Kontrolü\n')
  
  const local = await checkLocalDatabase()
  
  // Production bilgileri script parametrelerinden al
  const productionUrl = process.argv[2]
  const productionKey = process.argv[3]
  
  const production = await checkProductionDatabase(productionUrl, productionKey)
  
  if (local && production) {
    compareStats(local, production)
  } else if (local) {
    console.log('\n💡 Production bilgilerini kontrol etmek için:')
    console.log('   node check-sync.mjs <production_url> <production_key>')
  }
  
  console.log('\n' + '=' .repeat(50))
  console.log('✅ Kontrol tamamlandı\n')
}

main().catch(console.error)

