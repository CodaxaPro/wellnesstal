import { create } from 'zustand';

export type WizardMode = 'ai' | 'manual' | null;
export type WizardStep = 'mode' | 'category' | 'theme' | 'customize' | 'preview';

interface WizardState {
  // Mode
  mode: WizardMode;
  setMode: (mode: WizardMode) => void;

  // Step
  currentStep: WizardStep;
  setStep: (step: WizardStep) => void;

  // Data
  category: string | null;
  theme: string | null;
  customization: Record<string, any>;

  setCategory: (category: string) => void;
  setTheme: (theme: string) => void;
  setCustomization: (key: string, value: any) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  mode: null,
  currentStep: 'mode' as WizardStep,
  category: null,
  theme: null,
  customization: {},
};

export const useWizardStore = create<WizardState>((set) => ({
  ...initialState,

  setMode: (mode) => set({ mode, currentStep: 'category' }),
  setStep: (step) => set({ currentStep: step }),
  
  setCategory: (category) => set({ category }),
  setTheme: (theme) => set({ theme }),
  setCustomization: (key, value) => 
    set((state) => ({
      customization: { ...state.customization, [key]: value }
    })),

  reset: () => set(initialState),
}));