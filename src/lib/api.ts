'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

export class ApiError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message);
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

/**
 * Thin fetch wrapper: attaches the bearer token, unwraps the backend's
 * { success, data } envelope, and normalizes errors to ApiError so every
 * screen can handle failures the same way.
 *
 * Trade-off (documented in ARCHITECTURE.md): the token is kept in
 * localStorage rather than an httpOnly cookie. That's simpler for this
 * assessment's scope but is readable by any script on the page (XSS risk);
 * a production build should move to httpOnly cookies + CSRF protection.
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  let body: any = null;
  try {
    body = await response.json();
  } catch {
    // no body (e.g. some error responses) — leave body null
  }

  if (!response.ok) {
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message || 'Request failed';
    throw new ApiError(message, response.status);
  }

  return (body?.data ?? body) as T;
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  del: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
  upload: <T>(path: string, formData: FormData) => apiFetch<T>(path, { method: 'POST', body: formData }),
};
