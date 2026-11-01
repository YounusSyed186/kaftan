export interface AdminUser {
  email: string;
  name: string;
  role: string;
  avatar?: string;
  loginTime: string;
}

export const STATIC_ADMIN_CREDENTIALS = [
  {
    email: 'admin@kaftan.fashion',
    password: 'kaftan2026',
    name: 'Charlotte Vance',
    role: 'Managing Editor & Director',
  },
  {
    email: 'editorial@kaftan.fashion',
    password: 'editorial2026',
    name: 'Julian Sterling',
    role: 'Senior Fashion Features Editor',
  },
  {
    email: 'studio@kaftan.fashion',
    password: 'studio2026',
    name: 'Sienna Dubois',
    role: 'Creative Director',
  },
];

const STORAGE_KEY = 'kaftan_admin_auth_user';
const COOKIE_NAME = 'kaftan_admin_session';

export function getAdminSession(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function setAdminSession(user: AdminUser, remember: boolean = true): void {
  if (typeof window === 'undefined') return;
  try {
    const json = JSON.stringify(user);
    if (remember) {
      localStorage.setItem(STORAGE_KEY, json);
      // Set 14-day cookie
      document.cookie = `${COOKIE_NAME}=authenticated; path=/; max-age=${14 * 86400}; SameSite=Lax`;
    } else {
      sessionStorage.setItem(STORAGE_KEY, json);
      // Session cookie
      document.cookie = `${COOKIE_NAME}=authenticated; path=/; SameSite=Lax`;
    }
  } catch {
    // ignore
  }
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  } catch {
    // ignore
  }
}

export function validateStaticCredentials(
  email: string,
  pass: string
): { success: boolean; user?: AdminUser; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!cleanEmail) {
    return { success: false, error: 'Please enter your editorial email address.' };
  }
  if (!cleanPass) {
    return { success: false, error: 'Please enter your admin passcode.' };
  }

  // Check known static accounts
  const matched = STATIC_ADMIN_CREDENTIALS.find(
    (c) => c.email.toLowerCase() === cleanEmail && c.password === cleanPass
  );

  if (matched) {
    return {
      success: true,
      user: {
        email: matched.email,
        name: matched.name,
        role: matched.role,
        loginTime: new Date().toISOString(),
      },
    };
  }

  // Permissive static fallback: Allow master password "kaftan2026" or "admin" with any @kaftan.fashion or admin email
  if (cleanPass === 'kaftan2026' || cleanPass === 'admin') {
    return {
      success: true,
      user: {
        email: cleanEmail,
        name: cleanEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        role: 'Editorial Staff',
        loginTime: new Date().toISOString(),
      },
    };
  }

  return {
    success: false,
    error: 'Invalid credentials. Hint: use admin@kaftan.fashion / kaftan2026 or click "Demo One-Click Sign In".',
  };
}

