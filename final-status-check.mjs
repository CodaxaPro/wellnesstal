import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { execSync } from 'child_process'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 GIT, SUPABASE & VERCEL - KAPSAMLI KONTROL\n')
console.log('='.repeat(70))

// 1. GIT KONTROLÜ
console.log('\n📦 GIT DURUMU:\n')
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf-8' })
  if (gitStatus.trim() === '') {
    console.log('  ✅ Working tree temiz - Tüm değişiklikler commit edilmiş')
  } else {
    console.log('  ⚠️  Uncommitted değişiklikler var:')
    console.log(gitStatus)
  }

  const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim()
  console.log(`  📍 Branch: ${branch}`)

  const remoteStatus = execSync('git status -sb', { encoding: 'utf-8' })
  if (remoteStatus.includes('ahead')) {
    console.log('  ⚠️  Local branch remote\'tan ileride - Push gerekli!')
  } else if (remoteStatus.includes('behind')) {
    console.log('  ⚠️  Local branch remote\'tan geride - Pull gerekli!')
  } else {
    console.log('  ✅ Local ve remote senkronize')
  }

  const lastCommit = execSync('git log -1 --oneline', { encoding: 'utf-8' }).trim()
  console.log(`  📝 Son commit: ${lastCommit}`)
} catch (error) {
  console.log('  ❌ Git kontrolü başarısız:', error.message)
}

// 2. SUPABASE KONTROLÜ
console.log('\n🗄️  SUPABASE DURUMU:\n')
if (!supabaseUrl || !supabaseKey) {
  console.log('  ❌ Supabase environment variables eksik!')
  console.log('     NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.log('     SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅' : '❌')
} else {
  console.log('  ✅ Environment variables mevcut')
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Kontak ayarları kontrolü
    const { data: contactSettings, error: contactError } = await supabase
      .from('content')
      .select('content')
      .eq('section', 'contact-settings')
      .single()
    
    if (contactError) {
      console.log('  ⚠️  contact-settings bulunamadı')
    } else {
      const seo = contactSettings?.content?.seo
      if (seo) {
        const hasKoln = seo.metaDescription?.includes('Köln') || 
                      seo.keywords?.some(k => k.toLowerCase().includes('köln') || k.toLowerCase().includes('koln'))
        if (hasKoln) {
          console.log('  ⚠️  SEO ayarlarında hala Köln referansı var!')
        } else {
          console.log('  ✅ SEO ayarları güncel (Baesweiler)')
        }
        console.log(`     Meta Title: ${seo.metaTitle || 'Yok'}`)
        console.log(`     Meta Description: ${seo.metaDescription?.substring(0, 60) || 'Yok'}...`)
        console.log(`     Keywords: ${seo.keywords?.join(', ') || 'Yok'}`)
      }
    }

    // Sayfalar kontrolü
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('slug, title, status')
      .in('slug', ['headspa', 'gutschein'])
    
    if (pagesError) {
      console.log('  ⚠️  Sayfalar kontrol edilemedi:', pagesError.message)
    } else {
      console.log(`  ✅ Sayfalar kontrolü: ${pages?.length || 0} sayfa bulundu`)
      pages?.forEach(page => {
        const statusIcon = page.status === 'published' ? '✅' : '⚠️'
        console.log(`     ${statusIcon} ${page.slug}: ${page.status}`)
      })
    }

    // WhatsApp ayarları kontrolü
    const { data: whatsappSettings, error: whatsappError } = await supabase
      .from('content')
      .select('content')
      .eq('section', 'whatsapp-settings')
      .single()
    
    if (whatsappError) {
      console.log('  ⚠️  whatsapp-settings bulunamadı')
    } else {
      const phone = whatsappSettings?.content?.basic?.phoneNumber
      if (phone && phone !== '+49 1733828581') {
        console.log(`  ⚠️  WhatsApp telefon numarası güncel değil: ${phone}`)
      } else {
        console.log('  ✅ WhatsApp ayarları güncel')
      }
    }

  } catch (error) {
    console.log('  ❌ Supabase bağlantı hatası:', error.message)
  }
}

// 3. VERCEL KONTROLÜ
console.log('\n🚀 VERCEL DEPLOYMENT:\n')
try {
  const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim()
  console.log(`  📍 Remote: ${remoteUrl}`)
  
  if (remoteUrl.includes('github.com')) {
    console.log('  ✅ GitHub bağlantısı mevcut')
    console.log('  💡 Vercel otomatik deploy edecek (GitHub entegrasyonu varsa)')
    console.log('  💡 Manuel kontrol: https://vercel.com/dashboard')
  } else {
    console.log('  ⚠️  GitHub remote bulunamadı')
  }
} catch (error) {
  console.log('  ⚠️  Remote kontrolü başarısız')
}

// 4. ENVIRONMENT VARIABLES KONTROLÜ
console.log('\n🔐 ENVIRONMENT VARIABLES:\n')
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'JWT_SECRET',
  'NEXT_PUBLIC_SITE_URL'
]

requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    const masked = varName.includes('KEY') || varName.includes('SECRET') 
      ? `${value.substring(0, 10)}...` 
      : value
    console.log(`  ✅ ${varName}: ${masked}`)
  } else {
    console.log(`  ❌ ${varName}: EKSIK!`)
  }
})

// 5. ÖNEMLİ DOSYALAR KONTROLÜ
console.log('\n📁 ÖNEMLİ DOSYALAR:\n')
const importantFiles = [
  'src/middleware.ts',
  'next.config.ts',
  'src/components/ui/PageLoader.tsx',
  'src/app/admin/(dashboard)/contact/page.tsx',
  'src/app/admin/(dashboard)/whatsapp/page.tsx'
]

importantFiles.forEach(file => {
  try {
    if (existsSync(join(__dirname, file))) {
      console.log(`  ✅ ${file}`)
    } else {
      console.log(`  ❌ ${file} bulunamadı!`)
    }
  } catch {
    console.log(`  ⚠️  ${file} kontrol edilemedi`)
  }
})

console.log('\n' + '='.repeat(70))
console.log('\n✅ KONTROL TAMAMLANDI!\n')
console.log('💡 Öneriler:')
console.log('   1. Tüm değişiklikler commit edilmiş mi kontrol edin')
console.log('   2. Vercel Dashboard\'da son deployment\'ı kontrol edin')
console.log('   3. Production\'da test edin')
console.log('   4. Environment variables Vercel\'de ayarlı mı kontrol edin\n')

