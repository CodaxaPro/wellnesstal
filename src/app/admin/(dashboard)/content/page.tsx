'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

// Import types and constants
import { contentTabs } from './components/constants'

// Import editor components
import {
  HeaderEditor,
  LandingHeroEditor,
  HeroEditor,
  ServicesSectionEditor,
  AboutEditor,
  ContactSectionEditor,
  FooterEditor,
  MetaEditor
} from './components/editors'
import { ContentSection } from './components/types'
import TestimonialsBlockEditor from '@/components/blocks/editors/TestimonialsBlockEditor'

export default function ContentManagement() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'header')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [contentSections, setContentSections] = useState<ContentSection[]>([])
  const [editingContent, setEditingContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedStyleFields, setExpandedStyleFields] = useState<string[]>([])
  const [currentDefaults, setCurrentDefaults] = useState<any>(null)
  const [uploadingImage, setUploadingImage] = useState<number | null>(null)
  const [deletingImage, setDeletingImage] = useState<number | null>(null)
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false)
  const [deletingHeroImage, setDeletingHeroImage] = useState(false)
  const [homepageTestimonialBlock, setHomepageTestimonialBlock] = useState<any>(null)
  const [homepageBlockLoading, setHomepageBlockLoading] = useState(false)
  const [homepageBlockId, setHomepageBlockId] = useState<string | null>(null)
  const [isEditingHomepageBlock, setIsEditingHomepageBlock] = useState(false)
  const [isSavingHomepageBlock, setIsSavingHomepageBlock] = useState(false)
  const [sourceBlockInfo, setSourceBlockInfo] = useState<{ pageTitle: string; pageId: string; blockId: string } | null>(null)

  // Set active tab from URL parameter
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab')
    if (tabFromUrl && contentTabs.find(t => t.id === tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [searchParams])

  // Fetch content from API
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }
    fetchContent()
    if (activeTab === 'homepage-testimonials-block') {
      fetchHomepageTestimonialBlock()
    }
  }, [router, activeTab])

  const fetchContent = async (): Promise<ContentSection[]> => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/content')
      const data = await response.json()
      if (data.success) {
        setContentSections(data.data)
        return data.data
      }
      return []
    } catch (error) {
      console.error('Failed to fetch content:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentSection = () => {
    return contentSections.find(section => section.section === activeTab)
  }

  const fetchHomepageTestimonialBlock = async () => {
    try {
      setHomepageBlockLoading(true)
      const token = localStorage.getItem('adminToken')

      // Try to find home page with different slug variations
      let pageData = null
      const homeSlugs = ['home', 'index', '']

      for (const slug of homeSlugs) {
        try {
          const url = slug ? `/api/pages?slug=${slug}&withBlocks=true` : '/api/pages?withBlocks=true'
          const pageResponse = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
          })

          if (pageResponse.ok) {
            const data = await pageResponse.json()
            if (data.success && data.data) {
              // If no slug specified, find the first page or page with slug 'home'/'index'
              if (!slug) {
                const pages = Array.isArray(data.data.pages) ? data.data.pages : (data.data ? [data.data] : [])
                const homePage = pages.find((p: any) =>
                  p.slug === 'home' || p.slug === 'index' || p.slug === ''
                ) || pages[0]
                if (homePage) {
                  // Fetch blocks for this page
                  const blocksResponse = await fetch(`/api/pages?id=${homePage.id}&withBlocks=true`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                  })
                  if (blocksResponse.ok) {
                    const blocksData = await blocksResponse.json()
                    if (blocksData.success) {
                      pageData = { success: true, data: { ...homePage, blocks: blocksData.data?.blocks || [] } }
                      break
                    }
                  }
                }
              } else {
                pageData = data
                break
              }
            }
          }
        } catch (err) {
          console.warn(`[ContentManagement] Failed to fetch page with slug "${slug}":`, err)
        }
      }

      if (pageData?.success && pageData.data?.blocks) {
        // Find testimonial blocks (prefer visible ones)
        const testimonialBlocks = pageData.data.blocks.filter(
          (b: any) => b.block_type === 'testimonials'
        )
        const testimonialBlock = testimonialBlocks.find(
          (b: any) => b.visible !== false
        ) || testimonialBlocks[0]

        if (testimonialBlock) {
          // Homepage has a testimonial block - always use it, even if content is empty
          console.log('[ContentManagement] Found testimonial block on homepage:', {
            blockId: testimonialBlock.id,
            hasContent: !!testimonialBlock.content,
            visible: testimonialBlock.visible
          })

          // Always set the homepage block ID and content (even if content is empty/null)
          setHomepageBlockId(testimonialBlock.id)
          setHomepageTestimonialBlock(testimonialBlock.content || {})
          setSourceBlockInfo(null)
        } else {
          // Homepage doesn't have a block, search for one in other pages
          console.log('[ContentManagement] Homepage has no testimonial block, searching other pages...')
          setHomepageBlockId(null)
          if (token) await findExistingTestimonialBlock(token)
        }
      } else {
        console.log('[ContentManagement] Homepage not found or has no blocks, searching other pages...')
        // Homepage not found or no blocks, search other pages
        // But first, try to find homepage in all pages list
        try {
          const allPagesResponse = await fetch('/api/pages', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (allPagesResponse.ok) {
            const allPagesData = await allPagesResponse.json()
            if (allPagesData.success && allPagesData.data?.pages) {
              const pages = Array.isArray(allPagesData.data.pages) ? allPagesData.data.pages : []
              const homePage = pages.find((p: any) =>
                p.slug === 'home' || p.slug === 'index' || p.slug === '' || p.title?.toLowerCase().includes('home')
              )
              if (homePage) {
                // Fetch blocks for this page
                const blocksResponse = await fetch(`/api/pages?id=${homePage.id}&withBlocks=true`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                })
                if (blocksResponse.ok) {
                  const blocksData = await blocksResponse.json()
                  if (blocksData.success && blocksData.data?.blocks) {
                    const testimonialBlocks = blocksData.data.blocks.filter(
                      (b: any) => b.block_type === 'testimonials'
                    )
                    const testimonialBlock = testimonialBlocks.find(
                      (b: any) => b.visible !== false
                    ) || testimonialBlocks[0]

                    if (testimonialBlock) {
                      setHomepageBlockId(testimonialBlock.id)
                      setHomepageTestimonialBlock(testimonialBlock.content || {})
                      setSourceBlockInfo(null)
                      return
                    }
                  }
                }
              }
            }
          }
        } catch (err) {
          console.warn('[ContentManagement] Failed to search in all pages:', err)
        }
        // If still not found, search other pages for testimonial block
        if (token) await findExistingTestimonialBlock(token)
      }
    } catch (error) {
      console.error('Failed to fetch homepage testimonial block:', error)
      setHomepageTestimonialBlock(null)
      setHomepageBlockId(null)
      setSourceBlockInfo(null)
    } finally {
      setHomepageBlockLoading(false)
    }
  }

  const findExistingTestimonialBlock = async (token: string) => {
    try {
      console.log('[ContentManagement] Searching for existing testimonial block...')

      // Fetch all pages
      const pagesResponse = await fetch('/api/pages', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!pagesResponse.ok) {
        console.error('[ContentManagement] Failed to fetch pages:', pagesResponse.status)
        // Don't clear existing data if we already have some
        if (!homepageTestimonialBlock) {
          setHomepageTestimonialBlock(null)
          setSourceBlockInfo(null)
        }
        return
      }

      const pagesData = await pagesResponse.json()
      console.log('[ContentManagement] Pages response:', {
        success: pagesData.success,
        hasData: !!pagesData.data,
        hasPages: !!pagesData.data?.pages,
        isArray: Array.isArray(pagesData.data),
        fullResponse: pagesData
      })

      // Handle different response formats
      let pages: any[] = []
      if (pagesData.success) {
        if (pagesData.data?.pages && Array.isArray(pagesData.data.pages)) {
          pages = pagesData.data.pages
        } else if (Array.isArray(pagesData.data)) {
          pages = pagesData.data
        } else if (Array.isArray(pagesData.pages)) {
          pages = pagesData.pages
        }
      } else {
        console.warn('[ContentManagement] No pages data or invalid response format:', pagesData)
        // Don't clear existing data if we already have some
        if (!homepageTestimonialBlock) {
          setHomepageTestimonialBlock(null)
          setSourceBlockInfo(null)
        }
        return
      }

      console.log(`[ContentManagement] Found ${pages.length} pages to search`)

      // Search through all pages for a testimonials block
      for (const page of pages) {
        if (page.slug === 'home' || page.slug === 'index') continue // Skip homepage, we already checked it

        try {
          console.log(`[ContentManagement] Checking page: ${page.title || page.slug} (${page.id})`)
          const pageBlocksResponse = await fetch(`/api/pages?id=${page.id}&withBlocks=true`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })

          if (!pageBlocksResponse.ok) {
            console.error(`[ContentManagement] Failed to fetch blocks for page ${page.id}:`, pageBlocksResponse.status)
            continue
          }

          const pageBlocksData = await pageBlocksResponse.json()
          console.log(`[ContentManagement] Page blocks response for ${page.title}:`, {
            success: pageBlocksData.success,
            hasBlocks: !!pageBlocksData.data?.blocks,
            blockCount: pageBlocksData.data?.blocks?.length || 0
          })

          if (pageBlocksData.success && pageBlocksData.data?.blocks) {
            // Find all testimonial blocks (including hidden ones for admin view)
            const testimonialBlocks = pageBlocksData.data.blocks.filter(
              (b: any) => b.block_type === 'testimonials'
            )

            console.log(`[ContentManagement] Found ${testimonialBlocks.length} testimonial block(s) on page ${page.title || page.slug}`)

            // Prefer visible blocks, but use any if none are visible
            const testimonialBlock = testimonialBlocks.find(
              (b: any) => b.visible !== false
            ) || testimonialBlocks[0]

            if (testimonialBlock && testimonialBlock.content) {
              console.log(`[ContentManagement] Using testimonial block from page: ${page.title || page.slug}`, {
                blockId: testimonialBlock.id,
                visible: testimonialBlock.visible,
                hasContent: !!testimonialBlock.content,
                contentKeys: Object.keys(testimonialBlock.content || {}),
                testimonialsCount: testimonialBlock.content?.testimonials?.length || 0
              })

              // Found a testimonials block on another page, use its data
              setHomepageTestimonialBlock(testimonialBlock.content)
              setSourceBlockInfo({
                pageTitle: page.title || page.slug || 'Unknown Page',
                pageId: page.id,
                blockId: testimonialBlock.id
              })
              return
            } else if (testimonialBlock) {
              console.warn(`[ContentManagement] Testimonial block found but has no content:`, testimonialBlock)
            }
          }
        } catch (err) {
          console.error(`[ContentManagement] Error fetching blocks for page ${page.id}:`, err)
        }
      }

      // No testimonials block found anywhere
      console.log('[ContentManagement] No testimonial block found in any page')
      // Only clear if we don't already have homepage data
      if (!homepageBlockId) {
        setHomepageTestimonialBlock(null)
        setSourceBlockInfo(null)
      }
    } catch (error) {
      console.error('[ContentManagement] Failed to search for existing testimonial block:', error)
      setHomepageTestimonialBlock(null)
      setSourceBlockInfo(null)
    }
  }

  const handleHomepageBlockUpdate = async (updatedContent: any) => {
    // This is called by TestimonialsBlockEditor on every change
    // We update local state immediately for real-time preview
    setHomepageTestimonialBlock(updatedContent)
  }

  const handleSaveHomepageBlock = async () => {
    if (!homepageBlockId || !homepageTestimonialBlock) return

    setIsSavingHomepageBlock(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/pages/blocks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: homepageBlockId,
          content: homepageTestimonialBlock
        })
      })

      if (response.ok) {
        setIsEditingHomepageBlock(false)
        setSaveMessage({ type: 'success', text: 'Block başarıyla kaydedildi' })
        setTimeout(() => setSaveMessage(null), 2000)
      } else {
        const error = await response.json()
        setSaveMessage({ type: 'error', text: error.error || 'Kaydetme başarısız' })
        setTimeout(() => setSaveMessage(null), 3000)
      }
    } catch (error) {
      console.error('Failed to save block:', error)
      setSaveMessage({ type: 'error', text: 'Kaydetme sırasında hata oluştu' })
      setTimeout(() => setSaveMessage(null), 3000)
    } finally {
      setIsSavingHomepageBlock(false)
    }
  }

  const startEditingHomepageBlock = () => {
    setIsEditingHomepageBlock(true)
  }

  const cancelEditingHomepageBlock = async () => {
    // Reload original data only if we have a homepage block ID
    // If we're using a block from another page, just cancel editing without reloading
    if (homepageBlockId) {
      await fetchHomepageTestimonialBlock()
    }
    setIsEditingHomepageBlock(false)
  }

  const createHomepageTestimonialBlock = async (useExistingContent = false) => {
    setIsSavingHomepageBlock(true)
    setSaveMessage(null)
    try {
      const token = localStorage.getItem('adminToken')

      // First, get the home page ID - try different slug variations
      let homePageId = null
      const homeSlugs = ['home', 'index']

      for (const slug of homeSlugs) {
        try {
          const pageResponse = await fetch(`/api/pages?slug=${slug}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })

          if (pageResponse.ok) {
            const data = await pageResponse.json()
            if (data.success && data.data?.id) {
              homePageId = data.data.id
              console.log(`[ContentManagement] Found homepage with slug "${slug}":`, homePageId)
              break
            }
          }
        } catch (err) {
          console.warn(`[ContentManagement] Failed to fetch page with slug "${slug}":`, err)
        }
      }

      // If still not found, try to find in all pages list (but only look for 'home' or 'index' slug)
      if (!homePageId) {
        try {
          const allPagesResponse = await fetch('/api/pages', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (allPagesResponse.ok) {
            const allPagesData = await allPagesResponse.json()
            if (allPagesData.success && allPagesData.data?.pages) {
              const pages = Array.isArray(allPagesData.data.pages) ? allPagesData.data.pages : []
              const homePage = pages.find((p: any) => p.slug === 'home' || p.slug === 'index')
              if (homePage) {
                homePageId = homePage.id
                console.log('[ContentManagement] Found homepage in pages list:', homePageId)
              }
            }
          }
        } catch (err) {
          console.warn('[ContentManagement] Failed to search in all pages:', err)
        }
      }

      if (!homePageId) {
        // Try to create homepage if it doesn't exist
        console.log('[ContentManagement] Homepage not found, creating it...')
        try {
          const createPageResponse = await fetch('/api/pages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: 'Ana Sayfa',
              slug: 'home',
              status: 'published',
              template: 'default',
              meta_title: 'Ana Sayfa',
              meta_description: 'Ana Sayfa',
              active: true
            })
          })

          const createPageData = await createPageResponse.json()
          if (createPageData.success && createPageData.data?.id) {
            homePageId = createPageData.data.id
            console.log('[ContentManagement] Homepage created:', homePageId)
            setSaveMessage({ type: 'success', text: 'Ana sayfa oluşturuldu!' })
          } else {
            setSaveMessage({ type: 'error', text: 'Ana sayfa bulunamadı ve oluşturulamadı. Lütfen manuel olarak bir ana sayfa oluşturun.' })
            return
          }
        } catch (err) {
          console.error('[ContentManagement] Failed to create homepage:', err)
          setSaveMessage({ type: 'error', text: 'Ana sayfa oluşturulurken hata oluştu.' })
          return
        }
      }

      // Get all blocks to determine the next position
      const blocksResponse = await fetch(`/api/pages/blocks?pageId=${homePageId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const blocksData = await blocksResponse.json()

      let nextPosition = 1
      if (blocksData.success && blocksData.data && Array.isArray(blocksData.data)) {
        const maxPosition = blocksData.data.reduce((max: number, block: any) => {
          return Math.max(max, block.position || 0)
        }, 0)
        nextPosition = maxPosition + 1
      }

      // Use existing content if available, otherwise use defaults
      const blockContent = useExistingContent && homepageTestimonialBlock
        ? homepageTestimonialBlock
        : {
            sectionTitle: 'Müşterilerimiz Ne Diyor?',
            highlightedText: '',
            description: 'Deneyimlerimizi sizlerle paylaşıyoruz',
            testimonials: [],
            layout: 'carousel',
            autoPlay: true,
            autoSlideDelay: 5000,
            showRatings: true,
            showStats: false,
            maxDisplayCount: 3
          }

      // Create the testimonial block
      console.log('[ContentManagement] Creating homepage testimonial block:', {
        page_id: homePageId,
        block_type: 'testimonials',
        position: nextPosition,
        hasContent: !!blockContent,
        contentKeys: Object.keys(blockContent || {})
      })

      const createResponse = await fetch('/api/pages/blocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          page_id: homePageId,
          block_type: 'testimonials',
          position: nextPosition,
          content: blockContent,
          visible: true
        })
      })

      const createData = await createResponse.json()
      console.log('[ContentManagement] Create block response:', {
        success: createData.success,
        hasData: !!createData.data,
        blockId: createData.data?.id,
        error: createData.error
      })

      if (!createResponse.ok || !createData.success) {
        const errorMsg = createData.error || `Block oluşturma başarısız (${createResponse.status})`
        console.error('[ContentManagement] Failed to create block:', errorMsg)
        setSaveMessage({ type: 'error', text: errorMsg })
        setTimeout(() => setSaveMessage(null), 3000)
        return
      }

      setSaveMessage({ type: 'success', text: 'Testimonial block başarıyla oluşturuldu!' })

      // Update state immediately with the new block
      const newBlockId = createData.data?.id
      if (newBlockId) {
        console.log('[ContentManagement] Setting new block ID:', newBlockId)
        setHomepageBlockId(newBlockId)
        setSourceBlockInfo(null)
        // Update content state with the created block's content
        if (createData.data?.content) {
          setHomepageTestimonialBlock(createData.data.content)
        }
      }

      // Reload the block to ensure we have the latest data
      await fetchHomepageTestimonialBlock()
      setTimeout(() => setSaveMessage(null), 2000)
    } catch (error) {
      console.error('Failed to create testimonial block:', error)
      setSaveMessage({ type: 'error', text: 'Block oluşturma sırasında hata oluştu' })
      setTimeout(() => setSaveMessage(null), 3000)
    } finally {
      setIsSavingHomepageBlock(false)
    }
  }

  const startEditing = async () => {
    const freshData = await fetchContent()
    const section = freshData.find(s => s.section === activeTab)
    if (section) {
      let mergedContent = JSON.parse(JSON.stringify(section.content))

      // If editing contact-section, merge with contact-settings data
      if (activeTab === 'contact-section') {
        try {
          const [contactRes, contactSettingsRes] = await Promise.all([
            fetch('/api/content?section=contact').then(r => r.json()),
            fetch('/api/content?section=contact-settings').then(r => r.json())
          ])

          // Merge contact data
          if (contactRes.success && contactRes.data?.content) {
            mergedContent = {
              ...mergedContent,
              contact: {
                ...mergedContent.contact,
                phone: contactRes.data.content.phone || mergedContent.contact?.phone,
                email: contactRes.data.content.email || mergedContent.contact?.email,
                businessName: contactRes.data.content.businessName || mergedContent.contact?.businessName
              },
              address: contactRes.data.content.address || mergedContent.address,
              openingHours: contactRes.data.content.openingHours || mergedContent.openingHours
            }
          }

          // Merge contact-settings data
          if (contactSettingsRes.success && contactSettingsRes.data?.content) {
            const settings = contactSettingsRes.data.content
            mergedContent = {
              ...mergedContent,
              businessInfo: settings.businessInfo || mergedContent.businessInfo,
              contact: {
                ...mergedContent.contact,
                ...settings.contact,
                businessName: settings.businessInfo?.name || mergedContent.contact?.businessName
              },
              address: settings.address || mergedContent.address,
              openingHours: settings.openingHours || mergedContent.openingHours,
              socialMedia: settings.socialMedia || mergedContent.socialMedia
            }
          }
        } catch (error) {
          console.error('Failed to merge contact data:', error)
        }
      }

      setEditingContent(mergedContent)
      setCurrentDefaults(section.defaults ? JSON.parse(JSON.stringify(section.defaults)) : null)
      setExpandedStyleFields([])
      setIsEditing(true)
    }
  }

  const toggleStyleField = (fieldName: string) => {
    setExpandedStyleFields(prev =>
      prev.includes(fieldName)
        ? prev.filter(f => f !== fieldName)
        : [...prev, fieldName]
    )
  }

  const updateStyleField = (fieldName: string, styleKey: string, value: string) => {
    setEditingContent((prev: any) => ({
      ...prev,
      styles: {
        ...prev.styles,
        [fieldName]: {
          ...prev.styles?.[fieldName],
          [styleKey]: value
        }
      }
    }))
  }

  const resetFieldToDefault = (fieldName: string) => {
    if (!currentDefaults) {
return
}
    setEditingContent((prev: any) => ({
      ...prev,
      [fieldName]: currentDefaults[fieldName],
      styles: {
        ...prev.styles,
        [fieldName]: currentDefaults.styles?.[fieldName]
      }
    }))
    setSaveMessage({ type: 'success', text: `"${fieldName}" varsayılan değere sıfırlandı` })
    setTimeout(() => setSaveMessage(null), 2000)
  }

  const resetStylePropertyToDefault = (fieldName: string, propertyName: string) => {
    if (!currentDefaults?.styles?.[fieldName]) {
return
}
    const defaultValue = currentDefaults.styles[fieldName][propertyName]
    if (defaultValue === undefined) {
return
}
    setEditingContent((prev: any) => ({
      ...prev,
      styles: {
        ...prev.styles,
        [fieldName]: {
          ...prev.styles?.[fieldName],
          [propertyName]: defaultValue
        }
      }
    }))
  }

  const isStylePropertyChanged = (fieldName: string, propertyName: string) => {
    if (!currentDefaults?.styles?.[fieldName]) {
return false
}
    const currentValue = editingContent?.styles?.[fieldName]?.[propertyName]
    const defaultValue = currentDefaults.styles[fieldName][propertyName]
    return currentValue !== undefined && currentValue !== defaultValue
  }

  const isNestedContentChanged = (path: string) => {
    if (!currentDefaults) {
return false
}
    const pathParts = path.split('.')
    let currentValue: any = editingContent
    let defaultValue: any = currentDefaults
    for (const part of pathParts) {
      currentValue = currentValue?.[part]
      defaultValue = defaultValue?.[part]
    }
    return currentValue !== undefined && currentValue !== defaultValue
  }

  const resetNestedContentToDefault = (path: string) => {
    if (!currentDefaults) {
return
}
    const pathParts = path.split('.')
    let defaultValue: any = currentDefaults
    for (const part of pathParts) {
      defaultValue = defaultValue?.[part]
    }
    if (defaultValue === undefined) {
return
}
    setEditingContent((prev: any) => {
      const newContent = JSON.parse(JSON.stringify(prev))
      let target = newContent
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i]
        if (!part) continue
        if (!target[part]) {
          target[part] = {}
        }
        target = target[part]
      }
      const lastPart = pathParts[pathParts.length - 1]
      if (lastPart) {
        target[lastPart] = defaultValue
      }
      return newContent
    })
  }

  const resetAllToDefaults = () => {
    if (!currentDefaults) {
return
}
    if (confirm('Tüm değerler varsayılana dönecek. Emin misiniz?')) {
      setEditingContent(JSON.parse(JSON.stringify(currentDefaults)))
      setSaveMessage({ type: 'success', text: 'Tüm değerler varsayılana sıfırlandı' })
      setTimeout(() => setSaveMessage(null), 2000)
    }
  }

  const cancelEditing = () => {
    setEditingContent(null)
    setIsEditing(false)
    setSaveMessage(null)
  }

  const handleSave = async () => {
    const section = getCurrentSection()
    if (!section || !editingContent) {
return
}
    setIsSaving(true)
    setSaveMessage(null)
    try {
      const token = localStorage.getItem('adminToken')

      // Save main section
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: section.id,
          section: section.section,
          content: editingContent
        })
      })
      const data = await response.json()

      // If saving contact-section, sync to contact and contact-settings sections
      if (data.success && section.section === 'contact-section' && editingContent) {
        const syncPromises = []

        // Sync to contact section (for ContactSection component)
        if (editingContent.contact || editingContent.address || editingContent.openingHours) {
          syncPromises.push(
            fetch('/api/content', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                section: 'contact',
                content: {
                  businessName: editingContent.businessInfo?.name || editingContent.contact?.businessName,
                  phone: editingContent.contact?.phone,
                  email: editingContent.contact?.email,
                  address: editingContent.address,
                  openingHours: editingContent.openingHours
                }
              })
            })
          )
        }

        // Sync to contact-settings section (for /admin/contact page compatibility)
        if (editingContent.businessInfo || editingContent.contact || editingContent.address ||
            editingContent.openingHours || editingContent.socialMedia) {
          syncPromises.push(
            fetch('/api/content', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                section: 'contact-settings',
                content: {
                  businessInfo: editingContent.businessInfo,
                  contact: editingContent.contact,
                  address: editingContent.address,
                  openingHours: editingContent.openingHours,
                  socialMedia: editingContent.socialMedia
                }
              })
            })
          )
        }

        // Wait for all sync operations
        await Promise.all(syncPromises)
      }

      if (data.success) {
        await fetchContent()
        setIsEditing(false)
        setEditingContent(null)
        setSaveMessage({ type: 'success', text: 'İçerik başarıyla kaydedildi ve senkronize edildi!' })
        setTimeout(() => setSaveMessage(null), 3000)
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Kaydetme başarısız' })
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Bir hata oluştu' })
    } finally {
      setIsSaving(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setEditingContent((prev: any) => ({ ...prev, [field]: value }))
  }

  const updateNestedField = (parent: string, field: string, value: any) => {
    setEditingContent((prev: any) => {
      const currentParent = prev[parent] || {}
      return { ...prev, [parent]: { ...currentParent, [field]: value } }
    })
  }

  // Image upload handlers
  const handleImageUpload = async (index: number, file: File) => {
    setUploadingImage(index)
    setSaveMessage(null)
    try {
      const token = localStorage.getItem('adminToken')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'about')
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      const data = await response.json()
      if (data.success) {
        setEditingContent((prev: any) => {
          const images = [...(prev.images || [])]
          if (!images[index]) {
images[index] = { url: '', alt: '' }
}
          images[index] = { ...images[index], url: data.data.url }
          return { ...prev, images }
        })
        setSaveMessage({ type: 'success', text: `Görsel ${index + 1} başarıyla yüklendi!` })
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Yükleme başarısız' })
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Yükleme sırasında bir hata oluştu' })
    } finally {
      setUploadingImage(null)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  const handleImageDelete = async (index: number) => {
    const imageUrl = editingContent?.images?.[index]?.url
    if (!imageUrl?.startsWith('/uploads/')) {
      setEditingContent((prev: any) => {
        const images = [...(prev.images || [])]
        if (images[index]) {
images[index] = { url: '', alt: images[index]?.alt || '' }
}
        return { ...prev, images }
      })
      setSaveMessage({ type: 'success', text: `Görsel ${index + 1} kaldırıldı` })
      setTimeout(() => setSaveMessage(null), 2000)
      return
    }
    if (!confirm(`Görsel ${index + 1} silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?`)) {
return
}
    setDeletingImage(index)
    setSaveMessage(null)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/upload?url=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setEditingContent((prev: any) => {
          const images = [...(prev.images || [])]
          if (images[index]) {
images[index] = { url: '', alt: images[index]?.alt || '' }
}
          return { ...prev, images }
        })
        setSaveMessage({ type: 'success', text: `Görsel ${index + 1} başarıyla silindi!` })
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Silme başarısız' })
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Silme sırasında bir hata oluştu' })
    } finally {
      setDeletingImage(null)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  const handleHeroImageUpload = async (file: File) => {
    setUploadingHeroImage(true)
    setSaveMessage(null)
    try {
      const token = localStorage.getItem('adminToken')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'hero')
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      const data = await response.json()
      if (data.success) {
        setEditingContent((prev: any) => ({ ...prev, image: { ...prev.image, url: data.data.url } }))
        setSaveMessage({ type: 'success', text: 'Hero görseli başarıyla yüklendi!' })
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Yükleme başarısız' })
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Yükleme sırasında bir hata oluştu' })
    } finally {
      setUploadingHeroImage(false)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  const handleHeroImageDelete = async () => {
    const imageUrl = editingContent?.image?.url
    if (!imageUrl?.startsWith('/uploads/')) {
      setEditingContent((prev: any) => ({ ...prev, image: { ...prev.image, url: '' } }))
      setSaveMessage({ type: 'success', text: 'Hero görseli kaldırıldı' })
      setTimeout(() => setSaveMessage(null), 2000)
      return
    }
    if (!confirm('Hero görseli silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?')) {
return
}
    setDeletingHeroImage(true)
    setSaveMessage(null)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/upload?url=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setEditingContent((prev: any) => ({ ...prev, image: { ...prev.image, url: '' } }))
        setSaveMessage({ type: 'success', text: 'Hero görseli başarıyla silindi!' })
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Silme başarısız' })
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Silme sırasında bir hata oluştu' })
    } finally {
      setDeletingHeroImage(false)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  // Common props for all editors
  const commonEditorProps = {
    isEditing,
    editingContent,
    currentDefaults,
    expandedStyleFields,
    toggleStyleField,
    updateStyleField,
    resetFieldToDefault,
    resetStylePropertyToDefault,
    isStylePropertyChanged,
    resetAllToDefaults,
    updateField
  }

  const renderEditor = () => {
    // Handle homepage testimonials block separately (it's not a content section)
    if (activeTab === 'homepage-testimonials-block') {
      if (homepageBlockLoading) {
        return (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-500" />
          </div>
        )
      }
      if (!homepageTestimonialBlock) {
        return (
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-yellow-800">Ana sayfada testimonial block bulunamadı.</p>
          </div>
        )
      }
      return (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <TestimonialsBlockEditor
            content={homepageTestimonialBlock}
            onUpdate={handleHomepageBlockUpdate}
          />
        </div>
      )
    }

    const section = getCurrentSection()
    if (!section) {
return null
}

    switch (activeTab) {
      case 'header':
        return (
          <HeaderEditor
            section={section}
            {...commonEditorProps}
            setEditingContent={setEditingContent}
          />
        )
      case 'landing-hero':
        return <LandingHeroEditor section={section} {...commonEditorProps} />
      case 'hero':
        return (
          <HeroEditor
            section={section}
            {...commonEditorProps}
            setEditingContent={setEditingContent}
            uploadingHeroImage={uploadingHeroImage}
            deletingHeroImage={deletingHeroImage}
            handleHeroImageUpload={handleHeroImageUpload}
            handleHeroImageDelete={handleHeroImageDelete}
            setSaveMessage={setSaveMessage}
          />
        )
      case 'services-section':
        return (
          <ServicesSectionEditor
            section={section}
            {...commonEditorProps}
            updateNestedField={updateNestedField}
            uploadingImage={uploadingImage}
            deletingImage={deletingImage}
            handleImageUpload={handleImageUpload}
            handleImageDelete={handleImageDelete}
            setSaveMessage={setSaveMessage}
          />
        )
      case 'about':
        return (
          <AboutEditor
            section={section}
            {...commonEditorProps}
            setEditingContent={setEditingContent}
            uploadingImage={uploadingImage}
            deletingImage={deletingImage}
            handleImageUpload={handleImageUpload}
            handleImageDelete={handleImageDelete}
          />
        )
      case 'contact-section':
        return (
          <ContactSectionEditor
            section={section}
            {...commonEditorProps}
            setEditingContent={setEditingContent}
            isNestedContentChanged={isNestedContentChanged}
            resetNestedContentToDefault={resetNestedContentToDefault}
          />
        )
      case 'footer':
        return (
          <FooterEditor
            section={section}
            {...commonEditorProps}
            setEditingContent={setEditingContent}
            updateNestedField={updateNestedField}
            setSaveMessage={setSaveMessage}
          />
        )
      case 'meta':
        return (
          <MetaEditor
            section={section}
            isEditing={isEditing}
            editingContent={editingContent}
            updateField={updateField}
          />
        )
      default:
        return null
    }
  }

  const renderPreview = () => {
    const section = getCurrentSection()
    if (!section) {
return null
}
    const content = section.content

    switch (activeTab) {
      case 'header':
        return (
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-gray-500">Logo:</span><span className="font-medium">{content.logoEmoji} {content.logoText}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Nav Links:</span><span className="font-medium">{content.navItems?.map((item: any) => item.label).join(' • ')}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">CTA:</span><span className="font-medium">{content.ctaButtonText}</span></div>
          </div>
        )
      case 'landing-hero':
        return (
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-gray-500">Badge:</span><span className="font-medium">{content.badge}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">MainTitle:</span><span className="font-medium">{content.mainTitle}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Highlighted:</span><span className="font-medium text-sage-500">{content.highlightedText}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Description:</span><span className="font-medium text-right max-w-md">{content.description}</span></div>
          </div>
        )
      case 'hero':
        return (
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-gray-500">MainTitle:</span><span className="font-medium">{content.mainTitle}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Subtitle:</span><span className="font-medium text-right max-w-md">{content.subtitle}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">TrustIndicator:</span><span className="font-medium">{content.trustIndicator}</span></div>
          </div>
        )
      case 'services-section':
        return (
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-gray-500">Badge:</span><span className="font-medium">{content.badge}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Başlık:</span><span className="font-medium">{content.sectionTitle} <span className="text-sage-500">{content.highlightedText}</span></span></div>
            <div className="flex justify-between"><span className="text-gray-500">Açıklama:</span><span className="font-medium text-right max-w-md">{content.description}</span></div>
          </div>
        )
      case 'homepage-testimonials-block':
        if (homepageBlockLoading) {
          return <div className="text-gray-500">Yükleniyor...</div>
        }
        if (!homepageTestimonialBlock) {
          return <div className="text-gray-500">Block bulunamadı</div>
        }
        return (
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-gray-500">Başlık:</span><span className="font-medium">{homepageTestimonialBlock.sectionTitle || homepageTestimonialBlock.title || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Yorum Sayısı:</span><span className="font-medium">{homepageTestimonialBlock.testimonials?.length || 0}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Layout:</span><span className="font-medium">{homepageTestimonialBlock.layout || 'default'}</span></div>
          </div>
        )
      default:
        return (
          <pre className="text-sm bg-gray-50 p-4 rounded-xl overflow-auto max-h-64">
            {JSON.stringify(content, null, 2)}
          </pre>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500" />
      </div>
    )
  }

  const currentSection = getCurrentSection()

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/admin/dashboard" className="text-sage-600 hover:text-forest-600 mr-4">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-charcoal">İçerik Yönetimi</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Save Message */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-xl ${saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {saveMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-4">
              <h2 className="text-lg font-semibold text-charcoal mb-4">İçerik Bölümleri</h2>
              <nav className="space-y-2">
                {contentTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (isEditing) {
                        if (confirm('Kaydedilmemiş değişiklikler var. Devam etmek istiyor musunuz?')) {
                          cancelEditing()
                          setActiveTab(tab.id)
                        }
                      } else {
                        setActiveTab(tab.id)
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-sage-100 text-sage-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              {(activeTab === 'homepage-testimonials-block' ? true : currentSection) && (
                <>
                  {activeTab === 'homepage-testimonials-block' ? (
                    <>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h2 className="text-xl font-bold text-charcoal">Ana Sayfa Yorumlar Block</h2>
                          <p className="text-gray-500 text-sm">Ana sayfadaki testimonial block'u düzenleyin</p>
                        </div>
                      </div>
                      {homepageBlockLoading && (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-500" />
                        </div>
                      )}
                      {!homepageBlockLoading && !homepageTestimonialBlock && (
                        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                          <div className="mb-4">
                            <p className="text-yellow-800 mb-2">Ana sayfada testimonial block bulunamadı.</p>
                            <p className="text-yellow-700 text-sm">Homepage'e testimonial block oluşturmak için aşağıdaki butona tıklayın.</p>
                          </div>
                          <button
                            onClick={() => createHomepageTestimonialBlock(false)}
                            disabled={isSavingHomepageBlock}
                            className="flex items-center gap-2 bg-sage-500 hover:bg-forest-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-medium transition-all"
                          >
                            {isSavingHomepageBlock ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                Oluşturuluyor...
                              </>
                            ) : (
                              <>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Testimonial Block Oluştur
                              </>
                            )}
                          </button>
                        </div>
                      )}
                      {!homepageBlockLoading && homepageTestimonialBlock && sourceBlockInfo && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                          <p className="text-blue-800 text-sm mb-2">
                            <strong>Not:</strong> Bu veriler "{sourceBlockInfo.pageTitle}" sayfasındaki testimonial block'tan alınmıştır.
                          </p>
                          <p className="text-blue-700 text-sm mb-4">
                            Ana sayfaya bu block'u kopyalamak için aşağıdaki butona tıklayın.
                          </p>
                          <button
                            onClick={() => createHomepageTestimonialBlock(true)}
                            disabled={isSavingHomepageBlock}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-medium transition-all"
                          >
                            {isSavingHomepageBlock ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                Kopyalanıyor...
                              </>
                            ) : (
                              <>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Ana Sayfaya Kopyala
                              </>
                            )}
                          </button>
                        </div>
                      )}
                      {!homepageBlockLoading && homepageTestimonialBlock && (
                        <>
                          {sourceBlockInfo && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                              <p className="text-blue-800 text-sm">
                                <strong>Kaynak:</strong> Bu veriler "{sourceBlockInfo.pageTitle}" sayfasındaki testimonial block'tan alınmıştır.
                              </p>
                            </div>
                          )}
                          {!isEditingHomepageBlock && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                              <h3 className="text-lg font-semibold text-charcoal mb-4">Önizleme</h3>
                              {renderPreview()}
                            </div>
                          )}

                          {isEditingHomepageBlock && renderEditor()}

                          <div className="flex gap-4 mt-6">
                            {!isEditingHomepageBlock ? (
                              <>
                                {homepageBlockId ? (
                                  <button
                                    onClick={startEditingHomepageBlock}
                                    className="flex items-center gap-2 bg-sage-500 hover:bg-forest-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
                                  >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Düzenle
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={startEditingHomepageBlock}
                                      className="flex items-center gap-2 bg-sage-500 hover:bg-forest-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
                                    >
                                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      Önizle ve Düzenle
                                    </button>
                                    <button
                                      onClick={() => createHomepageTestimonialBlock(true)}
                                      disabled={isSavingHomepageBlock}
                                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-medium transition-all"
                                    >
                                      {isSavingHomepageBlock ? (
                                        <>
                                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                          Kopyalanıyor...
                                        </>
                                      ) : (
                                        <>
                                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                          </svg>
                                          Ana Sayfaya Kopyala
                                        </>
                                      )}
                                    </button>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                {homepageBlockId ? (
                                  <>
                                    <button
                                      onClick={handleSaveHomepageBlock}
                                      disabled={isSavingHomepageBlock}
                                      className="flex items-center gap-2 bg-sage-500 hover:bg-forest-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-medium transition-all"
                                    >
                                      {isSavingHomepageBlock ? (
                                        <>
                                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                          Kaydediliyor...
                                        </>
                                      ) : (
                                        <>
                                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                          Kaydet
                                        </>
                                      )}
                                    </button>
                                    <button
                                      onClick={cancelEditingHomepageBlock}
                                      className="px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-all"
                                    >
                                      İptal
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        createHomepageTestimonialBlock(true).then(() => {
                                          setIsEditingHomepageBlock(false)
                                        })
                                      }}
                                      disabled={isSavingHomepageBlock}
                                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-medium transition-all"
                                    >
                                      {isSavingHomepageBlock ? (
                                        <>
                                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                          Kopyalanıyor...
                                        </>
                                      ) : (
                                        <>
                                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                          </svg>
                                          Ana Sayfaya Kopyala ve Kaydet
                                        </>
                                      )}
                                    </button>
                                    <button
                                      onClick={cancelEditingHomepageBlock}
                                      className="px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-all"
                                    >
                                      İptal
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  ) : currentSection ? (
                    <>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h2 className="text-xl font-bold text-charcoal">{currentSection.title}</h2>
                          <p className="text-gray-500 text-sm">{currentSection.description}</p>
                        </div>
                        <div className="text-right text-sm text-gray-400">
                          <div>Son güncelleme</div>
                          <div className="font-medium">{new Date(currentSection.lastUpdated).toLocaleDateString('de-DE')}</div>
                          <div>von {currentSection.updatedBy}</div>
                        </div>
                      </div>

                      {!isEditing && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                          <h3 className="text-lg font-semibold text-charcoal mb-4">Önizleme</h3>
                          {renderPreview()}
                        </div>
                      )}

                      {isEditing && renderEditor()}

                      <div className="flex gap-4 mt-6">
                        {!isEditing ? (
                          <button
                            onClick={startEditing}
                            className="flex items-center gap-2 bg-sage-500 hover:bg-forest-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Düzenle
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={handleSave}
                              disabled={isSaving}
                              className="flex items-center gap-2 bg-sage-500 hover:bg-forest-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-medium transition-all"
                            >
                              {isSaving ? (
                                <>
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                  Kaydediliyor...
                                </>
                              ) : (
                                <>
                                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Kaydet
                                </>
                              )}
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-all"
                            >
                              İptal
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2">İçerik Bulunamadı</h3>
                      <p className="text-yellow-700 mb-4">
                        "{contentTabs.find(t => t.id === activeTab)?.label || activeTab}" bölümü için içerik bulunamadı.
                      </p>
                      <p className="text-yellow-600 text-sm mb-4">
                        Bu bölüm için içerik oluşturmak için API'den veri gelmesi gerekiyor. Veritabanında bu section için kayıt olup olmadığını kontrol edin.
                      </p>
                      <button
                        onClick={() => {
                          void fetchContent()
                        }}
                        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Yeniden Yükle
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
