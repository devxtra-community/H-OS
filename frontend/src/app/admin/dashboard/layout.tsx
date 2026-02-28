'use client';

import { useAdminAuth } from '../../../features/admin/admin.auth.provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth , logout } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.accessToken && !auth.isRestoring) {
      router.replace('/admin/login');
    }
  }, [auth.accessToken, auth.isRestoring, router]);

  if (auth.isRestoring) return <div>Loading...</div>;
  if (!auth.accessToken) return null;

  return (
    <div className="min-h-screen flex">
      <div className="w-64 bg-black text-white p-6">
        <h2 className="font-bold text-lg">Admin Panel</h2>

        <button
  onClick={logout}
  className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
>
  Logout
</button>
      </div>

      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}