'use client';

import { useAuth } from '../../../auth/auth.provider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth.isRestoring && !auth.accessToken) {
      router.replace('/login');
    }
  }, [auth.isRestoring, auth.accessToken, router]);

  if (auth.isRestoring) return <div>Loading...</div>;
  if (!auth.accessToken) return null;

  return (
    <div className="h-screen flex overflow-hidden">

      {/* Sidebar */}
      <aside className="w-64 bg-white text-black p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold mb-8">
            Patient Panel
          </h2>

          <nav className="space-y-4">

            <SidebarLink
              href="/dashboard"
              label="Dashboard"
              active={pathname === '/dashboard'}
            />

            <SidebarLink
              href="/dashboard/appointments"
              label="Appointments"
              active={pathname === '/dashboard/appointments'}
            />

            <SidebarLink
              href="/dashboard/book"
              label="Book Appointment"
              active={pathname === '/dashboard/book'}
            />

          </nav>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Right Content */}
      <main className="flex-1 bg-gray-100 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}

function SidebarLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className='block px-3 py-2 rounded bg-white text-black font-semibold hover:border-2'
    >
      {label}
    </Link>
  );
}