import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://rtudfkccbzbblfmeoyop.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dWRma2NjYnpiYmxmbWVveW9wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTM4OTY2NiwiZXhwIjoyMDc0OTY1NjY2fQ.9DDLqlFA4HuTUulMJFciohVSCoO_QCYcYXJsc6MRQKg'
)

async function setup() {
  console.log('🚀 Setting up page system...\n')

  // 1. Delete existing tables by deleting all data first
  console.log('1. Cleaning existing data...')

  try {
    await supabase.from('page_blocks').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log('   ✓ page_blocks cleaned')
  } catch (e) {
    console.log('   - page_blocks table not exists (ok)')
  }

  try {
    await supabase.from('pages').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log('   ✓ pages cleaned')
  } catch (e) {
    console.log('   - pages table not exists (ok)')
  }

  try {
    await supabase.from('block_types').delete().neq('id', 'xxxxx')
    console.log('   ✓ block_types cleaned')
  } catch (e) {
    console.log('   - block_types table not exists (ok)')
  }

  // 2. Insert block types
  console.log('\n2. Inserting block types...')
  const blockTypes = [
    { id: 'hero', name: 'Hero Banner', description: 'Hero section', icon: 'photo', category: 'header', default_content: { title: 'Baslik', subtitle: 'Alt baslik', image: '', ctaText: 'Detay', ctaLink: '#', backgroundType: 'image' }, sort_order: 1, is_active: true },
    { id: 'text', name: 'Metin Blogu', description: 'Rich text', icon: 'align-left', category: 'content', default_content: { title: 'Baslik', content: 'Icerik...', alignment: 'left' }, sort_order: 2, is_active: true },
    { id: 'features', name: 'Ozellikler', description: 'Feature cards', icon: 'grid-3x3', category: 'content', default_content: { title: 'Ozelliklerimiz', features: [] }, sort_order: 3, is_active: true },
    { id: 'gallery', name: 'Galeri', description: 'Image gallery', icon: 'images', category: 'media', default_content: { title: 'Galeri', images: [], columns: 3 }, sort_order: 4, is_active: true },
    { id: 'services', name: 'Hizmetler', description: 'Service cards', icon: 'briefcase', category: 'content', default_content: { title: 'Hizmetlerimiz', services: [], showPrices: true }, sort_order: 5, is_active: true },
    { id: 'pricing', name: 'Fiyat Tablosu', description: 'Pricing', icon: 'currency-euro', category: 'content', default_content: { title: 'Fiyatlarimiz', packages: [] }, sort_order: 6, is_active: true },
    { id: 'testimonials', name: 'Musteri Yorumlari', description: 'Testimonials', icon: 'chat-bubble', category: 'social', default_content: { title: 'Yorumlar', testimonials: [] }, sort_order: 7, is_active: true },
    { id: 'contact', name: 'Iletisim', description: 'Contact form', icon: 'envelope', category: 'forms', default_content: { title: 'Iletisim', showForm: true, showInfo: true }, sort_order: 8, is_active: true },
    { id: 'cta', name: 'Call to Action', description: 'CTA banner', icon: 'megaphone', category: 'conversion', default_content: { title: 'Harekete Gecin', buttonText: 'Randevu Al', buttonLink: '#', backgroundColor: 'sage' }, sort_order: 9, is_active: true },
    { id: 'faq', name: 'SSS', description: 'FAQ accordion', icon: 'question-mark-circle', category: 'content', default_content: { title: 'SSS', items: [] }, sort_order: 10, is_active: true },
    { id: 'video', name: 'Video', description: 'Video embed', icon: 'play', category: 'media', default_content: { title: 'Video', videoUrl: '' }, sort_order: 11, is_active: true },
    { id: 'team', name: 'Ekip', description: 'Team members', icon: 'users', category: 'content', default_content: { title: 'Ekibimiz', members: [] }, sort_order: 12, is_active: true },
    { id: 'stats', name: 'Istatistikler', description: 'Stats', icon: 'chart-bar', category: 'content', default_content: { stats: [{ value: '100+', label: 'Mutlu Musteri' }] }, sort_order: 13, is_active: true },
    { id: 'divider', name: 'Ayirici', description: 'Spacer', icon: 'minus', category: 'layout', default_content: { height: 60, showLine: false }, sort_order: 14, is_active: true },
  ]

  const { error: btError } = await supabase.from('block_types').upsert(blockTypes, { onConflict: 'id' })
  if (btError) {
    console.log('   ✗ Error:', btError.message)
  } else {
    console.log('   ✓ 14 block types inserted')
  }

  // 3. Create sample page
  console.log('\n3. Creating sample page...')
  const { data: page, error: pageError } = await supabase
    .from('pages')
    .upsert({
      slug: 'masaj-terapi',
      title: 'Masaj Terapi',
      status: 'published',
      template: 'service',
      meta_title: 'Masaj Terapi | Wellnesstal',
      meta_description: 'Profesyonel masaj terapi hizmetleri'
    }, { onConflict: 'slug' })
    .select()
    .single()

  if (pageError) {
    console.log('   ✗ Error:', pageError.message)
  } else {
    console.log('   ✓ Page created:', page.slug)

    // 4. Add blocks to page
    console.log('\n4. Adding blocks to page...')

    // Delete existing blocks for this page
    await supabase.from('page_blocks').delete().eq('page_id', page.id)

    const blocks = [
      {
        page_id: page.id,
        block_type: 'hero',
        content: {
          title: 'Masaj Terapi',
          subtitle: 'Profesyonel masaj hizmetleri ile kendinizi yenileyin',
          image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200',
          ctaText: 'Randevu Al',
          ctaLink: 'tel:+4922112345678',
          backgroundType: 'image'
        },
        position: 0,
        visible: true
      },
      {
        page_id: page.id,
        block_type: 'text',
        content: {
          title: 'Masaj Terapinin Faydalari',
          content: 'Masaj terapi, kas gerginligini azaltir, kan dolasimini iyilestirir ve stres seviyelerini dusurur.',
          alignment: 'center'
        },
        position: 1,
        visible: true
      },
      {
        page_id: page.id,
        block_type: 'features',
        content: {
          title: 'Neden Bizi Secmelisiniz?',
          features: [
            { title: 'Uzman Terapistler', description: 'Sertifikali ve deneyimli ekip', icon: 'star' },
            { title: 'Dogal Urunler', description: 'Organik yaglar ve kremler', icon: 'leaf' },
            { title: 'Rahat Ortam', description: 'Huzurlu ve hijyenik mekan', icon: 'home' },
            { title: 'Esnek Saatler', description: 'Size uygun randevu imkani', icon: 'clock' }
          ]
        },
        position: 2,
        visible: true
      },
      {
        page_id: page.id,
        block_type: 'cta',
        content: {
          title: 'Hemen Randevu Alin',
          subtitle: 'Ilk seansınızda %20 indirim firsati',
          buttonText: 'Randevu Al',
          buttonLink: 'tel:+4922112345678',
          backgroundColor: 'sage'
        },
        position: 3,
        visible: true
      }
    ]

    const { error: blocksError } = await supabase.from('page_blocks').insert(blocks)
    if (blocksError) {
      console.log('   ✗ Error:', blocksError.message)
    } else {
      console.log('   ✓ 4 blocks added')
    }
  }

  console.log('\n✅ Setup complete!')
  console.log('\nTest: http://localhost:3000/masaj-terapi')
  console.log('Admin: http://localhost:3000/admin/pages')
}

setup().catch(console.error)
