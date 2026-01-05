#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

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

async function fixHeroBadge() {
  const envVars = loadEnvFile()
  if (!envVars) return
  
  const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'])
  
  const { data: page } = await supabase.from('pages').select('id').eq('slug', 'headspa').single()
  const { data: heroBlock } = await supabase.from('page_blocks').select('*').eq('page_id', page.id).eq('block_type', 'hero').single()
  
  const newBadge = "Ab dem 15.01.2026 finden alle Headspa-Termine in unserem neuen Wellnesstal-Studio unter der Adresse Reyplatz 10, 52499 Baesweiler statt. Wir freuen uns darauf, Sie in unserer neuen und beruhigenden Atmosphäre begrüßen zu dürfen."
  
  const { error } = await supabase
    .from('page_blocks')
    .update({ 
      content: { 
        ...heroBlock.content, 
        badge: newBadge,
        badgeEnabled: true
      }
    })
    .eq('id', heroBlock.id)
  
  if (error) {
    console.error('Error:', error.message)
  } else {
    console.log('✅ Hero badge güncellendi!')
  }
}

fixHeroBadge().catch(console.error)

