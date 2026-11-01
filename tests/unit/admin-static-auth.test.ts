import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateStaticCredentials,
  getAdminSession,
  setAdminSession,
  clearAdminSession,
  STATIC_ADMIN_CREDENTIALS,
} from '@/lib/auth/admin-static-auth';

describe('Admin Static Authentication', () => {
  beforeEach(() => {
    clearAdminSession();
  });

  it('authenticates predefined managing editor credentials', () => {
    const cred = STATIC_ADMIN_CREDENTIALS[0];
    const res = validateStaticCredentials(cred.email, cred.password);
    expect(res.success).toBe(true);
    expect(res.user).toBeDefined();
    expect(res.user?.email).toBe(cred.email);
    expect(res.user?.role).toBe(cred.role);
  });

  it('authenticates creative director credentials', () => {
    const cred = STATIC_ADMIN_CREDENTIALS[2];
    const res = validateStaticCredentials(cred.email, cred.password);
    expect(res.success).toBe(true);
    expect(res.user?.role).toBe('Creative Director');
  });

  it('rejects incorrect passcodes with helpful feedback', () => {
    const res = validateStaticCredentials('admin@kaftan.fashion', 'wrongpass123');
    expect(res.success).toBe(false);
    expect(res.error).toContain('Invalid credentials');
  });

  it('rejects empty input fields', () => {
    const noEmail = validateStaticCredentials('', 'kaftan2026');
    expect(noEmail.success).toBe(false);
    expect(noEmail.error).toContain('email');

    const noPass = validateStaticCredentials('admin@kaftan.fashion', '');
    expect(noPass.success).toBe(false);
    expect(noPass.error).toContain('passcode');
  });

  it('allows staff login with master passcode kaftan2026', () => {
    const res = validateStaticCredentials('guest.editor@kaftan.fashion', 'kaftan2026');
    expect(res.success).toBe(true);
    expect(res.user?.email).toBe('guest.editor@kaftan.fashion');
  });

  it('persists and clears static admin session', () => {
    expect(getAdminSession()).toBeNull();

    setAdminSession({
      email: 'admin@kaftan.fashion',
      name: 'Charlotte Vance',
      role: 'Managing Editor',
      loginTime: new Date().toISOString(),
    });

    const activeSession = getAdminSession();
    expect(activeSession).not.toBeNull();
    expect(activeSession?.email).toBe('admin@kaftan.fashion');
    expect(activeSession?.name).toBe('Charlotte Vance');

    clearAdminSession();
    expect(getAdminSession()).toBeNull();
  });
});

