'use client';

import { useState } from 'react';
import { registerPatient } from '../../../auth/auth.service';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
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
              Healthcare made seamless
            </h2>

            <p className="text-white/80">
              Join thousands of patients using MedFlow
              to manage appointments and medical history
              securely and efficiently.
            </p>

            <div className="flex gap-6 text-sm text-white/80 pt-6">
              <span>🔒 Secure</span>
              <span>⚡ Instant Booking</span>
              <span>🛡 Protected Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 lg:px-20 py-10">
        <div className="w-full max-w-md space-y-6">

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <UserPlus size={16} />
              PATIENT REGISTRATION
            </div>

            <h1 className="text-3xl font-semibold text-gray-900">
              Create account
            </h1>

            <p className="text-gray-500">
              Join MedFlow and manage your healthcare digitally
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">

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
                className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
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
                className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={updateField}
                  required
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

            {/* DOB + Gender */}
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
                  className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={updateField}
                  className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
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
                className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
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
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center pt-4">
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

    </div>
  );
}