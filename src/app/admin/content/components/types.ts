// Shared types for content management

export interface ContentSection {
  id: string
  section: string
  title: string
  description: string
  content: any
  defaults?: any
  lastUpdated: string
  updatedBy: string
}

export interface TextStyle {
  fontFamily: string
  fontSize: string
  fontWeight: string
  color: string
  backgroundColor?: string
  borderColor?: string
}

export interface IconStyle {
  backgroundColor: string
  iconColor: string
}

export interface SaveMessage {
  type: 'success' | 'error'
  text: string
}

// Common props for all editors
export interface EditorProps {
  section: ContentSection
  editingContent: any
  setEditingContent: (content: any) => void
  currentDefaults: any
  expandedStyleFields: string[]
  toggleStyleField: (fieldName: string) => void
  updateField: (field: string, value: any) => void
  updateNestedField: (parent: string, field: string, value: any) => void
  updateStyleField: (fieldName: string, styleKey: string, value: string) => void
  resetFieldToDefault: (fieldName: string) => void
  resetStylePropertyToDefault: (fieldName: string, propertyName: string) => void
  isStylePropertyChanged: (fieldName: string, propertyName: string) => boolean
  isNestedContentChanged?: (path: string) => boolean
  resetNestedContentToDefault?: (path: string) => void
  renderStyleEditor: (fieldName: string, label: string, hasBackground?: boolean, hasBorder?: boolean) => JSX.Element
  renderIconStyleEditor?: (fieldName: string, label: string) => JSX.Element
}

// Hero editor specific props
export interface HeroEditorProps extends EditorProps {
  uploadingHeroImage: boolean
  deletingHeroImage: boolean
  handleHeroImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleHeroImageDelete: () => void
}

// About editor specific props
export interface AboutEditorProps extends EditorProps {
  uploadingImage: number | null
  deletingImage: number | null
  handleImageUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void
  handleImageDelete: (index: number) => void
}
