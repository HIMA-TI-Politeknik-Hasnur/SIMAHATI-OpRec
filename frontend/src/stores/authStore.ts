import { create } from 'zustand';
import type { UserData } from '../api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

interface AuthState {
  user: UserData | null;
  token: string | null;
  isSession: boolean;
  setUser: (user: UserData) => void;
  setToken: (token: string) => void;
  setSessionAuth: () => void;
  login: (token: string, user: UserData) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isSession: localStorage.getItem('auth_method') === 'session',

  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user });
  },

  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    set({ token });
  },

  setSessionAuth: () => {
    localStorage.setItem('auth_method', 'session');
    set({ isSession: true, token: null });
  },

  login: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user, isSession: false });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('auth_method');
    set({ user: null, token: null, isSession: false });
  },

  hydrate: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    const isSession = localStorage.getItem('auth_method') === 'session';
    let user: UserData | null = null;
    try {
      user = raw ? JSON.parse(raw) : null;
    } catch {}
    set({ token, user, isSession });
  },
}));
