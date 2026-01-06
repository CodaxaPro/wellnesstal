import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const CORRECT_PHONE = '+49 1733828581'
const CORRECT_EMAIL = 'info@wellnesstal.de'
const CORRECT_ADDRESS = {
  street: 'Reyplatz 10',
  city: 'Baesweiler',
  postalCode: '52499'
}

const phonePatterns = [
  /\+49\s*221\s*12345678/g,
  /\+4922112345678/g,
  /tel:\+4922112345678/g,
  /\+49\s*221\s*12345678/g,
  /\+49123456789/g,
  /tel:\+49123456789/g,
]

const emailPatterns = [
  /info@example\.com/g,
  /example@example\.com/g,
]

const addressPatterns = [
  /Musterstraße\s*\d+/gi,
  /Musterstrasse\s*\d+/gi,
  /Köln/gi,
  /50667/g,
]

function getAllFiles(dir, fileList = []) {
  const files = readdirSync(dir)
  
  files.forEach(file => {
    const filePath = join(dir, file)
    const stat = statSync(filePath)
    
    if (stat.isDirectory()) {
      // Skip node_modules, .next, .git, etc.
      if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(file)) {
        getAllFiles(filePath, fileList)
      }
    } else {
      const ext = extname(file)
      if (['.ts', '.tsx', '.js', '.jsx', '.json', '.md'].includes(ext)) {
        fileList.push(filePath)
      }
    }
  })
  
  return fileList
}

function findPatterns(content, patterns, type) {
  const matches = []
  patterns.forEach(pattern => {
    const found = content.match(pattern)
    if (found) {
      found.forEach(match => {
        matches.push({
          type,
          match,
          pattern: pattern.toString()
        })
      })
    }
  })
  return matches
}

function scanFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const issues = []
    
    // Check phone numbers
    const phoneMatches = findPatterns(content, phonePatterns, 'phone')
    if (phoneMatches.length > 0) {
      issues.push(...phoneMatches.map(m => ({ ...m, file: filePath })))
    }
    
    // Check emails
    const emailMatches = findPatterns(content, emailPatterns, 'email')
    if (emailMatches.length > 0) {
      issues.push(...emailMatches.map(m => ({ ...m, file: filePath })))
    }
    
    // Check addresses
    const addressMatches = findPatterns(content, addressPatterns, 'address')
    if (addressMatches.length > 0) {
      issues.push(...addressMatches.map(m => ({ ...m, file: filePath })))
    }
    
    return issues
  } catch (error) {
    return []
  }
}

console.log('🔍 Tüm Sayfalarda İletişim Bilgileri Kontrolü\n')
console.log('='.repeat(70))
console.log(`✅ Doğru Bilgiler:`)
console.log(`   Telefon: ${CORRECT_PHONE}`)
console.log(`   Email: ${CORRECT_EMAIL}`)
console.log(`   Adres: ${CORRECT_ADDRESS.street}, ${CORRECT_ADDRESS.postalCode} ${CORRECT_ADDRESS.city}`)
console.log('\n' + '='.repeat(70))
console.log('\n🔎 Farklı Bilgiler Aranıyor...\n')

const srcDir = join(process.cwd(), 'src')
const files = getAllFiles(srcDir)
const allIssues = []

files.forEach(file => {
  const issues = scanFile(file)
  if (issues.length > 0) {
    allIssues.push(...issues)
  }
})

// Group by type
const phoneIssues = allIssues.filter(i => i.type === 'phone')
const emailIssues = allIssues.filter(i => i.type === 'email')
const addressIssues = allIssues.filter(i => i.type === 'address')

console.log(`📊 Bulunan Sorunlar:\n`)
console.log(`   Telefon: ${phoneIssues.length} adet`)
console.log(`   Email: ${emailIssues.length} adet`)
console.log(`   Adres: ${addressIssues.length} adet`)
console.log(`   Toplam: ${allIssues.length} adet\n`)

if (phoneIssues.length > 0) {
  console.log('📞 FARKLI TELEFON NUMARALARI:\n')
  const uniquePhones = [...new Set(phoneIssues.map(i => i.match))]
  uniquePhones.forEach(phone => {
    console.log(`   ❌ ${phone}`)
    const files = phoneIssues.filter(i => i.match === phone).map(i => i.file.replace(process.cwd() + '/', ''))
    const uniqueFiles = [...new Set(files)]
    uniqueFiles.slice(0, 5).forEach(file => {
      console.log(`      - ${file}`)
    })
    if (uniqueFiles.length > 5) {
      console.log(`      ... ve ${uniqueFiles.length - 5} dosya daha`)
    }
    console.log()
  })
}

if (emailIssues.length > 0) {
  console.log('📧 FARKLI EMAIL ADRESLERİ:\n')
  const uniqueEmails = [...new Set(emailIssues.map(i => i.match))]
  uniqueEmails.forEach(email => {
    console.log(`   ❌ ${email}`)
    const files = emailIssues.filter(i => i.match === email).map(i => i.file.replace(process.cwd() + '/', ''))
    const uniqueFiles = [...new Set(files)]
    uniqueFiles.slice(0, 5).forEach(file => {
      console.log(`      - ${file}`)
    })
    if (uniqueFiles.length > 5) {
      console.log(`      ... ve ${uniqueFiles.length - 5} dosya daha`)
    }
    console.log()
  })
}

if (addressIssues.length > 0) {
  console.log('📍 FARKLI ADRES BİLGİLERİ:\n')
  const uniqueAddresses = [...new Set(addressIssues.map(i => i.match))]
  uniqueAddresses.forEach(address => {
    console.log(`   ❌ ${address}`)
    const files = addressIssues.filter(i => i.match === address).map(i => i.file.replace(process.cwd() + '/', ''))
    const uniqueFiles = [...new Set(files)]
    uniqueFiles.slice(0, 5).forEach(file => {
      console.log(`      - ${file}`)
    })
    if (uniqueFiles.length > 5) {
      console.log(`      ... ve ${uniqueFiles.length - 5} dosya daha`)
    }
    console.log()
  })
}

if (allIssues.length === 0) {
  console.log('✅ Harika! Tüm iletişim bilgileri doğru görünüyor.\n')
} else {
  console.log('\n' + '='.repeat(70))
  console.log('\n💡 Öneri:')
  console.log('   Bu dosyalardaki placeholder/default değerleri güncelleyin.')
  console.log('   Tüm telefon numaralarını: ' + CORRECT_PHONE)
  console.log('   Tüm email adreslerini: ' + CORRECT_EMAIL)
  console.log('   Tüm adresleri: ' + CORRECT_ADDRESS.street + ', ' + CORRECT_ADDRESS.postalCode + ' ' + CORRECT_ADDRESS.city)
  console.log('   olarak değiştirin.\n')
}

