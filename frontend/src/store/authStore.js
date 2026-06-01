/**
 * Auth Store — Zustand
 * Manages user, tokens, login, logout, and rehydration from localStorage
 */

import { create } from 'zustand';
import { authApi } from '../api/auth.api';
import api from '../api/axios';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  /** Called on app mount — restores session from localStorage */
  rehydrate: () => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      const parsed = JSON.parse(user);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ user: parsed, accessToken: token, isAuthenticated: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user, accessToken, refreshToken } = await authApi.login(email, password);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      set({ error: msg, isLoading: false });
      return { success: false, message: msg };
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { user, accessToken, refreshToken } = await authApi.register(data);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      set({ error: msg, isLoading: false });
      return { success: false, message: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },

  updateUser: (updates) => {
    const updated = { ...get().user, ...updates };
    localStorage.setItem('user', JSON.stringify(updated));
    set({ user: updated });
  },
}));
