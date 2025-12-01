'use client'

import React, { useState, useEffect, use, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import { PageBlock, HeroContent, FeaturesContent, TextContent, CTAContent, PricingContent, FAQContent, TeamContent, WhatsAppContent, GalleryContent } from '@/components/blocks/types'
import HeroBlockEditor from '@/components/blocks/editors/HeroBlockEditor'
import FeaturesBlockEditor from '@/components/blocks/editors/FeaturesBlockEditor'
import TextBlockEditor from '@/components/blocks/editors/TextBlockEditor'
import CTABlockEditor from '@/components/blocks/editors/CTABlockEditor'
import PricingBlockEditor from '@/components/blocks/editors/PricingBlockEditor'
import FAQBlockEditor from '@/components/blocks/editors/FAQBlockEditor'
import TeamBlockEditor from '@/components/blocks/editors/TeamBlockEditor'
import WhatsAppBlockEditor from '@/components/blocks/editors/WhatsAppBlockEditor'
import GalleryBlockEditor from '@/components/blocks/editors/GalleryBlockEditor'

interface PageData {
  id: string
  slug: string
  title: string
  status: 'draft' | 'published' | 'archived'
  template: string
  meta_title?: string
  meta_description?: string
  blocks: PageBlock[]
}

interface BlockType {
  id: string
  name: string
  description: string
  icon: string
  category: string
  default_content: Record<string, any>
}

export default function PageEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [page, setPage] = useState<PageData | null>(null)
  const [blockTypes, setBlockTypes] = useState<BlockType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [showBlockLibrary, setShowBlockLibrary] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    fetchPage()
    fetchBlockTypes()
  }, [id])

  const fetchPage = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/pages?id=${id}&withBlocks=true`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setPage(data.data)
      } else {
        router.push('/admin/pages')
      }
    } catch (error) {
      console.error('Failed to fetch page:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBlockTypes = async () => {
    try {
      const response = await fetch('/api/pages/blocks?types=true')
      if (response.ok) {
        const data = await response.json()
        setBlockTypes(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch block types:', error)
    }
  }

  const handleAddBlock = async (blockType: string) => {
    if (!page) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/pages/blocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          page_id: page.id,
          block_type: blockType
        })
      })

      if (response.ok) {
        const data = await response.json()
        setPage(prev => prev ? {
          ...prev,
          blocks: [...prev.blocks, data.data]
        } : null)
        setShowBlockLibrary(false)
        setActiveBlockId(data.data.id)
      }
    } catch (error) {
      alert('Blok eklenirken hata oluştu')
    }
  }

  const handleUpdateBlock = async (blockId: string, content: Record<string, any>) => {
    try {
      const token = localStorage.getItem('adminToken')
      await fetch('/api/pages/blocks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: blockId, content })
      })

      setPage(prev => prev ? {
        ...prev,
        blocks: prev.blocks.map(b => b.id === blockId ? { ...b, content } : b)
      } : null)
    } catch (error) {
      console.error('Failed to update block:', error)
    }
  }

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('Bu bloğu silmek istediğinizden emin misiniz?')) return

    try {
      const token = localStorage.getItem('adminToken')
      await fetch(`/api/pages/blocks?id=${blockId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      setPage(prev => prev ? {
        ...prev,
        blocks: prev.blocks.filter(b => b.id !== blockId)
      } : null)
      setActiveBlockId(null)
    } catch (error) {
      alert('Blok silinirken hata oluştu')
    }
  }

  const handleMoveBlock = async (blockId: string, direction: 'up' | 'down') => {
    if (!page) return

    const currentIndex = page.blocks.findIndex(b => b.id === blockId)
    if (currentIndex === -1) return
    if (direction === 'up' && currentIndex === 0) return
    if (direction === 'down' && currentIndex === page.blocks.length - 1) return

    const newBlocks = [...page.blocks]
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    ;[newBlocks[currentIndex], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[currentIndex]]

    // Update positions
    const reorderedBlocks = newBlocks.map((block, index) => ({
      ...block,
      position: index
    }))

    setPage(prev => prev ? { ...prev, blocks: reorderedBlocks } : null)

    // Save to server
    try {
      const token = localStorage.getItem('adminToken')
      await fetch('/api/pages/blocks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reorder: true,
          blocks: reorderedBlocks.map(b => ({ id: b.id, position: b.position }))
        })
      })
    } catch (error) {
      console.error('Failed to reorder blocks:', error)
    }
  }

  const handleToggleBlockVisibility = async (blockId: string) => {
    const block = page?.blocks.find(b => b.id === blockId)
    if (!block) return

    try {
      const token = localStorage.getItem('adminToken')
      await fetch('/api/pages/blocks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: blockId, visible: !block.visible })
      })

      setPage(prev => prev ? {
        ...prev,
        blocks: prev.blocks.map(b => b.id === blockId ? { ...b, visible: !b.visible } : b)
      } : null)
    } catch (error) {
      console.error('Failed to toggle visibility:', error)
    }
  }

  const handlePublish = async () => {
    if (!page) return
    setSaving(true)

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/pages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: page.id,
          status: page.status === 'published' ? 'draft' : 'published'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setPage(prev => prev ? { ...prev, status: data.data.status } : null)
      }
    } catch (error) {
      alert('Durum güncellenirken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const activeBlock = page?.blocks.find(b => b.id === activeBlockId)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500"></div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Sayfa bulunamadı</p>
      </div>
    )
  }

  // Group block types by category
  const blocksByCategory = blockTypes.reduce((acc, block) => {
    const cat = block.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(block)
    return acc
  }, {} as Record<string, BlockType[]>)

  const categoryNames: Record<string, string> = {
    header: 'Başlık',
    content: 'İçerik',
    media: 'Medya',
    forms: 'Formlar',
    social: 'Sosyal',
    conversion: 'Dönüşüm',
    layout: 'Düzen',
    other: 'Diğer'
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Left Sidebar - Block List */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <Link
            href="/admin/pages"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-3"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Sayfalara Dön
          </Link>
          <h1 className="font-semibold text-slate-800 truncate">{page.title}</h1>
          <p className="text-xs text-slate-400 mt-1">/{page.slug}</p>
        </div>

        {/* Blocks List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-slate-600">Bloklar</h2>
            <span className="text-xs text-slate-400">{page.blocks.length}</span>
          </div>

          {page.blocks.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <p className="text-sm text-slate-500 mb-4">Henüz blok yok</p>
            </div>
          ) : (
            <div className="space-y-2">
              {page.blocks.map((block, index) => (
                <div
                  key={block.id}
                  className={`group p-3 rounded-xl border cursor-pointer transition-all ${
                    activeBlockId === block.id
                      ? 'border-sage-500 bg-sage-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  } ${!block.visible ? 'opacity-50' : ''}`}
                  onClick={() => setActiveBlockId(block.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMoveBlock(block.id, 'up') }}
                        disabled={index === 0}
                        className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMoveBlock(block.id, 'down') }}
                        disabled={index === page.blocks.length - 1}
                        className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 capitalize">
                        {block.block_type}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {block.content.title || 'İçerik'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleBlockVisibility(block.id) }}
                        className="p-1 text-slate-400 hover:text-slate-600"
                        title={block.visible ? 'Gizle' : 'Göster'}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {block.visible ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          )}
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id) }}
                        className="p-1 text-slate-400 hover:text-red-600"
                        title="Sil"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowBlockLibrary(true)}
            className="w-full mt-4 py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-sage-500 hover:text-sage-600 hover:bg-sage-50 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Blok Ekle
          </button>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          <button
            onClick={() => setShowPreview(true)}
            className="w-full py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Önizle
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className={`w-full py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
              page.status === 'published'
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-forest-600 text-white'
            }`}
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : page.status === 'published' ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Yayından Kaldır
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Yayınla
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content - Block Editor */}
      <main className="flex-1 overflow-y-auto">
        {activeBlock ? (
          <div className="p-6">
            <div className={`mx-auto ${activeBlock.block_type === 'hero' || activeBlock.block_type === 'features' || activeBlock.block_type === 'cta' || activeBlock.block_type === 'pricing' || activeBlock.block_type === 'faq' || activeBlock.block_type === 'team' || activeBlock.block_type === 'whatsapp' || activeBlock.block_type === 'gallery' ? 'max-w-5xl' : 'max-w-3xl'}`}>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activeBlock.block_type === 'hero' || activeBlock.block_type === 'features' || activeBlock.block_type === 'cta' || activeBlock.block_type === 'pricing' || activeBlock.block_type === 'faq' || activeBlock.block_type === 'team' || activeBlock.block_type === 'whatsapp' || activeBlock.block_type === 'gallery' ? 'bg-gradient-to-br from-sage-400 to-forest-500' : 'bg-slate-100'
                    }`}>
                      <span className="text-lg">
                        {activeBlock.block_type === 'hero' ? '🎯' : activeBlock.block_type === 'features' ? '⭐' : activeBlock.block_type === 'cta' ? '📢' : activeBlock.block_type === 'pricing' ? '💰' : activeBlock.block_type === 'faq' ? '❓' : activeBlock.block_type === 'team' ? '👥' : activeBlock.block_type === 'whatsapp' ? '💬' : activeBlock.block_type === 'gallery' ? '🖼️' : '📝'}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-800 capitalize">
                        {activeBlock.block_type === 'hero' ? 'Hero Bölümü Editörü' : activeBlock.block_type === 'features' ? 'Özellikler Editörü' : activeBlock.block_type === 'cta' ? 'CTA Bölümü Editörü' : activeBlock.block_type === 'pricing' ? 'Fiyatlandırma Editörü' : activeBlock.block_type === 'faq' ? 'FAQ Editörü' : activeBlock.block_type === 'team' ? 'Ekip Editörü' : activeBlock.block_type === 'whatsapp' ? 'WhatsApp Editörü' : activeBlock.block_type === 'gallery' ? 'Galeri Editörü' : `${activeBlock.block_type} Bloğu Düzenle`}
                      </h2>
                      {(activeBlock.block_type === 'hero' || activeBlock.block_type === 'features' || activeBlock.block_type === 'cta' || activeBlock.block_type === 'pricing' || activeBlock.block_type === 'faq' || activeBlock.block_type === 'team' || activeBlock.block_type === 'whatsapp' || activeBlock.block_type === 'gallery') && (
                        <p className="text-xs text-slate-500">Enterprise düzenleme modu</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveBlockId(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className={`${activeBlock.block_type === 'hero' || activeBlock.block_type === 'features' || activeBlock.block_type === 'cta' || activeBlock.block_type === 'pricing' || activeBlock.block_type === 'faq' || activeBlock.block_type === 'team' || activeBlock.block_type === 'whatsapp' || activeBlock.block_type === 'gallery' ? 'p-4' : 'p-6'}`}>
                  <BlockEditorForm
                    block={activeBlock}
                    onUpdate={(content) => handleUpdateBlock(activeBlock.id, content)}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Düzenlemek için bir blok seçin
              </h3>
              <p className="text-slate-500 mb-6">
                Sol taraftan bir blok seçin veya yeni blok ekleyin
              </p>
              <button
                onClick={() => setShowBlockLibrary(true)}
                className="inline-flex items-center gap-2 bg-sage-500 hover:bg-forest-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Blok Ekle
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Block Library Modal */}
      {showBlockLibrary && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">Blok Kütüphanesi</h2>
              <button
                onClick={() => setShowBlockLibrary(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {Object.entries(blocksByCategory).map(([category, blocks]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-sm font-medium text-slate-500 mb-3">
                    {categoryNames[category] || category}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {blocks.map((block) => (
                      <button
                        key={block.id}
                        onClick={() => handleAddBlock(block.id)}
                        className="p-4 border border-slate-200 rounded-xl hover:border-sage-500 hover:bg-sage-50 transition-all text-left group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-slate-100 group-hover:bg-sage-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-slate-500 group-hover:text-sage-600 text-lg">
                              {block.icon === 'photo' && '🖼'}
                              {block.icon === 'align-left' && '📝'}
                              {block.icon === 'grid-3x3' && '⬚'}
                              {block.icon === 'images' && '🖼️'}
                              {block.icon === 'briefcase' && '💼'}
                              {block.icon === 'currency-euro' && '💰'}
                              {block.icon === 'chat-bubble' && '💬'}
                              {block.icon === 'envelope' && '✉️'}
                              {block.icon === 'megaphone' && '📢'}
                              {block.icon === 'question-mark-circle' && '❓'}
                              {block.icon === 'play' && '▶️'}
                              {block.icon === 'users' && '👥'}
                              {block.icon === 'chart-bar' && '📊'}
                              {block.icon === 'minus' && '➖'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 group-hover:text-sage-700">
                              {block.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                              {block.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">Önizleme:</span>
              <span className="font-medium text-slate-800">{page.title}</span>
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto bg-white">
            <BlockRenderer blocks={page.blocks} />
          </div>
        </div>
      )}
    </div>
  )
}

// Block Editor Form Component
function BlockEditorForm({
  block,
  onUpdate
}: {
  block: PageBlock
  onUpdate: (content: Record<string, any>) => void
}) {
  const [content, setContent] = useState(block.content)
  const blockIdRef = useRef(block.id)

  // Only reset content when block ID changes (switching blocks), not on content updates
  useEffect(() => {
    if (blockIdRef.current !== block.id) {
      blockIdRef.current = block.id
      setContent(block.content)
    }
  }, [block.id, block.content])

  const handleChange = (key: string, value: any) => {
    const newContent = { ...content, [key]: value }
    setContent(newContent)
    onUpdate(newContent)
  }

  // Render different form fields based on block type
  const renderFields = () => {
    switch (block.block_type) {
      case 'hero':
        // HeroBlockEditor manages its own state with debouncing
        return (
          <HeroBlockEditor
            content={content as HeroContent}
            onUpdate={onUpdate}
          />
        )

      case 'features':
        // FeaturesBlockEditor manages its own state with debouncing
        return (
          <FeaturesBlockEditor
            content={content as FeaturesContent}
            onUpdate={onUpdate}
          />
        )

      case 'text':
        // TextBlockEditor manages its own state with debouncing
        return (
          <TextBlockEditor
            content={content as TextContent}
            onUpdate={onUpdate}
          />
        )

      case 'cta':
        // CTABlockEditor manages its own state with debouncing
        return (
          <CTABlockEditor
            content={content as CTAContent}
            onUpdate={onUpdate}
          />
        )

      case 'pricing':
        // PricingBlockEditor manages its own state with debouncing
        return (
          <PricingBlockEditor
            content={content as PricingContent}
            onChange={onUpdate}
          />
        )

      case 'faq':
        // FAQBlockEditor manages its own state with debouncing
        return (
          <FAQBlockEditor
            content={content as unknown as Record<string, unknown>}
            onUpdate={onUpdate}
          />
        )

      case 'team':
        // TeamBlockEditor manages its own state with debouncing
        return (
          <TeamBlockEditor
            content={content as unknown as Record<string, unknown>}
            onUpdate={onUpdate}
          />
        )

      case 'whatsapp':
        // WhatsAppBlockEditor manages its own state with debouncing
        return (
          <WhatsAppBlockEditor
            content={content as unknown as Record<string, unknown>}
            onUpdate={onUpdate}
          />
        )

      case 'gallery':
        // GalleryBlockEditor manages its own state with debouncing
        return (
          <GalleryBlockEditor
            content={content as unknown as Record<string, unknown>}
            onUpdate={onUpdate}
          />
        )

      default:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Başlık</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              />
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500">
                Bu blok tipi için gelişmiş düzenleme yakında eklenecek.
              </p>
              <pre className="mt-2 text-xs text-slate-400 overflow-auto">
                {JSON.stringify(content, null, 2)}
              </pre>
            </div>
          </div>
        )
    }
  }

  return renderFields()
}
