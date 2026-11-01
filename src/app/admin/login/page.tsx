'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { buildCloudinaryUrl } from '@/lib/cloudinary/url';
import {
  getAdminSession,
  setAdminSession,
  validateStaticCredentials,
  STATIC_ADMIN_CREDENTIALS,
} from '@/lib/auth/admin-static-auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successUser, setSuccessUser] = useState<string | null>(null);

  // If already logged in, redirect to admin
  useEffect(() => {
    const existing = getAdminSession();
    if (existing) {
      router.replace('/admin');
    }
  }, [router]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    // Simulate brief luxury authentication check
    setTimeout(() => {
      const result = validateStaticCredentials(email, password);

      if (result.success && result.user) {
        setAdminSession(result.user, rememberMe);
        setSuccessUser(result.user.name);
        setTimeout(() => {
          const params = new URLSearchParams(window.location.search);
          const destination = params.get('redirect') || '/admin';
          router.push(destination);
        }, 500);
      } else {
        setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickDemo = (credEmail: string, credPass: string) => {
    setEmail(credEmail);
    setPassword(credPass);
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = validateStaticCredentials(credEmail, credPass);
      if (result.success && result.user) {
        setAdminSession(result.user, true);
        setSuccessUser(result.user.name);
        setTimeout(() => {
          const params = new URLSearchParams(window.location.search);
          const destination = params.get('redirect') || '/admin';
          router.push(destination);
        }, 400);
      } else {
        setIsLoading(false);
      }
    }, 300);
  };

  const loginBackground = buildCloudinaryUrl(
    'kaftan/editorial/hero-mediterranean-resortwear',
    { width: 1400 }
  );

  return (
    <div className="min-h-screen w-full bg-[#F7F4ED] flex flex-col justify-between selection:bg-[#A94F42] selection:text-white">
      {/* Top Brand Bar */}
      <header className="w-full border-b border-[#D8D1C5] bg-[#FAF8F5]/90 backdrop-blur-xs py-3 px-6 sm:px-10 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <span className="font-serif-editorial text-2xl tracking-[0.18em] text-[#25221F] uppercase font-normal group-hover:opacity-85 transition-opacity">
            KAFTAN
          </span>
          <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-[#77716A] border-l border-[#D8D1C5] pl-3 py-0.5">
            Editorial CMS
          </span>
        </Link>

        <Link
          href="/"
          className="text-[10px] font-mono uppercase tracking-wider text-[#77716A] hover:text-[#25221F] transition-colors"
        >
          &larr; Return to Live Site
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 border border-[#D8D1C5] bg-[#FFFEFA] shadow-sm overflow-hidden">
          {/* Left Column: Visual Editorial Pane */}
          <div className="hidden md:block md:col-span-5 relative bg-[#25221F] text-[#FAF8F5]">
            <Image
              src={loginBackground}
              alt="KAFTAN Australia Editorial"
              fill
              priority
              sizes="400px"
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#25221F] via-[#25221F]/40 to-transparent" />

            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
              <div className="flex items-center space-x-2 text-[#A48356]">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-semibold">
                  Restricted Access
                </span>
              </div>

              <div>
                <span className="font-serif-editorial text-3xl font-light leading-tight block mb-2 text-[#FAF8F5]">
                  The World of Women&apos;s Fashion
                </span>
                <p className="text-xs text-[#D8D1C5] font-light leading-relaxed mb-4">
                  Administrative control suite for homepage revisions, luxury product curation, competitions, and live editorial stories.
                </p>
                <div className="text-[10px] font-mono tracking-wider text-[#A48356] uppercase border-t border-white/15 pt-3">
                  Australia &bull; Edition 2026
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Form */}
          <div className="md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-[#FCFAF6]">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9.5px] font-mono uppercase tracking-[0.25em] text-[#A94F42] font-bold">
                  AUTHENTICATION &mdash;
                </span>
                <span className="text-[10px] font-mono text-[#77716A] bg-[#FAF8F5] border border-[#D8D1C5] px-2 py-0.5">
                  Static Auth Mode
                </span>
              </div>

              <h1 className="font-serif-editorial text-2xl sm:text-3xl text-[#25221F] font-normal mb-1">
                Admin &amp; Editorial Login
              </h1>
              <p className="text-xs text-[#77716A] mb-6">
                Enter your staff credentials or use instant demo access to enter the CMS.
              </p>

              {/* Success Notification */}
              {successUser && (
                <div className="mb-6 p-4 border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs flex items-center gap-2.5 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Welcome back, <strong>{successUser}</strong>. Launching admin suite...
                  </span>
                </div>
              )}

              {/* Error Notification */}
              {errorMessage && (
                <div
                  role="alert"
                  className="mb-6 p-4 border border-[#B44238]/40 bg-[#B44238]/10 text-[#8f322a] text-xs flex items-start gap-2.5 animate-fade-in"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#B44238]" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#25221F] font-semibold mb-1.5"
                  >
                    Editorial Staff Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#77716A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@kaftan.fashion"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D8D1C5] text-[#25221F] placeholder:text-[#A8A29A] focus:outline-none focus:border-[#25221F] transition-colors"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#25221F] font-semibold"
                    >
                      Admin Passcode
                    </label>
                    <span className="text-[9px] font-mono text-[#77716A]">Default: kaftan2026</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#77716A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter passcode"
                      className="w-full pl-9 pr-10 py-2.5 text-xs bg-[#FAF8F5] border border-[#D8D1C5] text-[#25221F] placeholder:text-[#A8A29A] focus:outline-none focus:border-[#25221F] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77716A] hover:text-[#25221F] p-1"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#524E48]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded-none border-[#D8D1C5] text-[#25221F] focus:ring-0"
                    />
                    <span className="text-[11px]">Remember session on this device</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 inline-flex items-center justify-center py-3 bg-[#25221F] hover:bg-[#3E3833] text-[#FAF8F5] text-[10px] uppercase tracking-[0.22em] font-semibold transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin text-[#FAF8F5]" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Editorial Suite</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-2" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick One-Click Demo Access */}
              <div className="mt-6 pt-5 border-t border-[#D8D1C5]/70">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#77716A] font-semibold block mb-2.5">
                  Instant One-Click Staff Access:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickDemo(STATIC_ADMIN_CREDENTIALS[0].email, STATIC_ADMIN_CREDENTIALS[0].password)
                    }
                    className="p-2 border border-[#D8D1C5] bg-[#FAF8F5] hover:bg-[#EFEAE0] hover:border-[#25221F] text-left transition-colors text-xs flex flex-col"
                  >
                    <span className="font-semibold text-[#25221F] text-[11px]">Managing Editor</span>
                    <span className="text-[9px] font-mono text-[#77716A] truncate">admin@kaftan.fashion</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleQuickDemo(STATIC_ADMIN_CREDENTIALS[2].email, STATIC_ADMIN_CREDENTIALS[2].password)
                    }
                    className="p-2 border border-[#D8D1C5] bg-[#FAF8F5] hover:bg-[#EFEAE0] hover:border-[#25221F] text-left transition-colors text-xs flex flex-col"
                  >
                    <span className="font-semibold text-[#25221F] text-[11px]">Creative Director</span>
                    <span className="text-[9px] font-mono text-[#77716A] truncate">studio@kaftan.fashion</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Security Note */}
            <div className="mt-6 pt-4 border-t border-[#D8D1C5]/60 flex items-center justify-between text-[10px] text-[#77716A]">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A48356]" />
                <span>Encrypted Local Session</span>
              </div>
              <span className="font-mono">v1.2 CMS</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-[10px] font-mono text-[#77716A] border-t border-[#D8D1C5]">
        &copy; 2026 KAFTAN Publication. All administrative activity is monitored and preserved.
      </footer>
    </div>
  );
}

