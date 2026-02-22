'use client';

import { useState } from 'react';
import { registerPatient } from '../../auth/auth.service';
import { useRouter } from 'next/navigation';
import { Eye,EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();

  type Gender = 'MALE' | 'FEMALE' | 'OTHER';

  type RegisterForm = {
    name: string;
    email: string;
    password: string;
    dob: string;
    gender: Gender;
    phone: string;
  };

  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    dob: '',
    gender: 'MALE',
    phone: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function updateField(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerPatient({
        ...form,
        phone: form.phone || undefined,
      });

      router.push('/login');
    } catch {
      setError('Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex bg-white overflow-hidden">

      {/* LEFT SIDE (FORM) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 lg:px-20 py-10">
        <div className="w-full max-w-md space-y-4">

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
              Create account
            </h1>
            <p className="text-gray-500 mt-1">
              Join MedFlow and manage your healthcare digitally
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleRegister} className="space-y-4">

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                required
                className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                required
                className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Password */}
<div>
  <label className="text-sm font-medium text-gray-700">
    Password
  </label>

  <div className="relative mt-1">
    <input
      type={showPassword ? 'text' : 'password'}
      name="password"
      value={form.password}
      onChange={updateField}
      required
      className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>

            {/* DOB + Gender (Side by side for space saving) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={updateField}
                  required
                  className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

<div>
  <label className="text-sm font-medium text-gray-700">
    Gender
  </label>

  <div className="relative mt-1">
    <select
      name="gender"
      value={form.gender}
      onChange={updateField}
      className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
    >
      <option value="MALE">Male</option>
      <option value="FEMALE">Female</option>
      <option value="OTHER">Other</option>
    </select>

    {/* Custom Arrow */}
    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Phone (optional)
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={updateField}
                className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg transition font-medium disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center pt-2">
            Already registered?{' '}
            <Link
              href="/login"
              className="text-teal-600 font-medium hover:underline"
            >
              Sign in
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

        <div className="absolute inset-0 flex items-end p-16">
          <div className="absolute inset-0 bg-linear-to-t from-teal-900/90 via-teal-900/50 via-40% to-transparent" />
          <div className="relative text-white max-w-md space-y-4">
            <h2 className="text-3xl font-semibold leading-tight">
              Healthcare made seamless
            </h2>
            <p className="text-sm text-white/80">
              Register today and experience a smarter way to manage your medical journey.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}