'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-12 rounded-2xl shadow-lg w-full max-w-md space-y-8 text-center">
        <h1 className="text-3xl font-bold">
          H-OS Hospital System
        </h1>

        <p className="text-gray-500">
          Log in to your system
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Patient Login
          </button>

          <button
            onClick={() => router.push('/staff/login')}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-semibold transition"
          >
            Staff Login
          </button>
                    <button
            onClick={() => router.push('/admin/login')}
            className="w-full bg-red-800 hover:bg-red-900 text-white py-3 rounded-lg font-semibold transition"
          >
            admin Login
          </button>
        </div>
      </div>
    </div>
  );
}