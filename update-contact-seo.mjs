import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL veya Key bulunamadı!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateContactSEO() {
  console.log('🔍 Contact Settings SEO Güncellemesi\n')
  console.log('='.repeat(70))

  // Get current contact-settings
  const { data: current, error: fetchError } = await supabase
    .from('content')
    .select('*')
    .eq('section', 'contact-settings')
    .single()

  if (fetchError || !current) {
    console.log('⚠️  contact-settings bulunamadı, oluşturuluyor...')
    
    const defaultContent = {
      businessInfo: {
        name: 'Wellnesstal',
        tagline: 'Premium Wellness & Headspa in Baesweiler',
        description: 'Ihre Oase der Entspannung im Herzen von Baesweiler. Professionelle Wellness-Behandlungen für Körper und Seele.'
      },
      contact: {
        phone: '+49 1733828581',
        email: 'info@wellnesstal.de',
        whatsapp: '+49 1733828581'
      },
      address: {
        street: 'Reyplatz 10',
        city: 'Baesweiler',
        postalCode: '52499',
        country: 'Deutschland',
        googleMapsUrl: 'https://maps.google.com/?q=Wellnesstal+Baesweiler'
      },
      openingHours: {
        monday: { open: '09:00', close: '19:00', closed: false },
        tuesday: { open: '09:00', close: '19:00', closed: false },
        wednesday: { open: '09:00', close: '19:00', closed: false },
        thursday: { open: '09:00', close: '19:00', closed: false },
        friday: { open: '09:00', close: '19:00', closed: false },
        saturday: { open: '10:00', close: '16:00', closed: false },
        sunday: { open: '', close: '', closed: true }
      },
      socialMedia: {
        instagram: 'https://instagram.com/wellnesstal',
        facebook: 'https://facebook.com/wellnesstal',
        whatsapp: 'https://wa.me/491733828581',
        website: 'https://wellnesstal.de'
      },
      seo: {
        metaTitle: 'Wellnesstal - Premium Wellness & Headspa in Baesweiler',
        metaDescription: 'Entspannung und Wellness in Baesweiler. Professionelle Headspa-Behandlungen für Ihr Wohlbefinden. Jetzt Termin vereinbaren!',
        keywords: ['wellness', 'headspa', 'massage', 'baesweiler', 'entspannung', 'aromatherapie', 'spa']
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        bookingConfirmations: true
      }
    }

    const { data: inserted, error: insertError } = await supabase
      .from('content')
      .insert({
        section: 'contact-settings',
        title: 'Contact Settings',
        description: 'Contact and business settings',
        content: defaultContent,
        last_updated: new Date().toISOString(),
        updated_by: 'Admin'
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ Oluşturma hatası:', insertError.message)
      return
    }

    console.log('✅ contact-settings oluşturuldu!')
    return
  }

  console.log('📄 Mevcut contact-settings bulundu\n')
  
  const currentContent = current.content || {}
  const currentSEO = currentContent.seo || {}

  console.log('🔍 Mevcut SEO Ayarları:')
  console.log(`   Meta Title: ${currentSEO.metaTitle || 'Yok'}`)
  console.log(`   Meta Description: ${currentSEO.metaDescription || 'Yok'}`)
  console.log(`   Keywords: ${currentSEO.keywords?.join(', ') || 'Yok'}\n`)

  // Check if needs update
  const needsUpdate = 
    currentSEO.metaDescription?.includes('Köln') ||
    currentSEO.keywords?.includes('köln') ||
    currentSEO.keywords?.includes('Köln')

  if (!needsUpdate) {
    console.log('✅ SEO ayarları zaten güncel!')
    return
  }

  console.log('🔄 SEO ayarları güncelleniyor...\n')

  // Update SEO
  const updatedContent = {
    ...currentContent,
    seo: {
      ...currentSEO,
      metaDescription: currentSEO.metaDescription?.replace(/Köln/g, 'Baesweiler') || 'Entspannung und Wellness in Baesweiler. Professionelle Headspa-Behandlungen für Ihr Wohlbefinden. Jetzt Termin vereinbaren!',
      keywords: currentSEO.keywords?.map(k => k.toLowerCase() === 'köln' || k.toLowerCase() === 'koln' ? 'baesweiler' : k) || ['wellness', 'headspa', 'massage', 'baesweiler', 'entspannung', 'aromatherapie', 'spa']
    }
  }

  // Ensure all required fields are present
  if (!updatedContent.seo.metaTitle) {
    updatedContent.seo.metaTitle = 'Wellnesstal - Premium Wellness & Headspa in Baesweiler'
  }
  if (!updatedContent.seo.metaDescription) {
    updatedContent.seo.metaDescription = 'Entspannung und Wellness in Baesweiler. Professionelle Headspa-Behandlungen für Ihr Wohlbefinden. Jetzt Termin vereinbaren!'
  }
  if (!updatedContent.seo.keywords || updatedContent.seo.keywords.length === 0) {
    updatedContent.seo.keywords = ['wellness', 'headspa', 'massage', 'baesweiler', 'entspannung', 'aromatherapie', 'spa']
  }

  const { data: updated, error: updateError } = await supabase
    .from('content')
    .update({
      content: updatedContent,
      last_updated: new Date().toISOString(),
      updated_by: 'Admin'
    })
    .eq('id', current.id)
    .select()
    .single()

  if (updateError) {
    console.error('❌ Güncelleme hatası:', updateError.message)
    return
  }

  console.log('✅ SEO ayarları güncellendi!\n')
  console.log('📝 Yeni SEO Ayarları:')
  console.log(`   Meta Title: ${updated.content.seo.metaTitle}`)
  console.log(`   Meta Description: ${updated.content.seo.metaDescription}`)
  console.log(`   Keywords: ${updated.content.seo.keywords.join(', ')}\n`)
  console.log('='.repeat(70))
  console.log('\n💡 İpucu: Admin panelinde sayfayı yenileyin (F5) ve değişiklikleri görün.')
}

updateContactSEO().catch(console.error)

