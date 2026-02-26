'use client';

import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStaffAuth } from '../../../staff/auth/staff.auth.provider';

export default function StaffLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { auth, logout } = useStaffAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isRestoring && !auth.accessToken) {
      router.replace('/staff/login');
    }
  }, [auth.isRestoring, auth.accessToken, router]);

  if (auth.isRestoring) return <div>Loading...</div>;
  if (!auth.accessToken) return null;

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
      className={`block px-3 py-2 rounded ${
        active
          ? 'bg-white text-black font-semibold'
          : 'hover:bg-blue-700'
      }`}
    >
      {label}
    </Link>
  );
}

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="w-64 bg-white text-bl p-6 flex flex-col justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold mb-8">Doctor Panel</h2>

          <nav className="space-y-4">
            <SidebarLink
              href="/staff/dashboard"
              label="Dashboard"
              active={pathname === '/staff/dashboard'}
            />

            <SidebarLink
              href="/staff/dashboard/queue"
              label="Today's Queue"
              active={pathname === '/staff/dashboard/queue'}
            />

            <SidebarLink
              href="/staff/dashboard/availability"
              label="Manage Availability"
              active={pathname === '/staff/dashboard/availability'}
            />
          </nav>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 bg-gray-100 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}