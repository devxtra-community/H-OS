'use client';

import { useState } from 'react';
import { loginPatient } from '../../auth/auth.service';
import { useAuth } from '../../auth/auth.provider';
import { useRouter } from 'next/navigation';
import { Eye,EyeOff } from 'lucide-react';
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
      
      {/* LEFT SIDE (FORM) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 lg:px-20 py-16">
        <div className="w-full max-w-md space-y-6">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center text-white font-semibold">
              +
            </div>
            <span className="text-lg font-semibold text-gray-800">
              MedFlow
            </span>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Welcome back
            </h1>
            <p className="text-gray-500 mt-2">
              Sign in to your MedFlow account
            </p>
          </div>

          {/* Google Button */}
<button
  type="button"
  className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
>
  <svg
    className="w-5 h-5"
    viewBox="0 0 48 48"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.7 1.22 9.19 3.6l6.85-6.85C35.91 2.73 30.42 0 24 0 14.64 0 6.56 5.4 2.56 13.28l7.98 6.19C12.27 13.09 17.65 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.5 24.5c0-1.63-.14-3.19-.4-4.68H24v9.06h12.68c-.55 2.96-2.24 5.47-4.77 7.16l7.35 5.72C43.73 37.32 46.5 31.47 46.5 24.5z"
    />
    <path
      fill="#FBBC05"
      d="M10.54 28.47A14.45 14.45 0 019.5 24c0-1.55.27-3.04.75-4.47l-7.98-6.19A23.98 23.98 0 000 24c0 3.9.93 7.59 2.56 10.72l7.98-6.25z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.14 15.91-5.82l-7.35-5.72c-2.04 1.37-4.65 2.18-8.56 2.18-6.35 0-11.73-3.59-13.46-8.78l-7.98 6.25C6.56 42.6 14.64 48 24 48z"
    />
  </svg>

  <span className="text-sm font-medium text-gray-700">
    Continue with Google
  </span>
</button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* FORM */}
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
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
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
      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>
</div>

            {/* Error */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg transition font-medium disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Footer */}
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

      {/* RIGHT SIDE (IMAGE PANEL) */}
      <div className="hidden lg:block lg:w-1/2 relative">
<Image
  src="/hospital.jpg"
  alt="Hospital"
  fill
  priority
  sizes="(max-width: 1024px) 0px, 50vw"
  className="object-cover"
/>

        {/* Overlay */}
{/* Overlay */}
<div className="absolute inset-0 flex items-end p-16">

  {/* Bottom Fade Gradient */}
  <div className="absolute inset-0 bg-linear-to-t from-teal-900/90 via-teal-900/50 via-40% to-transparent" />

  {/* Content */}
  <div className="relative text-white max-w-md space-y-4">
    <h2 className="text-3xl font-semibold leading-tight">
      Streamline your hospital operations
    </h2>
    <p className="text-sm text-white/80">
      A unified platform to manage patients, staff schedules,
      billing, and more — designed for modern healthcare teams.
    </p>

    <div className="flex items-center gap-2 pt-4">
      <div className="flex -space-x-2">
        <div className="w-8 h-8 rounded-full bg-white/30 border border-white/50" />
        <div className="w-8 h-8 rounded-full bg-white/30 border border-white/50" />
        <div className="w-8 h-8 rounded-full bg-white/30 border border-white/50" />
      </div>
      <span className="text-sm text-white/80">
        Trusted by 2,000+ healthcare professionals
      </span>
    </div>
  </div>

</div>
      </div>

    </div>
  );
}