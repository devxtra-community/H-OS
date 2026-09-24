'use client';

import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '../../../features/admin/admin.auth.provider';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  UserPlus,
  Building2,
  Bed,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
  { label: 'Admin Console', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Staff Management', icon: UserPlus, path: '/admin/dashboard#staff' },
  { label: 'Ward Infrastructure', icon: Building2, path: '/admin/dashboard#infrastructure' },
  { label: 'Bed Configuration', icon: Bed, path: '/admin/dashboard#beds' },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { auth, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth.accessToken && !auth.isRestoring) {
      router.replace('/admin/login');
    }
  }, [auth.accessToken, auth.isRestoring, router]);

  if (auth.isRestoring) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!auth.accessToken) return null;

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="sticky top-0 z-20 flex h-screen w-[78px] flex-col items-center py-6 hos-gradient-bg shadow-xl"
          style={{ borderRadius: '0 24px 24px 0' }}
        >
          {/* Logo */}
          <div className="mb-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner">
              <Shield size={22} className="text-white" strokeWidth={2.2} />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path || (item.path === '/admin/dashboard' && pathname === '/admin/dashboard');
              return (
                <Tooltip key={item.label} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.path}
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
                        isActive
                          ? 'bg-white text-indigo-600 shadow-lg'
                          : 'text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="mt-auto flex flex-col items-center gap-2">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-white/60 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  <Settings size={20} strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                System Settings
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    router.push('/admin/login');
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-white/60 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  <LogOut size={20} strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Sign out
              </TooltipContent>
            </Tooltip>
          </div>
        </motion.aside>

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}