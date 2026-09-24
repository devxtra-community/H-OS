'use client';

import { useState } from 'react';
import { adminLogin } from '../../../features/admin/api/admin.api';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../../features/admin/admin.auth.provider';
import Image from 'next/image';
import { Eye, EyeOff, Shield, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginSuccess } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await adminLogin(email, password);

      loginSuccess({
        accessToken: res.accessToken,
        admin: res.admin,
      });

      router.push('/admin/dashboard');
    } catch {
      setError('Invalid admin credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT SIDE IMAGE PANEL */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/hospital.jpg"
          alt="Hospital Facility"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-slate-900/40" />

        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3 text-lg font-semibold tracking-wide">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-sm">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span>MedCore <span className="text-indigo-300 font-normal">OS</span></span>
          </div>

          <div className="space-y-5 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-indigo-200 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Centralized System Console
            </div>

            <h2 className="text-4xl font-bold leading-tight tracking-tight">
              Hospital Operations &amp; Facility Control
            </h2>

            <p className="text-white/80 text-base leading-relaxed">
              Complete administrative authority over medical staff provisioning, department configuration, and hospital bed infrastructure.
            </p>

            <div className="flex flex-wrap gap-4 text-xs text-white/90 pt-4 border-t border-white/15">
              <span className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                🔒 Enterprise RBAC
              </span>
              <span className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                ⚡ Real-time Facility Sync
              </span>
              <span className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                🛡 Audit Logging
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE LOGIN PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="w-full max-w-md space-y-8">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
              <Shield size={14} className="text-indigo-600" />
              ADMINISTRATIVE CONSOLE
            </div>

            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Welcome back
            </h1>

            <p className="text-sm text-gray-500">
              Enter your administrator credentials to access the management portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded-xl flex items-center gap-2.5 animate-in fade-in duration-200">
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-3.5 rounded-xl font-medium text-sm transition-all shadow-sm shadow-indigo-200 hover:shadow-md hover:shadow-indigo-300 disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Need assistance or credentials reset?{' '}
              <span className="text-indigo-600 font-medium hover:underline cursor-pointer">
                Contact Hospital IT Support
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}