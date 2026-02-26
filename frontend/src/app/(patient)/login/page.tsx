'use client';

import { useState } from 'react';
import { loginPatient } from '../../../auth/auth.service';
import { useAuth } from '../../../auth/auth.provider';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const { loginSuccess } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginPatient(email, password);
      loginSuccess(data);
      router.push('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white">

      {/* LEFT IMAGE PANEL */}
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
            MedFlow
          </div>

          <div className="space-y-4 max-w-md">
            <h2 className="text-4xl font-bold leading-tight">
              Streamline your hospital operations
            </h2>

            <p className="text-white/80">
              A unified platform to manage appointments,
              prescriptions, billing, and more — built for modern healthcare.
            </p>

            <div className="flex gap-6 text-sm text-white/80 pt-6">
              <span>🔒 Secure Access</span>
              <span>⚡ Fast Booking</span>
              <span>🛡 Data Protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 lg:px-20">
        <div className="w-full max-w-md space-y-6">

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User size={16} />
              PATIENT PORTAL
            </div>

            <h1 className="text-3xl font-semibold text-gray-900">
              Welcome back
            </h1>

            <p className="text-gray-500">
              Sign in to manage your appointments
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@hospital.com"
                className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-teal-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative mt-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
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
          </form>

          <p className="text-sm text-gray-500 text-center pt-4">
            Don’t have an account?{' '}
            <Link
              href="/register"
              className="text-teal-600 font-medium hover:underline"
            >
              Create account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}