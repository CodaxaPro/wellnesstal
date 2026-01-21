// src/app/editor/[siteId]/store/useContentStore.ts

'use client';

import { create } from 'zustand';

export type SectionType = 'header' | 'hero' | 'features' | 'services' | 'cta' | 'footer';

export interface Section {
  id: string;
  type: SectionType;
  variant: string;
  order: number;
  visible: boolean;
  content: Record<string, any>;
}

export interface ContentData {
  businessName: string;
  sections: Section[];
}

interface ContentStore {
  content: ContentData;
  isEditMode: boolean;
  activeField: string | null;

  setEditMode: (mode: boolean) => void;
  setActiveField: (field: string | null) => void;
  updateContent: (path: string, value: any) => void;
  resetContent: () => void;

  addSection: (type: SectionType, variant: string, afterId?: string) => void;
  removeSection: (id: string) => void;
  duplicateSection: (id: string) => void;
  reorderSections: (sections: Section[]) => void;
  toggleSectionVisibility: (id: string) => void;

  loadFromWizard: (wizardData: any) => void;
}

const defaultContent: ContentData = {
  businessName: 'Your Business',
  sections: [],
};

export const useContentStore = create<ContentStore>((set) => ({
  content: defaultContent,
  isEditMode: false,
  activeField: null,

  setEditMode: (mode) => set({ isEditMode: mode }),

  setActiveField: (field) => set({ activeField: field }),

  updateContent: (path, value) => {
    console.log('📝 updateContent:', path, '=', typeof value === 'object' ? '{...}' : value);
    return set((state) => {
      const keys = path.split('.');

      // businessName (top-level)
      if (keys[0] === 'businessName') {
        return { content: { ...state.content, businessName: value } };
      }

      // Simple section update: hero.title, hero.titleConfig, hero.imageConfig, etc.
      if (keys.length === 2) {
        const [sectionType, field] = keys;
        const sections = [...state.content.sections];
        const sectionIndex = sections.findIndex(s => s.type === sectionType);

        if (sectionIndex !== -1 && sections[sectionIndex] && typeof field === 'string') {
          const currentSection = sections[sectionIndex]
          sections[sectionIndex] = {
            ...currentSection,
            content: {
              ...currentSection.content,
              [field]: value,
            },
          };

          console.log('✅ Updated:', sectionType, field, typeof value);
          return { content: { ...state.content, sections } };
        }
      }

      // Nested section updates: sections.hero-1.content.title
      if (keys[0] === 'sections' && keys.length >= 4) {
        const sectionId = keys[1];
        const sections = [...state.content.sections];
        const sectionIndex = sections.findIndex(s => s.id === sectionId);

        if (sectionIndex !== -1 && sections[sectionIndex]) {
          const section = { ...sections[sectionIndex] };
          let current: any = section;

          for (let i = 2; i < keys.length - 1; i++) {
            const key = keys[i]
            if (key && current) {
              current = current[key];
            }
          }
          const lastKey = keys[keys.length - 1]
          if (lastKey && current) {
            current[lastKey] = value;
          }

          sections[sectionIndex] = section;
          return { content: { ...state.content, sections } };
        }
      }

      console.warn(`⚠️ updateContent: Path not handled: ${path}`);
      return state;
    });
  },

  resetContent: () => set({ content: defaultContent }),

  loadFromWizard: (wizardData) => set((state) => {
    console.log('🔄 loadFromWizard CALLED');
    console.log('📥 wizardData:', wizardData);
    console.log('📊 Current sections:', state.content.sections.length);

    if (!wizardData?.customization) {
      console.error('❌ Invalid wizardData');
      return state;
    }

    console.log('🧩 Customization:', wizardData.customization);

    const newContent: ContentData = {
      businessName: wizardData.content?.businessName || 'Your Business',
      sections: [],
    };

    const customization = wizardData.customization;
    const newSections: Section[] = [];
    let order = 0;

    // Header
    if (customization.header) {
      console.log('➕ Adding header:', customization.header);
      newSections.push({
        id: 'header-1',
        type: 'header',
        variant: customization.header,
        order: order++,
        visible: true,
        content: {
          ctaText: wizardData.content?.header?.ctaText || 'Book Now',
        },
      });
    }

    // Hero
    if (customization.hero) {
      console.log('➕ Adding hero:', customization.hero);
      newSections.push({
        id: 'hero-1',
        type: 'hero',
        variant: customization.hero,
        order: order++,
        visible: true,
        content: {
          title: wizardData.content?.hero?.title || 'Welcome to Your Business',
          subtitle: wizardData.content?.hero?.subtitle || 'Premium services designed for you',
          ctaText: wizardData.content?.hero?.ctaText || 'Get Started',
          image: wizardData.content?.hero?.image || 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800',
        },
      });
    }

    // Features
    if (customization.features) {
      console.log('➕ Adding features:', customization.features);
      newSections.push({
        id: 'features-1',
        type: 'features',
        variant: customization.features,
        order: order++,
        visible: true,
        content: {
          title: wizardData.content?.features?.title || 'Why Choose Us',
          subtitle: wizardData.content?.features?.subtitle || 'Discover what makes us different',
        },
      });
    }

    // Services
    if (customization.services) {
      console.log('➕ Adding services:', customization.services);
      newSections.push({
        id: 'services-1',
        type: 'services',
        variant: customization.services,
        order: order++,
        visible: true,
        content: {
          title: wizardData.content?.services?.title || 'Our Services',
          subtitle: wizardData.content?.services?.subtitle || 'Choose the perfect package for you',
        },
      });
    }

    // CTA
    if (customization.cta) {
      console.log('➕ Adding cta:', customization.cta);
      newSections.push({
        id: 'cta-1',
        type: 'cta',
        variant: customization.cta,
        order: order++,
        visible: true,
        content: {
          title: wizardData.content?.cta?.title || 'Ready to Get Started?',
          subtitle: wizardData.content?.cta?.subtitle || 'Join thousands of satisfied customers',
          ctaText: wizardData.content?.cta?.ctaText || 'Book Appointment',
        },
      });
    }

    // Footer
    if (customization.footer) {
      console.log('➕ Adding footer:', customization.footer);
      newSections.push({
        id: 'footer-1',
        type: 'footer',
        variant: customization.footer,
        order: order++,
        visible: true,
        content: {
          phone: wizardData.content?.footer?.phone || '+1 (555) 123-4567',
          email: wizardData.content?.footer?.email || 'info@yourbusiness.com',
          address: wizardData.content?.footer?.address || '123 Main St, City, State 12345',
        },
      });
    }

    newContent.sections = newSections;

    console.log('✅ Created sections:', newSections.length);
    console.log('📋 Sections:', newSections.map(s => `${s.type}:${s.variant}`));

    return { content: newContent };
  }),

  addSection: (type, variant, afterId) => set((state) => {
    const sections = [...state.content.sections];
    const newId = `${type}-${Date.now()}`;

    let insertIndex = sections.length;
    if (afterId) {
      const afterIndex = sections.findIndex(s => s.id === afterId);
      if (afterIndex !== -1) {
        insertIndex = afterIndex + 1;
      }
    }

    const getDefaultContent = (sectionType: SectionType) => {
      switch (sectionType) {
        case 'header':
          return { ctaText: 'Book Now' };
        case 'hero':
          return {
            title: 'New Hero Title',
            subtitle: 'New subtitle',
            ctaText: 'Click Here',
            image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800'
          };
        case 'features':
          return { title: 'New Features', subtitle: 'Feature subtitle' };
        case 'services':
          return { title: 'New Services', subtitle: 'Service subtitle' };
        case 'cta':
          return { title: 'Call to Action', subtitle: 'CTA subtitle', ctaText: 'Get Started' };
        case 'footer':
          return { phone: '+1 (555) 000-0000', email: 'new@example.com', address: 'Address' };
        default:
          return {};
      }
    };

    const defaultContent = getDefaultContent(type)
    const newSection: Section = {
      id: newId,
      type,
      variant,
      order: insertIndex,
      visible: true,
      content: defaultContent,
    };

    sections.splice(insertIndex, 0, newSection);
    sections.forEach((s, i) => {
 s.order = i;
});

    return { content: { ...state.content, sections } };
  }),

  removeSection: (id) => set((state) => {
    const sections = state.content.sections.filter(s => s.id !== id);
    sections.forEach((s, i) => {
 s.order = i;
});
    return { content: { ...state.content, sections } };
  }),

  duplicateSection: (id) => set((state) => {
    const sections = [...state.content.sections];
    const index = sections.findIndex(s => s.id === id);

    if (index !== -1 && sections[index]) {
      const original = sections[index];
      const duplicate: Section = {
        id: `${original.type}-${Date.now()}`,
        type: original.type,
        variant: original.variant,
        order: index + 1,
        visible: original.visible,
        content: { ...original.content },
      };

      sections.splice(index + 1, 0, duplicate);
      sections.forEach((s, i) => {
        s.order = i;
      });
    }

    return { content: { ...state.content, sections } };
  }),

  reorderSections: (newSections) => set((state) => {
    const sections = newSections.map((s, i) => ({ ...s, order: i }));
    return { content: { ...state.content, sections } };
  }),

  toggleSectionVisibility: (id) => set((state) => {
    const sections = state.content.sections.map(s =>
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    return { content: { ...state.content, sections } };
  }),
}));

if (typeof window !== 'undefined') {
  useContentStore.subscribe((state) => {
    console.log('🔔 Store changed - sections:', state.content.sections.length);
  });
}

export const getSectionById = (sections: Section[], id: string) => {
  return sections.find(s => s.id === id);
};

export const getSectionsByType = (sections: Section[], type: SectionType) => {
  return sections.filter(s => s.type === type);
};
