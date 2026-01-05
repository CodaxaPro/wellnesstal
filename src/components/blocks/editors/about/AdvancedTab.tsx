'use client'

import { AboutContent } from '../../types'

interface AdvancedTabProps {
  content: AboutContent
  updateContent: (updates: Partial<AboutContent>) => void
}

export default function AdvancedTab({ content, updateContent }: AdvancedTabProps) {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Gelişmiş Ayarlar</h3>
        <p className="text-sm text-slate-500">Şu an için gelişmiş ayar yok. Gelecek güncellemelerde eklenecek.</p>
      </div>
    </div>
  )
}

