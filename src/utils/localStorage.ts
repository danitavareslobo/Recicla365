import type { User, Theme } from '../types';

const STORAGE_KEYS = {
  USER: '@ecopontos:user',
  TOKEN: '@ecopontos:token',
  THEME: '@ecopontos:theme',
} as const;

export const localStorage = {
  setUser: (user: Omit<User, 'password'>): void => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar usuário no localStorage:', error);
    }
  },

  getUser: (): Omit<User, 'password'> | null => {
    try {
      const userData = window.localStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao recuperar usuário do localStorage:', error);
      return null;
    }
  },

  removeUser: (): void => {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Erro ao remover usuário do localStorage:', error);
    }
  },

  setToken: (token: string): void => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error('Erro ao salvar token no localStorage:', error);
    }
  },

  getToken: (): string | null => {
    try {
      return window.localStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Erro ao recuperar token do localStorage:', error);
      return null;
    }
  },

  removeToken: (): void => {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Erro ao remover token do localStorage:', error);
    }
  },

  setTheme: (theme: Theme): void => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Erro ao salvar tema no localStorage:', error);
    }
  },

  getTheme: (): Theme | null => {
    try {
      const theme = window.localStorage.getItem(STORAGE_KEYS.THEME);
      return theme as Theme | null;
    } catch (error) {
      console.error('Erro ao recuperar tema do localStorage:', error);
      return null;
    }
  },

  clear: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        window.localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
    }
  },

  isAvailable: (): boolean => {
    try {
      const test = '__localStorage_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },
};