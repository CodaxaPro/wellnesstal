// hooks/usePageStorage.ts
// Save/Load/Export/Import Logic

import { useState, useEffect, useCallback, useRef } from 'react';
import { getTemplateById, DEFAULT_TEMPLATE_ID } from '../templates/registry';

// PageSection type'ını buraya kopyala (geçici)
interface PageSection {
  section: any;
  container: any;
  stacks: any[];
  grids: any[];
}

export type SaveStatus = 'saved' | 'saving' | 'unsaved';

const STORAGE_KEY = 'landing-page-builder-sections';
const LAST_SAVED_KEY = 'landing-page-builder-last-saved';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

interface UsePageStorageReturn {
  saveStatus: SaveStatus;
  isSaving: boolean;
  lastSaved: Date | null;
  loadFromLocalStorage: () => void;
  saveToLocalStorage: (sections: PageSection[]) => void;
  handleManualSave: () => void;
  handleExport: () => void;
  handleImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function usePageStorage(
  sections: PageSection[],
  initialize: (sections: PageSection[]) => void
): UsePageStorageReturn {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const hasLoadedRef = useRef(false);

  /**
   * LocalStorage'dan yükle
   * SADECE İLK MOUNT'TA ÇALIŞIR
   */
  const loadFromLocalStorage = useCallback(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const lastSavedStr = localStorage.getItem(LAST_SAVED_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);
        initialize(parsed);
      } else {
        const defaultTemplate = getTemplateById(DEFAULT_TEMPLATE_ID);
        if (defaultTemplate) {
          initialize(defaultTemplate.sections);
        } else {
          initialize([]);
        }
      }

      if (lastSavedStr) {
        setLastSaved(new Date(lastSavedStr));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      const defaultTemplate = getTemplateById(DEFAULT_TEMPLATE_ID);
      if (defaultTemplate) {
        initialize(defaultTemplate.sections);
      }
    }
  }, [initialize]);

  /**
   * LocalStorage'a kaydet
   */
  const saveToLocalStorage = useCallback((sectionsToSave: PageSection[]) => {
    try {
      setIsSaving(true);
      setSaveStatus('saving');

      const serialized = JSON.stringify(sectionsToSave);
      localStorage.setItem(STORAGE_KEY, serialized);

      const now = new Date();
      localStorage.setItem(LAST_SAVED_KEY, now.toISOString());
      setLastSaved(now);

      setSaveStatus('saved');

      setTimeout(() => {
        setIsSaving(false);
      }, 500);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      setSaveStatus('unsaved');
      setIsSaving(false);
    }
  }, []);

  /**
   * Manual save butonu için
   */
  const handleManualSave = useCallback(() => {
    saveToLocalStorage(sections);
  }, [sections, saveToLocalStorage]);

  /**
   * JSON olarak export et
   */
  const handleExport = useCallback(() => {
    try {
      const dataStr = JSON.stringify(sections, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `landing-page-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting:', error);
    }
  }, [sections]);

  /**
   * JSON dosyasından import et
   */
  const handleImport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const imported = JSON.parse(content);
          initialize(imported);
          saveToLocalStorage(imported);
        } catch (error) {
          console.error('Error importing:', error);
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    },
    [initialize, saveToLocalStorage]
  );

  /**
   * İLK YÜKLEME - Sadece mount'ta çalışır
   */
  useEffect(() => {
    loadFromLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * AUTO-SAVE - 30 saniyede bir
   */
  useEffect(() => {
    if (sections.length === 0) return;

    const interval = setInterval(() => {
      saveToLocalStorage(sections);
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [sections, saveToLocalStorage]);

  /**
   * UNSAVED STATUS - Sections değiştiğinde
   */
  useEffect(() => {
    if (sections.length > 0 && saveStatus === 'saved') {
      setSaveStatus('unsaved');
    }
  }, [sections]);

  return {
    saveStatus,
    isSaving,
    lastSaved,
    loadFromLocalStorage,
    saveToLocalStorage,
    handleManualSave,
    handleExport,
    handleImport,
  };
}