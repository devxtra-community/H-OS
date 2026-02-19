'use client';

import { useAuth } from '../../auth/auth.provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { auth, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isRestoring && !auth.accessToken) {
      router.replace('/login');
    }
  }, [auth.isRestoring, auth.accessToken, router]);

if (auth.isRestoring) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
    </div>
  );
}


  if (!auth.accessToken) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <div>
        <button className="bg-red-500 text-1xl text-white font-bold p-2 fixed left-[30vh] top-50" onClick={logout}>logout</button>
      </div>
      <h1 className="text-2xl font-semibold mb-4">
        Patient Dashboard
      </h1>

      <div className="bg-white shadow rounded p-4">
        <p><strong>Email:</strong> {auth.patient?.email}</p>
      </div>
    </div>
  );
}
