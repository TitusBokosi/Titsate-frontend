const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY;
const USER_KEY = import.meta.env.VITE_USER_KEY;
const TEMP_KEY = import.meta.env.VITE_TEMP_KEY;

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: 'STUDENT' | 'CREATOR' | 'SUPER_CREATOR' | 'ADMIN';
}

/* ---------------- Persistent Auth Session ---------------- */

export function setAuthSession({
  accessToken,
  user,
  persist = true,
}: {
  accessToken?: string;
  user?: User;
  persist?: boolean;
}) {
  const storage = persist ? localStorage : sessionStorage;
  if (accessToken) storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (user) storage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function getToken(): string | null {
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    sessionStorage.getItem(ACCESS_TOKEN_KEY)
  );
}

export function getStoredUser(): User | null {
  try {
    const user =
      localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

/* ---------------- Temporary Session ---------------- */

export function setTempSession(updates: Record<string, any>) {
  const existing = getTempSession() || {};
  sessionStorage.setItem(TEMP_KEY, JSON.stringify({ ...existing, ...updates }));
}

export function getTempSession(): Record<string, any> | null {
  try {
    const raw = sessionStorage.getItem(TEMP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearTempSession() {
  sessionStorage.removeItem(TEMP_KEY);
}
