#!/usr/bin/env node

/**
 * Upload Local Images to Supabase Storage
 * 
 * public/uploads/ klasöründeki resimleri Supabase Storage'a yükler
 * ve database'deki URL'leri günceller
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env.local') })

const PRODUCTION_DOMAIN = 'https://wellnesstal.de'
const STORAGE_BUCKET = 'wellnesstal'

async function uploadImagesToSupabase() {
  console.log('🚀 Resimleri Supabase Storage\'a Yükleme\n')
  console.log('=' .repeat(60))
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL veya Key bulunamadı!')
    process.exit(1)
  }
  
  console.log(`✅ Supabase URL: ${supabaseUrl}`)
  console.log(`✅ Storage Bucket: ${STORAGE_BUCKET}\n`)
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Uploads klasörünü oku
  const uploadsDir = join(__dirname, 'public', 'uploads')
  
  try {
    const folders = readdirSync(uploadsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    console.log(`📁 Bulunan klasörler: ${folders.join(', ')}\n`)
    
    const imagesToUpload = []
    
    for (const folder of folders) {
      const folderPath = join(uploadsDir, folder)
      const files = readdirSync(folderPath)
        .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
      
      for (const file of files) {
        const filePath = join(folderPath, file)
        const stats = statSync(filePath)
        
        imagesToUpload.push({
          localPath: filePath,
          storagePath: `uploads/${folder}/${file}`,
          folder,
          file,
          size: stats.size
        })
      }
    }
    
    console.log(`📊 Toplam ${imagesToUpload.length} resim bulundu\n`)
    
    if (imagesToUpload.length === 0) {
      console.log('⚠️  Yüklenecek resim bulunamadı')
      return
    }
    
    // Storage bucket'ının var olduğundan emin ol
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Bucket\'lar alınamadı:', bucketsError.message)
      process.exit(1)
    }
    
    const bucketExists = buckets?.some(b => b.name === STORAGE_BUCKET)
    
    if (!bucketExists) {
      console.log(`📦 Bucket '${STORAGE_BUCKET}' oluşturuluyor...`)
      const { error: createError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      })
      
      if (createError) {
        console.error('❌ Bucket oluşturulamadı:', createError.message)
        process.exit(1)
      }
      
      console.log('✅ Bucket oluşturuldu\n')
    }
    
    // Resimleri yükle
    console.log('📤 Resimler yükleniyor...\n')
    
    const uploadResults = []
    
    for (const image of imagesToUpload) {
      try {
        // Dosyayı oku
        const fileBuffer = readFileSync(image.localPath)
        
        // MIME type belirle
        const ext = image.file.split('.').pop()?.toLowerCase() || 'jpg'
        const mimeTypes = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'webp': 'image/webp',
          'gif': 'image/gif'
        }
        const contentType = mimeTypes[ext] || 'image/jpeg'
        
        // Storage'a yükle
        const { data, error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(image.storagePath, fileBuffer, {
            contentType: contentType,
            upsert: true, // Varsa üzerine yaz
            cacheControl: '3600'
          })
        
        if (error) {
          console.error(`❌ ${image.file}: ${error.message}`)
          uploadResults.push({ ...image, success: false, error: error.message })
        } else {
          // Public URL al
          const { data: { publicUrl } } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(image.storagePath)
          
          uploadResults.push({
            ...image,
            success: true,
            publicUrl
          })
          
          console.log(`✅ ${image.file} -> ${publicUrl}`)
        }
      } catch (error) {
        console.error(`❌ ${image.file}: ${error.message}`)
        uploadResults.push({ ...image, success: false, error: error.message })
      }
    }
    
    // Database'deki URL'leri güncelle
    console.log('\n🔄 Database URL\'leri güncelleniyor...\n')
    
    const { data: blocks, error: blocksError } = await supabase
      .from('page_blocks')
      .select('id, block_type, content')
    
    if (blocksError) {
      console.error('❌ Block\'lar alınamadı:', blocksError.message)
      return
    }
    
    let updatedBlocks = 0
    
    for (const block of blocks || []) {
      const content = typeof block.content === 'string' 
        ? JSON.parse(block.content) 
        : block.content
      
      const contentStr = JSON.stringify(content)
      let updated = false
      let newContent = { ...content }
      
      // Her yüklenen resim için URL'yi güncelle
      for (const result of uploadResults.filter(r => r.success)) {
        const oldUrl = `/uploads/${result.folder}/${result.file}`
        const newUrl = result.publicUrl
        
        // Eğer content'te bu URL varsa, güncelle
        if (contentStr.includes(oldUrl) || contentStr.includes(`localhost:3001${oldUrl}`) || contentStr.includes(`wellnesstal.de${oldUrl}`)) {
          // JSON içinde URL'yi değiştir
          const updatedStr = JSON.stringify(newContent)
            .replace(new RegExp(`http://localhost:3001${oldUrl}`, 'g'), newUrl)
            .replace(new RegExp(`https://wellnesstal.de${oldUrl}`, 'g'), newUrl)
            .replace(new RegExp(oldUrl, 'g'), newUrl)
          
          newContent = JSON.parse(updatedStr)
          updated = true
        }
      }
      
      if (updated) {
        const { error: updateError } = await supabase
          .from('page_blocks')
          .update({ 
            content: newContent,
            updated_at: new Date().toISOString()
          })
          .eq('id', block.id)
        
        if (updateError) {
          console.error(`❌ Block ${block.id} güncellenemedi:`, updateError.message)
        } else {
          updatedBlocks++
          console.log(`✅ Block ${block.id} (${block.block_type}) güncellendi`)
        }
      }
    }
    
    console.log('\n' + '=' .repeat(60))
    console.log('📊 ÖZET')
    console.log('=' .repeat(60))
    const successCount = uploadResults.filter(r => r.success).length
    const failCount = uploadResults.filter(r => !r.success).length
    console.log(`✅ Başarılı yüklemeler: ${successCount}`)
    console.log(`❌ Başarısız yüklemeler: ${failCount}`)
    console.log(`🔄 Güncellenen block'lar: ${updatedBlocks}`)
    console.log('\n✅ İşlem tamamlandı!')
    
  } catch (error) {
    console.error('❌ Hata:', error.message)
    process.exit(1)
  }
}

uploadImagesToSupabase().catch(console.error)

