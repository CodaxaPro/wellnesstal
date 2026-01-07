'use client'

import React, { useState, useEffect, use, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import { PageBlock, HeroContent, FeaturesContent, TextContent, CTAContent, PricingContent, FAQContent, TeamContent, WhatsAppContent, GalleryContent, EmbedContent, HeaderContent, FooterContent, ServicesContent, TestimonialsContent, VideoContent, StatsContent, DividerContent } from '@/components/blocks/types'
import HeroBlockEditor from '@/components/blocks/editors/HeroBlockEditor'
import FeaturesBlockEditor from '@/components/blocks/editors/FeaturesBlockEditor'
import TextBlockEditor from '@/components/blocks/editors/TextBlockEditor'
import CTABlockEditor from '@/components/blocks/editors/CTABlockEditor'
import PricingBlockEditor from '@/components/blocks/editors/PricingBlockEditor'
import FAQBlockEditor from '@/components/blocks/editors/FAQBlockEditor'
import TeamBlockEditor from '@/components/blocks/editors/TeamBlockEditor'
import WhatsAppBlockEditor from '@/components/blocks/editors/WhatsAppBlockEditor'
import GalleryBlockEditor from '@/components/blocks/editors/GalleryBlockEditor'
import EmbedBlockEditor from '@/components/blocks/editors/EmbedBlockEditor'
import HeaderBlockEditor from '@/components/blocks/editors/HeaderBlockEditor'
import FooterBlockEditor from '@/components/blocks/editors/FooterBlockEditor'
import ContactBlockEditor from '@/components/blocks/editors/ContactBlockEditor'
import SEOBlockEditor from '@/components/blocks/editors/SEOBlockEditor'
import ServicesBlockEditor from '@/components/blocks/editors/ServicesBlockEditor'
import TestimonialsBlockEditor from '@/components/blocks/editors/TestimonialsBlockEditor'
import VideoBlockEditor from '@/components/blocks/editors/VideoBlockEditor'
import StatsBlockEditor from '@/components/blocks/editors/StatsBlockEditor'
import DividerBlockEditor from '@/components/blocks/editors/DividerBlockEditor'
import StickyButtonBlockEditor from '@/components/blocks/editors/StickyButtonBlockEditor'
import AboutBlockEditor from '@/components/blocks/editors/AboutBlockEditor'
import { ContactBlockContent } from '@/components/blocks/ContactBlock'
import { SEOContent, AboutContent } from '@/components/blocks/types'

interface PageCategory {
  id: string
  name: string
  slug: string
  color: string
  icon: string
}

interface PageData {
  id: string
  slug: string
  title: string
  status: 'draft' | 'published' | 'archived'
  template: string
  meta_title?: string
  meta_description?: string
  category_id?: string
  page_categories?: PageCategory
  active?: boolean
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
  const [categories, setCategories] = useState<PageCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [showBlockLibrary, setShowBlockLibrary] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [editingSlug, setEditingSlug] = useState(false)
  const [slugValue, setSlugValue] = useState('')

  useEffect(() => {
    fetchPage()
    fetchBlockTypes()
    fetchCategories()
  }, [id])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/pages/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchPage = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/pages?id=${id}&withBlocks=true`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setPage(data.data)
        setSlugValue(data.data.slug || '')
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
    if (!page) {
      toast.error('Sayfa yüklenemedi. Lütfen sayfayı yenileyin.')
      return
    }

    const token = localStorage.getItem('adminToken')
    if (!token) {
      toast.error('Yetkilendirme eksik: giriş yapın ve tekrar deneyin')
      return
    }

    try {
      console.log('[handleAddBlock] Adding block:', { page_id: page.id, block_type: blockType })
      
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

      const json = await response.json()
      console.log('[handleAddBlock] Response:', { status: response.status, ok: response.ok, json })

      if (!response.ok) {
        const errorMessage = json?.error || json?.details || 'Blok oluşturulamadı'
        console.error('[handleAddBlock] Error response:', errorMessage)
        toast.error(errorMessage)
        return
      }

      if (!json.success || !json.data) {
        console.error('[handleAddBlock] Invalid response format:', json)
        toast.error('Geçersiz yanıt formatı. Sayfa yenileniyor...')
        await fetchPage()
        return
      }

      // Refresh page data to get all blocks in correct order
      await fetchPage()
      
      // Set the newly created block as active
      setActiveBlockId(json.data.id)
      setShowBlockLibrary(false)
      toast.success('Blok başarıyla eklendi')
    } catch (error) {
      console.error('[handleAddBlock] Exception:', error)
      const errorMessage = error instanceof Error ? error.message : 'Blok eklenirken hata oluştu'
      toast.error(errorMessage)
      
      // Try to refresh page data in case block was created but response failed
      try {
        await fetchPage()
      } catch (fetchError) {
        console.error('[handleAddBlock] Failed to refresh page:', fetchError)
      }
    }
  }

  const handleUpdateBlock = useCallback(async (blockId: string, content: Record<string, any>) => {
    // Helper: deep merge source into target (immutable)
    // CRITICAL: Preserve empty strings and arrays for fields that should be cleared
    const deepMerge = (target: any, source: any): any => {
      if (source === undefined) return target
      if (source === null) return source // null is a valid value
      if (typeof target !== 'object' || target === null) return source
      if (typeof source !== 'object' || source === null) return source
      const out = Array.isArray(target) ? [...target] : { ...target }
      
      // Fields that should always be updated, even if empty (user explicitly cleared them)
      const alwaysUpdateFields = ['title', 'subtitle', 'description', 'mainTitle', 'badge', 'primaryButton', 'primaryButtonLink', 'secondaryButton', 'secondaryButtonLink', 'trustIndicator', 'trustIndicatorSubtext', 'sectionId']
      
      // Nested objects that should always be fully replaced (not merged) when present in source
      // This is important for block types with complex nested structures like WhatsApp
      const alwaysReplaceObjects = ['basic', 'appearance', 'message', 'display', 'availability', 'ctaBubble']
      
      // Array fields that should always be preserved (even if empty)
      const alwaysUpdateArrays = ['buttons', 'hideOnMobile', 'navItems']
      
      for (const key of Object.keys(source)) {
        const s = source[key]
        const t = (target as any)[key]
        
        // CRITICAL: Always update array fields (buttons, etc.)
        if (alwaysUpdateArrays.includes(key) && Array.isArray(s)) {
          out[key] = s // Always preserve arrays, even if empty
          continue
        }
        
        // CRITICAL: Always update these fields if they exist in source (even if empty string or null)
        if (alwaysUpdateFields.includes(key)) {
          out[key] = s // Always preserve, even if empty string or null
          continue
        }
        
        // Skip null/undefined for other fields (but not for alwaysUpdateFields above)
        if (s === null || s === undefined) {
          continue
        }
        
        // Skip empty strings for other fields (to avoid accidental overwrites)
        // BUT only if the field wasn't explicitly set in source
        if (s === '' && !alwaysUpdateFields.includes(key)) {
          continue
        }
        
        if (typeof s === 'object' && s !== null && !Array.isArray(s) && typeof t === 'object' && t !== null && !Array.isArray(t)) {
          // For nested objects like WhatsApp block's 'appearance', 'ctaBubble', etc., 
          // we need to deep merge but ensure all properties are updated
          // If the nested object is in alwaysReplaceObjects, do a deeper merge of its properties
          if (alwaysReplaceObjects.includes(key)) {
            // Deep merge nested object properties to preserve all fields
            out[key] = { ...t, ...s }
            // Then merge nested properties recursively
            for (const nestedKey in s) {
              if (typeof s[nestedKey] === 'object' && s[nestedKey] !== null && !Array.isArray(s[nestedKey]) && 
                  typeof t[nestedKey] === 'object' && t[nestedKey] !== null && !Array.isArray(t[nestedKey])) {
                out[key][nestedKey] = deepMerge(t[nestedKey], s[nestedKey])
              }
            }
          } else {
            out[key] = deepMerge(t, s)
          }
        } else {
          out[key] = s
        }
      }
      return out
    }

    // Find existing block
    const existing = page?.blocks.find(b => b.id === blockId)
    const merged = existing ? deepMerge(existing.content || {}, content || {}) : (content || {})

    // No-op if merge produces no change
    try {
      if (existing && JSON.stringify(existing.content) === JSON.stringify(merged)) {
        return existing
      }
    } catch (e) {
      // ignore
    }

    // Optimistic update: set merged content locally, but send the incoming partial to the API
    setPage(prev => prev ? {
      ...prev,
      blocks: prev.blocks.map(b => b.id === blockId ? { ...b, content: merged } : b)
    } : null)

    // API save is debounced by child editors - just pass through
    const token = localStorage.getItem('adminToken')
    if (!token) {
      toast.error('Yetkilendirme eksik: kaydetme başarısız')
      await fetchPage()
      throw new Error('No admin token')
    }

    try {
      // Send the merged content to the API to avoid races where partial
      // payloads overwrite other fields. Server will still deep-merge and
      // ignore empty values, but sending the merged state reduces surprises.
      console.debug('[debug] handleUpdateBlock: sending', { blockId, mergedPreview: JSON.stringify(merged).slice(0, 200), tokenPresent: !!token })
      const res = await fetch('/api/pages/blocks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: blockId, content: merged, clientUpdatedAt: Date.now() }),
        keepalive: true // Keep request alive even if page closes/refreshes
      })

      let json = null
      try {
        json = await res.json()
      } catch (parseErr) {
        console.error('[debug] handleUpdateBlock: failed parsing JSON response', parseErr)
      }

      console.debug('[debug] handleUpdateBlock: response', { status: res.status, ok: res.ok, bodyPreview: json ? JSON.stringify(json).slice(0, 500) : null })

      if (!res.ok) {
        toast.error(json?.error || 'Blok kaydı başarısız')
        await fetchPage()
        throw new Error(json?.error || `Update failed (status ${res.status})`)
      }

      // Update local page state with server-saved block to ensure exact persisted state
      try {
        if (json?.data?.id) {
          setPage(prev => prev ? ({
            ...prev,
            blocks: prev.blocks.map(b => b.id === json.data.id ? json.data : b)
          }) : null)
          console.debug('[debug] handleUpdateBlock: Updated page state with saved block', {
            blockId: json.data.id,
            hasContent: !!json.data.content,
            contentKeys: Object.keys(json.data.content || {}),
          })
        } else {
          console.warn('[debug] handleUpdateBlock: server returned success but no data.block. Full response:', json)
        }
      } catch (e) {
        console.error('[debug] handleUpdateBlock: failed updating local state', e)
      }

      toast.success('Değişiklikler kaydedildi')
      return json
    } catch (error) {
      console.error('Failed to update block:', error)
      await fetchPage()
      throw error
    }
  }, [page])

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
        setPage(prev => prev ? { ...prev, status: data.data.status, page_categories: data.data.page_categories } : null)
      }
    } catch (error) {
      alert('Durum güncellenirken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleCategoryChange = async (categoryId: string) => {
    if (!page) return

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
          category_id: categoryId || null
        })
      })

      if (response.ok) {
        const data = await response.json()
        setPage(prev => prev ? { 
          ...prev, 
          category_id: data.data.category_id,
          page_categories: data.data.page_categories 
        } : null)
        toast.success('Kategori güncellendi')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Kategori güncellenemedi')
      }
    } catch (error) {
      console.error('Failed to update category:', error)
      toast.error('Kategori güncellenirken hata oluştu')
    }
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleUpdatePageInfo = async (field: 'title' | 'slug', value: string) => {
    if (!page) return

    try {
      const token = localStorage.getItem('adminToken')
      
      // If updating title and slug is empty or auto-generated, update slug too
      const updateData: any = { id: page.id }
      if (field === 'title') {
        updateData.title = value
        // Only auto-update slug if it matches the old title's slug
        const oldTitleSlug = generateSlug(page.title)
        if (page.slug === oldTitleSlug || !page.slug) {
          updateData.slug = generateSlug(value)
        }
      } else {
        // Clean and validate slug format
        const cleanedSlug = generateSlug(value)
        if (!cleanedSlug || cleanedSlug.length === 0) {
          toast.error('Slug boş olamaz')
          return
        }
        updateData.slug = cleanedSlug
      }

      const response = await fetch('/api/pages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        const data = await response.json()
        setPage(prev => prev ? { 
          ...prev, 
          title: data.data.title || prev.title,
          slug: data.data.slug || prev.slug
        } : null)
        toast.success(field === 'title' ? 'Başlık güncellendi' : 'Slug güncellendi')
        if (field === 'slug') {
          setEditingSlug(false)
          setSlugValue(data.data.slug || page.slug)
        }
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Güncelleme başarısız')
      }
    } catch (error) {
      console.error('Failed to update page info:', error)
      toast.error('Güncelleme sırasında hata oluştu')
    }
  }

  const handleSaveSlug = () => {
    if (!slugValue || slugValue.trim() === '') {
      toast.error('Slug boş olamaz')
      return
    }
    handleUpdatePageInfo('slug', slugValue)
  }

  const handleToggleActive = async () => {
    if (!page) return

    const newActive = !(page.active !== false) // Default to true if undefined

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/pages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: page.id, active: newActive })
      })

      if (response.ok) {
        const data = await response.json()
        setPage(prev => prev ? { ...prev, active: data.data.active !== false } : null)
        toast.success(newActive ? 'Sayfa aktif edildi' : 'Sayfa pasif edildi')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Güncelleme başarısız')
      }
    } catch (error) {
      console.error('Failed to toggle active:', error)
      toast.error('Aktif/pasif durumu güncellenirken hata oluştu')
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
          
          {/* Page Title - Editable */}
          <div className="mb-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Sayfa Başlığı
            </label>
            <input
              type="text"
              value={page.title}
              onChange={(e) => setPage(prev => prev ? { ...prev, title: e.target.value } : null)}
              onBlur={(e) => {
                if (e.target.value !== page.title) {
                  handleUpdatePageInfo('title', e.target.value)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur()
                }
              }}
              className="w-full px-3 py-2 text-sm font-semibold text-slate-800 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white"
            />
          </div>

          {/* Page Slug - Editable */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-slate-500 mb-1">
              URL Slug
            </label>
            {!editingSlug ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center">
                  <span className="text-xs text-slate-400 px-2 py-2 border border-r-0 border-slate-200 rounded-l-lg bg-slate-50">
                    /
                  </span>
                  <span className="flex-1 px-3 py-2 text-xs text-slate-600 border border-l-0 border-slate-200 rounded-r-lg bg-slate-50">
                    {page.slug}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSlugValue(page.slug)
                    setEditingSlug(true)
                  }}
                  className="p-1.5 text-slate-400 hover:text-sage-600 hover:bg-sage-50 rounded transition-all"
                  title="Slug'ı düzenle"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-xs text-slate-400 px-2 py-2 border border-r-0 border-slate-200 rounded-l-lg bg-slate-50">
                    /
                  </span>
                  <input
                    type="text"
                    value={slugValue}
                    onChange={(e) => {
                      const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                      setSlugValue(newSlug)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSaveSlug()
                      }
                      if (e.key === 'Escape') {
                        setEditingSlug(false)
                        setSlugValue(page.slug)
                      }
                    }}
                    autoFocus
                    className="flex-1 px-3 py-2 text-xs text-slate-600 border border-slate-200 rounded-r-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white"
                    placeholder="sayfa-slug"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveSlug}
                    className="flex-1 px-2 py-1.5 text-xs font-medium bg-sage-500 hover:bg-sage-600 text-white rounded-lg transition-colors"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={() => {
                      setEditingSlug(false)
                      setSlugValue(page.slug)
                    }}
                    className="px-2 py-1.5 text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    İptal
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">Sadece küçük harf, rakam ve tire. Enter ile kaydet, Esc ile iptal</p>
              </div>
            )}
          </div>
          
          {/* Active/Inactive Toggle */}
          <div className="mt-3">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              Durum
            </label>
            <button
              onClick={handleToggleActive}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                page.active !== false
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                {page.active !== false ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Aktif
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Pasif
                  </>
                )}
              </span>
              <span className="text-xs opacity-70">
                {page.active !== false ? 'Görünür' : 'Gizli'}
              </span>
            </button>
            <p className="text-[10px] text-slate-400 mt-1">Sayfanın görünürlüğünü kontrol eder</p>
          </div>

          {/* Category Selector */}
          <div className="mt-3">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              Kategori
            </label>
            <select
              value={page.category_id || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white"
            >
              <option value="">Kategori Seçin</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {page.page_categories && (
              <div className="mt-2 flex items-center gap-2">
                <span 
                  className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-lg text-white"
                  style={{ backgroundColor: page.page_categories.color || '#9CAF88' }}
                >
                  <span>{page.page_categories.icon}</span>
                  {page.page_categories.name}
                </span>
              </div>
            )}
          </div>
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
            <div className={`mx-auto ${activeBlock.block_type === 'features' || activeBlock.block_type === 'cta' || activeBlock.block_type === 'pricing' || activeBlock.block_type === 'faq' || activeBlock.block_type === 'team' || activeBlock.block_type === 'whatsapp' || activeBlock.block_type === 'gallery' || activeBlock.block_type === 'embed' || activeBlock.block_type === 'header' || activeBlock.block_type === 'footer' ? 'max-w-5xl' : 'max-w-3xl'}`}>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activeBlock.block_type === 'hero' || activeBlock.block_type === 'features' || activeBlock.block_type === 'cta' || activeBlock.block_type === 'pricing' || activeBlock.block_type === 'faq' || activeBlock.block_type === 'team' || activeBlock.block_type === 'whatsapp' || activeBlock.block_type === 'gallery' || activeBlock.block_type === 'embed' || activeBlock.block_type === 'header' || activeBlock.block_type === 'footer' || activeBlock.block_type === 'about' ? 'bg-gradient-to-br from-sage-400 to-forest-500' : 'bg-slate-100'
                    }`}>
                      <span className="text-lg">
                        {activeBlock.block_type === 'hero' ? '🏠' : activeBlock.block_type === 'features' ? '⭐' : activeBlock.block_type === 'cta' ? '📢' : activeBlock.block_type === 'pricing' ? '💰' : activeBlock.block_type === 'faq' ? '❓' : activeBlock.block_type === 'team' ? '👥' : activeBlock.block_type === 'whatsapp' ? '💬' : activeBlock.block_type === 'gallery' ? '🖼️' : activeBlock.block_type === 'embed' ? '🔗' : activeBlock.block_type === 'header' ? '📋' : activeBlock.block_type === 'footer' ? '🦶' : activeBlock.block_type === 'about' ? '👥' : '📝'}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-800 capitalize">
                        {activeBlock.block_type === 'hero' ? 'Hero Editörü' : activeBlock.block_type === 'features' ? 'Özellikler Editörü' : activeBlock.block_type === 'cta' ? 'CTA Bölümü Editörü' : activeBlock.block_type === 'pricing' ? 'Fiyatlandırma Editörü' : activeBlock.block_type === 'faq' ? 'FAQ Editörü' : activeBlock.block_type === 'team' ? 'Ekip Editörü' : activeBlock.block_type === 'whatsapp' ? 'WhatsApp Editörü' : activeBlock.block_type === 'gallery' ? 'Galeri Editörü' : activeBlock.block_type === 'embed' ? 'Embed Editörü' : activeBlock.block_type === 'header' ? 'Header Editörü' : activeBlock.block_type === 'footer' ? 'Footer Editörü' : activeBlock.block_type === 'about' ? 'Über Uns Editörü' : `${activeBlock.block_type} Bloğu Düzenle`}
                      </h2>
                      {(activeBlock.block_type === 'hero' || activeBlock.block_type === 'features' || activeBlock.block_type === 'cta' || activeBlock.block_type === 'pricing' || activeBlock.block_type === 'faq' || activeBlock.block_type === 'team' || activeBlock.block_type === 'whatsapp' || activeBlock.block_type === 'gallery' || activeBlock.block_type === 'embed' || activeBlock.block_type === 'header' || activeBlock.block_type === 'footer' || activeBlock.block_type === 'about') && (
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

                <div className={`${activeBlock.block_type === 'hero' || activeBlock.block_type === 'features' || activeBlock.block_type === 'cta' || activeBlock.block_type === 'pricing' || activeBlock.block_type === 'faq' || activeBlock.block_type === 'team' || activeBlock.block_type === 'whatsapp' || activeBlock.block_type === 'gallery' || activeBlock.block_type === 'embed' || activeBlock.block_type === 'header' || activeBlock.block_type === 'footer' || activeBlock.block_type === 'sticky-button' ? 'p-4' : 'p-6'}`}>
                  <BlockEditorForm
                    key={activeBlock.id}
                    block={activeBlock}
                    blockId={activeBlock.id}
                    onUpdate={handleUpdateBlock}
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
                              {block.icon === 'info-circle' && '👥'}
                              {block.icon === 'code' && '🔗'}
                              {block.icon === 'menu' && '📋'}
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
  blockId,
  onUpdate
}: {
  block: PageBlock
  blockId: string
  onUpdate: (blockId: string, content: Record<string, any>) => Promise<any>
}) {
  // Note: This component has key={block.id} so it fully remounts when switching blocks
  // Sync content state with block.content when block changes (e.g., from API refresh)
  const [content, setContent] = useState(block.content)
  const [savingBlock, setSavingBlock] = useState(false)
  const [dirty, setDirty] = useState(false)
  const isInitialMount = useRef(true)
  const pendingSaveRef = useRef<NodeJS.Timeout | null>(null)
  const contentRef = useRef(content)
  const isManualSavingRef = useRef(false) // Flag to prevent debounced saves during manual save
  const savingBlockRef = useRef(false) // Additional ref for immediate synchronous check
  const debouncedSaveExecutingRef = useRef(false) // Flag to prevent multiple debounced saves from executing simultaneously
  const lastSavedContentRef = useRef<any>(null) // Track last successfully saved content
  
  // Keep contentRef in sync with content state
  useEffect(() => {
    contentRef.current = content
  }, [content])

  // Sync content state when block.content changes (e.g., after API save or page refresh)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      lastSavedContentRef.current = block.content
      return
    }
    
    // Only update if block.content is actually different (from server)
    // This happens after a successful save, so we should sync local state
    try {
      const currentStr = JSON.stringify(content)
      const blockStr = JSON.stringify(block.content)
      if (currentStr !== blockStr) {
        console.debug('[BlockEditorForm] Syncing content from block.content (after save)', {
          contentKeys: Object.keys(content || {}),
          blockContentKeys: Object.keys(block.content || {}),
        })
        setContent(block.content)
        contentRef.current = block.content
        lastSavedContentRef.current = block.content
        // After syncing from server, content should match, so mark as not dirty
        // But let the dirty check useEffect handle this to avoid race conditions
      } else {
        // Even if strings match, update lastSavedContentRef to ensure consistency
        lastSavedContentRef.current = block.content
      }
    } catch (e) {
      // If stringify fails, update anyway
      setContent(block.content)
      contentRef.current = block.content
      lastSavedContentRef.current = block.content
    }
  }, [block.content])

  // Track dirty state - improved to detect empty string changes
  useEffect(() => {
    // Use a small delay to ensure state updates have propagated
    const timeoutId = setTimeout(() => {
      try {
        // Use contentRef for most up-to-date content
        const currentContent = contentRef.current || content
        
        // Normalize both objects for comparison (handle undefined, null, empty string)
        const normalizeValue = (val: any): string => {
          if (val === null || val === undefined) return ''
          if (typeof val === 'string') return val
          return JSON.stringify(val)
        }
        
        // Deep comparison function that handles empty strings correctly
        const deepEqual = (a: any, b: any): boolean => {
          if (a === b) return true
          if (a == null || b == null) return a === b
          if (typeof a !== 'object' || typeof b !== 'object') {
            // For strings, compare directly (empty string !== undefined)
            return normalizeValue(a) === normalizeValue(b)
          }
          
          // Special handling for arrays (buttons, etc.)
          if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false
            for (let i = 0; i < a.length; i++) {
              if (!deepEqual(a[i], b[i])) return false
            }
            return true
          }
          
          const keysA = Object.keys(a)
          const keysB = Object.keys(b)
          if (keysA.length !== keysB.length) return false
          
          for (const key of keysA) {
            if (!keysB.includes(key)) return false
            if (!deepEqual(a[key], b[key])) return false
          }
          return true
        }
        
        // Check if content matches last saved content (from debounced save)
        // If it matches, content is saved even if block.content prop hasn't updated yet
        const matchesLastSaved = lastSavedContentRef.current && deepEqual(currentContent, lastSavedContentRef.current)
        const matchesBlockContent = deepEqual(currentContent, block.content)
        
        // Content is dirty only if it differs from both last saved and block.content
        const isDirty = !matchesLastSaved && !matchesBlockContent
        setDirty(isDirty)
        
        console.debug('[BlockEditorForm] Dirty state check:', {
          isDirty,
          usingRef: !!contentRef.current,
          contentKeys: Object.keys(currentContent || {}),
          blockKeys: Object.keys(block.content || {}),
        })
      } catch (e) {
        console.error('[BlockEditorForm] Dirty state check error:', e)
        setDirty(true)
      }
    }, 50) // Small delay to ensure state updates have propagated
    
    return () => clearTimeout(timeoutId)
  }, [content, block.content])

  // Flush pending saves when unmounting (switching blocks)
  useEffect(() => {
    return () => {
      // Clear any pending debounced saves
      if (pendingSaveRef.current) {
        clearTimeout(pendingSaveRef.current)
        pendingSaveRef.current = null
      }
      
      // If there are unsaved changes, save them immediately
      if (dirty && content) {
        // Use sendBeacon for reliable save on unmount
        const token = localStorage.getItem('adminToken')
        if (token) {
          const payload = {
            id: blockId,
            content: content,
            clientUpdatedAt: Date.now()
          }
          
          // Try to save synchronously
          fetch('/api/pages/blocks', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
            keepalive: true // Critical for unmount saves
          }).catch(() => {
            // Ignore errors on unmount
          })
        }
      }
    }
  }, [blockId, content, dirty])

  // Memoize the update handler with blockId bound - prevents re-creating on every render
  // This handles updates from child editors (like SEOBlockEditor) that send full content
  const handleUpdate = useCallback((updatedContent: Partial<any> | any) => {
    // Update local content state immediately for responsive UI
    let mergedContent: any
    setContent(prev => {
      // If updatedContent is a full object (from block editors, etc.), use it directly
      // Otherwise merge with previous content
      if (updatedContent && typeof updatedContent === 'object' && !Array.isArray(updatedContent)) {
        // Check if this looks like a full content object (has multiple keys)
        const keys = Object.keys(updatedContent)
        if (keys.length > 1 || (keys.length === 1 && keys[0] !== 'title' && keys[0] !== 'text')) {
          // Likely a full content object, merge it (including empty strings for cleared fields)
          mergedContent = { ...prev, ...updatedContent }
          return mergedContent
        }
      }
      // Partial update, merge (including empty strings)
      mergedContent = { ...prev, ...updatedContent }
      return mergedContent
    })
    
    // Update contentRef immediately to ensure it's available in setTimeout
    if (mergedContent) {
      contentRef.current = mergedContent
    }
    
    // CRITICAL: Immediately check if content is dirty and update dirty state
    // This ensures "Kayıt Et" button becomes active immediately when content changes
    const checkDirty = () => {
      try {
        const normalizeValue = (val: any): string => {
          if (val === null || val === undefined) return ''
          if (typeof val === 'string') return val
          return JSON.stringify(val)
        }
        
        const deepEqual = (a: any, b: any): boolean => {
          if (a === b) return true
          if (a == null || b == null) return a === b
          if (typeof a !== 'object' || typeof b !== 'object') {
            return normalizeValue(a) === normalizeValue(b)
          }
          
          if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false
            for (let i = 0; i < a.length; i++) {
              if (!deepEqual(a[i], b[i])) return false
            }
            return true
          }
          
          const keysA = Object.keys(a)
          const keysB = Object.keys(b)
          if (keysA.length !== keysB.length) return false
          
          for (const key of keysA) {
            if (!keysB.includes(key)) return false
            if (!deepEqual(a[key], b[key])) return false
          }
          return true
        }
        
        const isDirty = !deepEqual(mergedContent, block.content)
        setDirty(isDirty)
        
        console.debug('[BlockEditorForm] handleUpdate - Dirty state updated:', {
          isDirty,
          descriptionsCount: mergedContent?.descriptions?.length || 0,
          blockDescriptionsCount: block.content?.descriptions?.length || 0,
        })
      } catch (e) {
        console.error('[BlockEditorForm] handleUpdate - Dirty check error:', e)
        setDirty(true) // On error, assume dirty to allow saving
      }
    }
    
    // Check dirty state immediately
    checkDirty()
    
    // Skip debounced save if manual save is in progress OR if a debounced save is already executing
    if (isManualSavingRef.current || savingBlockRef.current || debouncedSaveExecutingRef.current) {
      console.debug('[BlockEditorForm] handleUpdate - Skipping debounced save (save in progress)', {
        isManualSaving: isManualSavingRef.current,
        savingBlock: savingBlockRef.current,
        debouncedSaveExecuting: debouncedSaveExecutingRef.current,
      })
      return
    }
    
    // Debounce the API call to avoid excessive requests
    // CRITICAL: If a debounced save is already pending, just update the timeout with new content
    // Don't create multiple pending saves
    if (pendingSaveRef.current) {
      clearTimeout(pendingSaveRef.current)
      pendingSaveRef.current = null
    }
    
    pendingSaveRef.current = setTimeout(() => {
      // CRITICAL: Double-check flags at the START of the callback (before any async operations)
      // This prevents race conditions where flags might be set after the timeout fires
      if (isManualSavingRef.current || savingBlockRef.current || debouncedSaveExecutingRef.current) {
        console.debug('[BlockEditorForm] handleUpdate - Skipping debounced save (flags set during debounce)', {
          isManualSaving: isManualSavingRef.current,
          savingBlock: savingBlockRef.current,
          debouncedSaveExecuting: debouncedSaveExecutingRef.current,
        })
        pendingSaveRef.current = null
        return
      }
      
      // Mark that debounced save is executing IMMEDIATELY (before any async operations)
      debouncedSaveExecutingRef.current = true
      // Use the merged content directly (already captured above)
      const currentContent = mergedContent || contentRef.current || content
      // Ensure all content fields are included, especially empty strings for cleared fields
      const fullContent = {
        ...currentContent,
        ...updatedContent,
        // Explicitly preserve all fields, including empty strings and arrays
        title: updatedContent.title !== undefined ? updatedContent.title : currentContent.title,
        buttons: updatedContent.buttons !== undefined ? updatedContent.buttons : currentContent.buttons,
      }
      console.debug('[BlockEditorForm] Saving block (debounced):', {
        blockId,
      })
      
      // Call onUpdate and wait for it to complete
      onUpdate(blockId, fullContent).then((result) => {
        // After successful save, update contentRef and check dirty state
        if (result?.data?.content) {
          const savedContent = result.data.content
          contentRef.current = savedContent
          lastSavedContentRef.current = savedContent
          // Update local content state to match server
          setContent(savedContent)
          
          // If save was successful, mark as not dirty immediately
          setDirty(false)
        } else {
          contentRef.current = fullContent
          lastSavedContentRef.current = fullContent
          // Even without server response, if save didn't error, assume it's saved
          // Mark as not dirty since save was successful
          setDirty(false)
        }
      }).catch((error) => {
        console.error('[BlockEditorForm] Error in debounced save:', error)
        // On error, keep dirty state as true so user can retry
      }).finally(() => {
        // CRITICAL: Clear the executing flag so new debounced saves can run
        debouncedSaveExecutingRef.current = false
        pendingSaveRef.current = null
      })
    }, 200) // 200ms debounce for faster saves
  }, [blockId, onUpdate, content, block.content])

  const handleChange = (key: string, value: any) => {
    const newContent = { ...content, [key]: value }
    setContent(newContent)
    handleUpdate(newContent)
  }

  const handleSaveBlock = async () => {
    // CRITICAL: Check ref first (synchronous) before any async state updates
    if (savingBlockRef.current || isManualSavingRef.current) {
      console.debug('[BlockEditorForm] handleSaveBlock - Already saving (ref check), skipping duplicate call', {
        savingBlockRef: savingBlockRef.current,
        isManualSavingRef: isManualSavingRef.current,
        savingBlockState: savingBlock,
      })
      return
    }
    
    // CRITICAL: Cancel any pending debounced saves FIRST, before setting flags
    // This prevents race conditions where a debounced save might fire after flags are set
    if (pendingSaveRef.current) {
      clearTimeout(pendingSaveRef.current)
      pendingSaveRef.current = null
    }
    
    // Set refs immediately (synchronous) to prevent any concurrent calls
    // These flags prevent both manual saves and debounced saves from running concurrently
    // If a debounced save is currently executing, it will check these flags and skip
    savingBlockRef.current = true
    isManualSavingRef.current = true
    setSavingBlock(true)
    
    try {
      
      // Use the most up-to-date content from ref (which is updated immediately in handleUpdate)
      // The ref is updated synchronously in handleUpdate, so it's always current
      // Fallback to state if ref is not available (shouldn't happen, but safety check)
      const currentContent = contentRef.current || content
      
      console.debug('[BlockEditorForm] handleSaveBlock - Current content source:', {
        usingRef: !!contentRef.current,
        refKeys: contentRef.current ? Object.keys(contentRef.current) : [],
        stateKeys: Object.keys(content),
        dirty,
      })
      
      // Ensure all content is included, especially empty strings for cleared fields
      const fullContent = {
        ...currentContent,
        // Explicitly preserve all fields, including empty strings and arrays
        title: currentContent.title !== undefined ? currentContent.title : '',
        buttons: currentContent.buttons !== undefined ? currentContent.buttons : [],
        // Preserve all nested objects
        titleHighlight: currentContent.titleHighlight !== undefined ? currentContent.titleHighlight : undefined,
        titleStyles: currentContent.titleStyles !== undefined ? currentContent.titleStyles : undefined,
        image: currentContent.image !== undefined ? currentContent.image : undefined,
        video: currentContent.video !== undefined ? currentContent.video : undefined,
        imageStyles: currentContent.imageStyles || {},
        gradientColors: currentContent.gradientColors !== undefined ? currentContent.gradientColors : undefined,
        backgroundOverlay: currentContent.backgroundOverlay !== undefined ? currentContent.backgroundOverlay : undefined,
        animations: currentContent.animations || {},
        responsive: currentContent.responsive || {},
        elementAlignments: currentContent.elementAlignments !== undefined ? currentContent.elementAlignments : undefined,
        trustIndicator: currentContent.trustIndicator !== undefined ? currentContent.trustIndicator : undefined,
        padding: currentContent.padding || {},
      }
      console.debug('[BlockEditorForm] Manual save:', {
        blockId,
        usingRef: !!contentRef.current,
        subtitle: (fullContent as any).subtitle,
        subtitleIsEmpty: (fullContent as any).subtitle === '',
        description: (fullContent as any).description,
        dirty,
        fullContentKeys: Object.keys(fullContent),
      })
      // Call parent handler which performs optimistic update + API save
      // CRITICAL: Only call once - check flag again before calling
      if (!isManualSavingRef.current) {
        console.warn('[BlockEditorForm] handleSaveBlock - Flag was cleared before onUpdate call, this should not happen')
        return
      }
      const result = await onUpdate(blockId, fullContent)
      
      // Update local state to match saved content from server response
      // CRITICAL: Use server response content to ensure exact match
      if (result?.data?.content) {
        const savedContent = result.data.content
        setContent(savedContent)
        contentRef.current = savedContent
        lastSavedContentRef.current = savedContent
        console.debug('[BlockEditorForm] handleSaveBlock - Updated from server response', {
          blockId,
          savedContentKeys: Object.keys(savedContent),
        })
      } else {
        // Fallback: use the content we sent
        setContent(fullContent)
        contentRef.current = fullContent
        lastSavedContentRef.current = fullContent
        console.debug('[BlockEditorForm] handleSaveBlock - Using sent content (no server response)', {
          blockId,
        })
      }
      
      // After successful save, mark as not dirty immediately
      // The saved content should match what we just saved
      setDirty(false)
      
      // CRITICAL: Wait a bit for state updates to propagate, then check dirty state again
      // This handles the case where block.content prop updates from parent
      setTimeout(() => {
        // Force a dirty state check after save
        const currentContent = contentRef.current || content
        try {
          const currentStr = JSON.stringify(currentContent)
          const blockStr = JSON.stringify(block.content)
          const isDirty = currentStr !== blockStr
          
          // Only set dirty to true if there's an actual difference
          // If save was successful, content should match
          if (isDirty) {
            // There might be a delay in block.content prop update, so check again later
            setTimeout(() => {
              const finalContent = contentRef.current || content
              const finalBlockContent = block.content
              const finalDirty = JSON.stringify(finalContent) !== JSON.stringify(finalBlockContent)
              setDirty(finalDirty)
            }, 200)
          } else {
            setDirty(false)
          }
        } catch (e) {
          console.error('[BlockEditorForm] handleSaveBlock - Error checking dirty state:', e)
        }
      }, 100)
      
      console.debug('[BlockEditorForm] handleSaveBlock - Save completed successfully', {
        blockId,
        hasResult: !!result,
        hasData: !!result?.data,
      })
    } catch (error) {
      console.error('[BlockEditorForm] Failed to save block:', error)
      // Don't clear dirty state on error - user should be able to retry
      toast.error('Blok kaydedilemedi. Ağ bağlantınızı kontrol edin ve tekrar deneyin.')
      throw error // Re-throw so caller knows it failed
    } finally {
      setSavingBlock(false)
      savingBlockRef.current = false
      // Clear flag after a short delay to allow state updates to propagate
      setTimeout(() => {
        isManualSavingRef.current = false
      }, 100)
    }
  }

  const handleRevert = async () => {
    if (!confirm('Yaptığınız değişiklikleri geri almak istiyor musunuz?')) return
    setContent(block.content)
    try {
      await onUpdate(blockId, block.content)
      setDirty(false)
    } catch (error) {
      console.error('Failed to revert block:', error)
      alert('Geri alma sırasında hata oluştu.')
    }
  }

  // Render different form fields based on block type
  const renderFields = () => {
    switch (block.block_type) {
      case 'hero':
        return (
          <HeroBlockEditor
            content={content as HeroContent}
            onUpdate={handleUpdate}
          />
        )

      case 'features':
        // FeaturesBlockEditor manages its own state with debouncing
        return (
          <FeaturesBlockEditor
            content={content as FeaturesContent}
            onUpdate={handleUpdate}
          />
        )

      case 'text':
        // TextBlockEditor manages its own state with debouncing
        return (
          <TextBlockEditor
            content={content as TextContent}
            onUpdate={handleUpdate}
          />
        )

      case 'cta':
        // CTABlockEditor manages its own state with debouncing
        return (
          <CTABlockEditor
            content={content as CTAContent}
            onUpdate={handleUpdate}
          />
        )

      case 'pricing':
        // PricingBlockEditor manages its own state with debouncing
        return (
          <PricingBlockEditor
            content={content as PricingContent}
            onChange={handleUpdate}
          />
        )

      case 'faq':
        // FAQBlockEditor manages its own state with debouncing
        return (
          <FAQBlockEditor
            content={content as unknown as Record<string, unknown>}
            onUpdate={handleUpdate}
          />
        )

      case 'team':
        // TeamBlockEditor manages its own state with debouncing
        return (
          <TeamBlockEditor
            content={content as unknown as Record<string, unknown>}
            onUpdate={handleUpdate}
          />
        )

      case 'whatsapp':
        // WhatsAppBlockEditor manages its own state with debouncing
        return (
          <WhatsAppBlockEditor
            content={content as unknown as Record<string, unknown>}
            onUpdate={handleUpdate}
          />
        )

      case 'gallery':
        // GalleryBlockEditor manages its own state with debouncing
        return (
          <GalleryBlockEditor
            content={content as unknown as Record<string, unknown>}
            onUpdate={handleUpdate}
          />
        )

      case 'embed':
        // EmbedBlockEditor manages its own state with debouncing
        return (
          <EmbedBlockEditor
            content={content as EmbedContent}
            onUpdate={handleUpdate}
          />
        )

      case 'header':
        // HeaderBlockEditor manages its own state with debouncing
        return (
          <HeaderBlockEditor
            content={content as any}
            onUpdate={handleUpdate}
          />
        )

      case 'footer':
        // FooterBlockEditor manages its own state with debouncing
        return (
          <FooterBlockEditor
            content={content as any}
            onUpdate={handleUpdate}
          />
        )

      case 'contact':
        // ContactBlockEditor manages its own state with debouncing
        return (
          <ContactBlockEditor
            content={content as ContactBlockContent}
            onUpdate={handleUpdate}
          />
        )

      case 'seo':
        // SEOBlockEditor - Enterprise SEO management
        return (
          <SEOBlockEditor
            content={content as SEOContent}
            onUpdate={handleUpdate}
          />
        )

      case 'services':
        return (
          <ServicesBlockEditor
            content={content as ServicesContent}
            onUpdate={handleUpdate}
          />
        )

      case 'testimonials':
        return (
          <TestimonialsBlockEditor
            content={content as TestimonialsContent}
            onUpdate={handleUpdate}
          />
        )

      case 'about':
        return (
          <AboutBlockEditor
            content={content as AboutContent}
            onUpdate={handleUpdate}
          />
        )

      case 'video':
        return (
          <VideoBlockEditor
            content={content as VideoContent}
            onUpdate={handleUpdate}
          />
        )

      case 'stats':
        return (
          <StatsBlockEditor
            content={content as StatsContent}
            onUpdate={handleUpdate}
          />
        )

      case 'divider':
        return (
          <DividerBlockEditor
            content={content as DividerContent}
            onUpdate={handleUpdate}
          />
        )

      case 'sticky-button':
        return (
          <StickyButtonBlockEditor
            content={content as unknown as Record<string, unknown>}
            onUpdate={handleUpdate}
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

  return (
    <>
      {renderFields()}

      {/* Inline Save / Revert controls to ensure non-enterprise editors can persist changes */}
      <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          {dirty && !savingBlock && '⚠️ Kaydedilmemiş değişiklikler var'}
          {savingBlock && '💾 Kaydediliyor...'}
          {!dirty && !savingBlock && '✅ Tüm değişiklikler kaydedildi'}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRevert}
            disabled={!dirty || savingBlock}
            className={`px-3 py-2 rounded-lg border border-slate-200 text-sm transition-colors ${
              !dirty || savingBlock
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Geri Al
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleSaveBlock()
            }}
            disabled={savingBlock}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
              savingBlock
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-sage-500 hover:bg-forest-600 active:bg-forest-700'
            }`}
            title={savingBlock ? 'Kaydediliyor...' : dirty ? 'Değişiklikleri kaydet' : 'Manuel kaydet (tüm değişiklikler zaten otomatik kaydediliyor)'}
          >
            {savingBlock ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Kaydediliyor...
              </span>
            ) : (
              '💾 Kaydet'
            )}
          </button>
        </div>
      </div>
    </>
  )
}
