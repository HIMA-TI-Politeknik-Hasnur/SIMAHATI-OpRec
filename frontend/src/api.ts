const TOKEN_KEY = 'auth_token';

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

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
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
    const res = await fetch(url, { ...options, headers });
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

export async function apiPost<T>(url: string, body: unknown): Promise<{ data: T | null; error: ApiError | null; status: number }> {
  return apiFetch<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
