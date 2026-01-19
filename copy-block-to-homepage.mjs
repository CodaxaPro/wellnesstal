import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function copyBlockToHomepage() {
  console.log('🚀 Headspa Testimonial Block\'unu Ana Sayfaya Kopyalama\n')

  try {
    // 1. Headspa sayfası ve block'u bul
    const { data: headspaPage, error: headspaError } = await supabase
      .from('pages')
      .select('id, slug')
      .eq('slug', 'headspa')
      .single()

    if (headspaError || !headspaPage) {
      console.error('❌ Headspa sayfası bulunamadı:', headspaError)
      return
    }

    const { data: headspaBlocks, error: blocksError } = await supabase
      .from('page_blocks')
      .select('*')
      .eq('page_id', headspaPage.id)
      .eq('block_type', 'testimonials')
      .eq('visible', true)
      .order('position', { ascending: true })
      .limit(1)

    if (blocksError || !headspaBlocks || headspaBlocks.length === 0) {
      console.error('❌ Headspa\'da testimonial block bulunamadı:', blocksError)
      return
    }

    const headspaBlock = headspaBlocks[0]
    console.log(`✅ Headspa'dan block bulundu: ${headspaBlock.content?.testimonials?.length || 0} yorum`)

    // 2. Ana sayfa bul
    const { data: homePage, error: homeError } = await supabase
      .from('pages')
      .select('id, slug')
      .eq('slug', 'home')
      .single()

    if (homeError || !homePage) {
      console.error('❌ Ana sayfa bulunamadı:', homeError)
      return
    }

    // 3. Ana sayfadaki tüm testimonial block'ları sil
    const { error: deleteError } = await supabase
      .from('page_blocks')
      .delete()
      .eq('page_id', homePage.id)
      .eq('block_type', 'testimonials')

    if (deleteError) {
      console.error('⚠️ Eski block silinirken hata:', deleteError)
    } else {
      console.log('🧹 Eski testimonial block\'lar temizlendi')
    }

    // 4. Headspa block'unu olduğu gibi ana sayfaya kopyala
    const { data: newBlock, error: insertError } = await supabase
      .from('page_blocks')
      .insert({
        page_id: homePage.id,
        block_type: headspaBlock.block_type,
        content: headspaBlock.content,
        position: headspaBlock.position || 0,
        visible: headspaBlock.visible,
        custom_styles: headspaBlock.custom_styles || {}
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ Block kopyalanamadı:', insertError)
      return
    }

    console.log(`\n✅ Block başarıyla kopyalandı!`)
    console.log(`📊 ${newBlock.content?.testimonials?.length || 0} yorum ile ana sayfaya eklendi`)

  } catch (error) {
    console.error('❌ Hata:', error)
  }
}

copyBlockToHomepage().catch(console.error)

