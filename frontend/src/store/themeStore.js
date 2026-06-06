import { create } from 'zustand';

export const useThemeStore = create(() => ({
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {}
}));

