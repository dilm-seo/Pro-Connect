import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  openaiApiKey: string;
  setOpenaiApiKey: (key: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      openaiApiKey: '',
      setOpenaiApiKey: (key) => set({ openaiApiKey: key }),
    }),
    {
      name: 'settings-storage',
    }
  )
);