import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, process.env['JWT_SECRET'] || 'fallback-secret')
  } catch {
    return null
  }
}

// POST /api/pages/migrate-active - Run migration to add active field
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // eslint-disable-next-line no-console
    console.log('🚀 Running migration: Add active field to pages table')

    // First, check if column already exists
    const { error: testError, data: testData } = await supabase
      .from('pages')
      .select('id, title, active')
      .limit(1)

    if (!testError && testData) {
      // Column exists
      return NextResponse.json({
        success: true,
        message: 'Active column already exists',
        data: testData[0]
      })
    }

    // Column doesn't exist - need to add it
    // Migration SQL statements
    const migrationStatements = [
      'ALTER TABLE pages ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;',
      'CREATE INDEX IF NOT EXISTS idx_pages_active ON pages(active);',
      'UPDATE pages SET active = TRUE WHERE active IS NULL;'
    ]

    const migrationSQL = migrationStatements.join('\n\n')

    // Extract project ref for dashboard URL
    const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'] || ''
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || ''

    // Since we can't execute DDL via Supabase REST API directly,
    // we return instructions with the SQL
    return NextResponse.json({
      success: false,
      error: 'Migration requires manual execution',
      message: 'The active column does not exist. Please run the migration manually in Supabase Dashboard.',
      sql: migrationSQL,
      statements: migrationStatements,
      instructions: [
        '1. Go to Supabase Dashboard > SQL Editor',
        '2. Click "New Query"',
        '3. Paste the SQL from the "sql" field below',
        '4. Click "Run"',
        '5. Refresh this page after migration completes'
      ],
      dashboardUrl: `https://app.supabase.com/project/${projectRef}/sql/new`
    }, { status: 400 })

  } catch (error: unknown) {
    const errorObj = error instanceof Error ? error : { message: 'Migration failed', stack: undefined }
    console.error('Migration error:', errorObj.message)
    return NextResponse.json(
      {
        success: false,
        error: errorObj.message || 'Migration failed',
        details: process.env['NODE_ENV'] === 'development' ? errorObj.stack : undefined
      },
      { status: 500 }
    )
  }
}
