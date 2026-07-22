const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
// Kosongkan agar Vite proxy yang handle /api → localhost:8000
// Ganti ke URL production saat deploy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
export { API_BASE_URL };

export interface UserData {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions?: string[];
  peserta_id?: number | null;
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function getStoredUser(): UserData | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserData): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeStoredUser(): void {
  localStorage.removeItem(USER_KEY);
}

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

interface ApiResponse<T> {
  data?: T;
  error?: { message: string; errors?: Record<string, string[]> };
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: ApiError | null; status: number }> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(API_BASE_URL + url, { ...options, headers });
    const json = await res.json();

    if (!res.ok) {
      return {
        data: null,
        error: { message: json.message || 'Terjadi kesalahan.', errors: json.errors },
        status: res.status,
      };
    }

    return { data: json as T, error: null, status: res.status };
  } catch {
    return {
      data: null,
      error: { message: 'Gagal terhubung ke server. Pastikan backend sudah berjalan.' },
      status: 0,
    };
  }
}

export async function apiGet<T>(url: string): Promise<{ data: T | null; error: ApiError | null; status: number }> {
  return apiFetch<T>(url, { method: 'GET' });
}

export async function apiPost<T>(url: string, body: unknown): Promise<{ data: T | null; error: ApiError | null; status: number }> {
  return apiFetch<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// --- Refresh Token ---
export async function refreshAuthToken(): Promise<string | null> {
  const res = await apiPost<{ success: boolean; data: { token: string } }>('/api/refresh-token', undefined);
  if (res.data?.data?.token) {
    setAuthToken(res.data.data.token);
    return res.data.data.token;
  }
  return null;
}

// --- Session-based auth ---
export async function fetchCsrfCookie(): Promise<boolean> {
  try {
    await fetch(API_BASE_URL + '/sanctum/csrf-cookie', { method: 'GET', credentials: 'include' });
    return true;
  } catch {
    return false;
  }
}

export async function sessionFetch<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(API_BASE_URL + url, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
    const json = await res.json();
    if (!res.ok) return { error: { message: json.message || 'Terjadi kesalahan.' } };
    return { data: json as T };
  } catch {
    return { error: { message: 'Gagal terhubung ke server.' } };
  }
}

export async function sessionPost<T>(url: string, body?: Record<string, unknown>): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    const res = await fetch(API_BASE_URL + url, { method: 'POST', headers, body: body ? JSON.stringify(body) : undefined, credentials: 'include' });
    const json = await res.json();
    if (!res.ok) return { error: { message: json.message || 'Terjadi kesalahan.', errors: json.errors as Record<string, string[]> } };
    return { data: json as T };
  } catch {
    return { error: { message: 'Gagal terhubung ke server.' } };
  }
}

export function isSessionAuth(): boolean {
  return localStorage.getItem('auth_method') === 'session';
}

export function setSessionAuth(): void {
  localStorage.setItem('auth_method', 'session');
}

export function clearAuth(): void {
  removeAuthToken();
  removeStoredUser();
  localStorage.removeItem('auth_method');
}
