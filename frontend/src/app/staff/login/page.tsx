'use client';

import { useState } from 'react';
import { loginStaff } from '../../../staff/auth/staff.auth.service';
import { useStaffAuth } from '../../../staff/auth/staff.auth.provider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Shield } from 'lucide-react';

export default function StaffLoginPage() {
  const { loginSuccess } = useStaffAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginStaff(email, password);
      loginSuccess(data);
      router.push('/staff/dashboard');
    } catch {
      setError('Invalid email or password');
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
          alt="Hospital"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center">
              +
            </div>
            MedCore
          </div>

          <div className="space-y-4 max-w-md">
            <h2 className="text-4xl font-bold leading-tight">
              Empowering Healthcare,
              <br />
              One Click at a Time
            </h2>

            <p className="text-white/80">
              Streamlined hospital operations, patient management,
              and clinical workflows — all in one secure platform.
            </p>

            <div className="flex gap-6 text-sm text-white/80 pt-6">
              <span>🔒 HIPAA Compliant</span>
              <span>⚡ Real-time Sync</span>
              <span>🛡 256-bit Encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE LOGIN PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 lg:px-20">
        <div className="w-full max-w-md space-y-6">

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield size={16} />
              STAFF PORTAL
            </div>

            <h1 className="text-3xl font-semibold text-gray-900">
              Welcome back
            </h1>

            <p className="text-gray-500">
              Sign in to access the hospital management system
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Staff Email
              </label>
              <input
                type="email"
                required
                placeholder="name@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-teal-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative mt-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 p-3 text-sm text-red-600 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center text-sm text-gray-500 pt-4">
              Having trouble signing in?{' '}
              <span className="text-teal-600 cursor-pointer hover:underline">
                Contact IT Support
              </span>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}