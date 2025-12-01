'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { TeamContent, TeamMember, TeamMemberSkill } from '../../types'
import { SOCIAL_ICONS } from './defaults'

interface MembersTabProps {
  content: TeamContent
  updateContent: (updates: Partial<TeamContent>) => void
}

export default function MembersTab({ content, updateContent }: MembersTabProps) {
  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [expandedSocial, setExpandedSocial] = useState<string | null>(null)
  const [uploadingMemberId, setUploadingMemberId] = useState<string | null>(null)
  const [showImageSettings, setShowImageSettings] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const members = content.members || []

  const addMember = () => {
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: 'Yeni Uye',
      role: 'Pozisyon',
      bio: '',
      image: '',
      social: {},
      order: members.length
    }
    updateContent({ members: [...members, newMember] })
    setEditingMember(newMember.id)
  }

  const updateMember = (id: string, updates: Partial<TeamMember>) => {
    updateContent({
      members: members.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      )
    })
  }

  const deleteMember = (id: string) => {
    updateContent({
      members: members.filter((m) => m.id !== id)
    })
    if (editingMember === id) setEditingMember(null)
  }

  const moveMember = (id: string, direction: 'up' | 'down') => {
    const index = members.findIndex((m) => m.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === members.length - 1)
    ) return

    const newMembers = [...members]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[newMembers[index], newMembers[swapIndex]] = [newMembers[swapIndex], newMembers[index]]
    updateContent({ members: newMembers })
  }

  const duplicateMember = (member: TeamMember) => {
    const newMember: TeamMember = {
      ...member,
      id: `member-${Date.now()}`,
      name: `${member.name} (Kopya)`
    }
    updateContent({ members: [...members, newMember] })
  }

  const addSkill = (memberId: string) => {
    const member = members.find((m) => m.id === memberId)
    if (!member) return
    const newSkill: TeamMemberSkill = {
      id: `skill-${Date.now()}`,
      name: 'Yeni Yetenek',
      level: 80
    }
    updateMember(memberId, {
      skills: [...(member.skills || []), newSkill]
    })
  }

  const updateSkill = (memberId: string, skillId: string, updates: Partial<TeamMemberSkill>) => {
    const member = members.find((m) => m.id === memberId)
    if (!member) return
    updateMember(memberId, {
      skills: (member.skills || []).map((s) =>
        s.id === skillId ? { ...s, ...updates } : s
      )
    })
  }

  const deleteSkill = (memberId: string, skillId: string) => {
    const member = members.find((m) => m.id === memberId)
    if (!member) return
    updateMember(memberId, {
      skills: (member.skills || []).filter((s) => s.id !== skillId)
    })
  }

  // Image Upload Handler
  const handleImageUpload = async (memberId: string, file: File) => {
    if (!file) return

    setUploadingMemberId(memberId)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'team')
      formData.append('alt_text', members.find(m => m.id === memberId)?.name || 'Team Member')

      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      console.log('Upload result:', result)

      if (result.success && result.data?.file_path) {
        updateMember(memberId, { image: result.data.file_path })
      } else if (result.data?.file_path) {
        // Fallback if success flag is missing
        updateMember(memberId, { image: result.data.file_path })
      } else {
        console.error('Unexpected response structure:', result)
        alert('Resim yuklendi ama URL alinamadi')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Resim yukleme basarisiz oldu')
    } finally {
      setUploadingMemberId(null)
    }
  }

  // Delete Image Handler
  const handleDeleteImage = async (memberId: string, imageUrl: string) => {
    try {
      const token = localStorage.getItem('adminToken')

      // Extract filename from URL
      const urlParts = imageUrl.split('/')
      const filename = urlParts[urlParts.length - 1]

      await fetch('/api/media', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ filename, category: 'team' })
      })

      updateMember(memberId, { image: '' })
    } catch (error) {
      console.error('Delete error:', error)
      // Still remove from UI even if delete fails
      updateMember(memberId, { image: '' })
    }
  }

  const triggerFileInput = (memberId: string) => {
    fileInputRefs.current[memberId]?.click()
  }

  return (
    <div className="space-y-4">
      {/* Add Member Button */}
      <button
        onClick={addMember}
        className="w-full py-3 px-4 bg-sage-500 hover:bg-sage-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Yeni Ekip Uyesi Ekle
      </button>

      {/* Members List */}
      {members.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <div className="text-slate-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm">Henuz ekip uyesi eklenmedi</p>
          <p className="text-slate-400 text-xs mt-1">Yukardaki butonu kullanarak ekip uyesi ekleyin</p>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              {/* Member Header */}
              <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setEditingMember(editingMember === member.id ? null : member.id)}
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-400 to-forest-600 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-white text-lg font-bold">{member.name.charAt(0)}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-800 truncate">{member.name}</h4>
                  <p className="text-sm text-slate-500 truncate">{member.role}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => moveMember(member.id, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveMember(member.id, 'down')}
                    disabled={index === members.length - 1}
                    className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => duplicateMember(member)}
                    className="p-1.5 text-slate-400 hover:text-blue-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteMember(member.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Expand Icon */}
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform ${editingMember === member.id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Member Edit Form */}
              {editingMember === member.id && (
                <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-4">
                  {/* Profile Image Upload */}
                  <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <label className="block text-xs font-semibold text-slate-700 mb-3">Profil Resmi</label>

                    <div className="flex gap-4">
                      {/* Image Preview / Upload Area */}
                      <div className="relative group">
                        <div
                          className={`w-32 h-32 rounded-xl overflow-hidden flex items-center justify-center relative ${
                            member.image
                              ? 'bg-slate-100'
                              : 'bg-gradient-to-br from-sage-100 to-sage-200 border-2 border-dashed border-sage-300'
                          }`}
                        >
                          {uploadingMemberId === member.id ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="animate-spin h-8 w-8 border-3 border-sage-500 border-t-transparent rounded-full" />
                              <span className="text-xs text-slate-500">Yukleniyor...</span>
                            </div>
                          ) : member.image ? (
                            <Image
                              src={member.image}
                              alt={member.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="text-center p-2">
                              <svg className="w-8 h-8 mx-auto text-sage-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-xs text-sage-500">Resim Yukle</span>
                            </div>
                          )}
                        </div>

                        {/* Hover Overlay */}
                        {!uploadingMemberId && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                            <button
                              onClick={() => triggerFileInput(member.id)}
                              className="p-2 bg-white hover:bg-slate-100 rounded-lg"
                              title="Resim Yukle"
                            >
                              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </button>
                            {member.image && (
                              <button
                                onClick={() => handleDeleteImage(member.id, member.image!)}
                                className="p-2 bg-red-500 hover:bg-red-600 rounded-lg"
                                title="Resmi Sil"
                              >
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        )}

                        {/* Hidden File Input */}
                        <input
                          ref={(el) => { fileInputRefs.current[member.id] = el }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(member.id, file)
                            e.target.value = ''
                          }}
                        />
                      </div>

                      {/* Image Options */}
                      <div className="flex-1 space-y-3">
                        {/* Upload Button - Always Visible */}
                        <button
                          onClick={() => triggerFileInput(member.id)}
                          disabled={uploadingMemberId === member.id}
                          className="w-full py-2 px-4 bg-sage-500 hover:bg-sage-600 disabled:bg-sage-300 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {uploadingMemberId === member.id ? 'Yukleniyor...' : 'Resim Sec'}
                        </button>

                        <div>
                          <label className="block text-xs text-slate-600 mb-1">veya URL ile ekle</label>
                          <input
                            type="text"
                            value={member.image || ''}
                            onChange={(e) => updateMember(member.id, { image: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                            placeholder="https://..."
                          />
                        </div>

                        {member.image && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowImageSettings(showImageSettings === member.id ? null : member.id)}
                              className="flex-1 py-1.5 text-xs text-sage-600 hover:text-sage-700 border border-sage-200 rounded flex items-center justify-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Ayarlar
                            </button>
                            <button
                              onClick={() => handleDeleteImage(member.id, member.image!)}
                              className="py-1.5 px-3 text-xs text-red-600 hover:text-red-700 border border-red-200 rounded flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Sil
                            </button>
                          </div>
                        )}

                        <p className="text-xs text-slate-400">
                          Onerilen: 400x400px, JPG/PNG, max 2MB
                        </p>
                      </div>
                    </div>

                    {/* Image Settings (Expandable) */}
                    {showImageSettings === member.id && member.image && (
                      <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                        <h4 className="text-xs font-semibold text-slate-700">Resim Ayarlari</h4>

                        {/* Basic Settings */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">Siğdirma</label>
                            <select
                              value={member.imageSettings?.objectFit || 'cover'}
                              onChange={(e) => updateMember(member.id, {
                                imageSettings: {
                                  ...member.imageSettings,
                                  objectFit: e.target.value as 'cover' | 'contain' | 'fill'
                                }
                              })}
                              className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
                            >
                              <option value="cover">Kapla (Cover)</option>
                              <option value="contain">Sigdir (Contain)</option>
                              <option value="fill">Doldur (Fill)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">Pozisyon</label>
                            <select
                              value={member.imageSettings?.position || 'center'}
                              onChange={(e) => updateMember(member.id, {
                                imageSettings: {
                                  ...member.imageSettings,
                                  position: e.target.value as 'center' | 'top' | 'bottom' | 'left' | 'right'
                                }
                              })}
                              className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
                            >
                              <option value="center">Orta</option>
                              <option value="top">Ust</option>
                              <option value="bottom">Alt</option>
                              <option value="left">Sol</option>
                              <option value="right">Sag</option>
                            </select>
                          </div>
                        </div>

                        {/* Scale Slider */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs text-slate-500">Zoom</label>
                            <span className="text-xs text-slate-600 font-medium">
                              {Math.round((member.imageSettings?.scale || 1) * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="200"
                            value={(member.imageSettings?.scale || 1) * 100}
                            onChange={(e) => updateMember(member.id, {
                              imageSettings: {
                                ...member.imageSettings,
                                scale: parseInt(e.target.value) / 100
                              }
                            })}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                          />
                        </div>

                        {/* Brightness & Contrast */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs text-slate-500">Parlaklik</label>
                              <span className="text-xs text-slate-600">{member.imageSettings?.brightness || 100}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="200"
                              value={member.imageSettings?.brightness || 100}
                              onChange={(e) => updateMember(member.id, {
                                imageSettings: {
                                  ...member.imageSettings,
                                  brightness: parseInt(e.target.value)
                                }
                              })}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs text-slate-500">Kontrast</label>
                              <span className="text-xs text-slate-600">{member.imageSettings?.contrast || 100}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="200"
                              value={member.imageSettings?.contrast || 100}
                              onChange={(e) => updateMember(member.id, {
                                imageSettings: {
                                  ...member.imageSettings,
                                  contrast: parseInt(e.target.value)
                                }
                              })}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                            />
                          </div>
                        </div>

                        {/* Grayscale Toggle */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={member.imageSettings?.grayscale || false}
                            onChange={(e) => updateMember(member.id, {
                              imageSettings: {
                                ...member.imageSettings,
                                grayscale: e.target.checked
                              }
                            })}
                            className="w-4 h-4 text-sage-600 rounded"
                          />
                          <span className="text-xs text-slate-600">Siyah-Beyaz</span>
                        </label>

                        {/* Reset Button */}
                        <button
                          onClick={() => updateMember(member.id, { imageSettings: undefined })}
                          className="w-full py-1.5 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded hover:bg-slate-50"
                        >
                          Varsayilana Sifirla
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Isim</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateMember(member.id, { name: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Pozisyon</label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => updateMember(member.id, { role: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Biyografi</label>
                    <textarea
                      value={member.bio || ''}
                      onChange={(e) => updateMember(member.id, { bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      placeholder="Kisa biyografi..."
                    />
                  </div>

                  {/* Department & Location */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Departman</label>
                      <input
                        type="text"
                        value={member.department || ''}
                        onChange={(e) => updateMember(member.id, { department: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        placeholder="Pazarlama"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Lokasyon</label>
                      <input
                        type="text"
                        value={member.location || ''}
                        onChange={(e) => updateMember(member.id, { location: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        placeholder="Istanbul"
                      />
                    </div>
                  </div>

                  {/* Quote */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Alinti</label>
                    <input
                      type="text"
                      value={member.quote || ''}
                      onChange={(e) => updateMember(member.id, { quote: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      placeholder="Favori sozum..."
                    />
                  </div>

                  {/* Featured & Badge */}
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={member.featured || false}
                        onChange={(e) => updateMember(member.id, { featured: e.target.checked })}
                        className="w-4 h-4 text-sage-600 rounded"
                      />
                      <span className="text-sm text-slate-700">One Cikan Uye</span>
                    </label>
                  </div>

                  {/* Social Links */}
                  <div>
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedSocial(expandedSocial === member.id ? null : member.id)}
                    >
                      <label className="block text-xs font-medium text-slate-600">Sosyal Medya Linkleri</label>
                      <svg
                        className={`w-4 h-4 text-slate-400 transition-transform ${expandedSocial === member.id ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {expandedSocial === member.id && (
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        {SOCIAL_ICONS.map((social) => (
                          <div key={social.id} className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                              {social.icon}
                            </span>
                            <input
                              type="text"
                              value={(member.social as Record<string, string | undefined>)?.[social.id] || ''}
                              onChange={(e) =>
                                updateMember(member.id, {
                                  social: { ...member.social, [social.id]: e.target.value }
                                })
                              }
                              className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs"
                              placeholder={social.label}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-medium text-slate-600">Yetenekler</label>
                      <button
                        onClick={() => addSkill(member.id)}
                        className="text-xs text-sage-600 hover:text-sage-700"
                      >
                        + Yetenek Ekle
                      </button>
                    </div>
                    {(member.skills || []).length > 0 && (
                      <div className="space-y-2">
                        {(member.skills || []).map((skill) => (
                          <div key={skill.id} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => updateSkill(member.id, skill.id, { name: e.target.value })}
                              className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs"
                              placeholder="Yetenek adi"
                            />
                            <input
                              type="number"
                              value={skill.level || 80}
                              onChange={(e) => updateSkill(member.id, skill.id, { level: parseInt(e.target.value) })}
                              min={0}
                              max={100}
                              className="w-16 px-2 py-1.5 border border-slate-200 rounded text-xs"
                            />
                            <span className="text-xs text-slate-400">%</span>
                            <button
                              onClick={() => deleteSkill(member.id, skill.id)}
                              className="p-1 text-slate-400 hover:text-red-500"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Members Count */}
      {members.length > 0 && (
        <div className="text-center text-sm text-slate-500">
          Toplam {members.length} ekip uyesi
        </div>
      )}
    </div>
  )
}
