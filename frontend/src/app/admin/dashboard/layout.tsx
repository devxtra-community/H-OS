'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '../../../features/admin/admin.auth.provider';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  UserPlus,
  Building2,
  Bed,
  Settings,
  LogOut,
  Shield,
  MoreVertical,
  X,
  ChevronLeft,
  History,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
  { label: 'Admin Console', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Staff Management', icon: UserPlus, path: '/admin/dashboard/staff' },
  { label: 'Ward Infrastructure', icon: Building2, path: '/admin/dashboard/wards' },
  { label: 'Bed Configuration', icon: Bed, path: '/admin/dashboard/beds' },
  { label: 'History & Audits', icon: History, path: '/admin/dashboard/audits' },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { auth, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!auth.accessToken && !auth.isRestoring) {
      router.replace('/admin/login');
    }
  }, [auth.accessToken, auth.isRestoring, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
      <div className="flex h-screen overflow-hidden bg-gray-50 flex-col md:flex-row">
        {/* Mobile Top App Bar with 3-Dots Button */}
        <header className="md:hidden sticky top-0 z-30 flex h-14 w-full items-center justify-between px-4 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl hos-gradient-bg text-white shadow-xs">
              <Shield size={18} strokeWidth={2.2} />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm tracking-tight">H-OS</span>
              <span className="text-[10px] text-slate-500 block -mt-1 font-medium">Admin Console</span>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition cursor-pointer"
          >
            {mobileOpen ? <X size={20} /> : <MoreVertical size={20} />}
          </button>
        </header>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
              />

              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col py-5 px-4 hos-gradient-bg text-white shadow-2xl md:hidden"
                style={{ borderRadius: '0 24px 24px 0' }}
              >
                <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/15">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                      <Shield size={20} className="text-white" strokeWidth={2.2} />
                    </div>
                    <div>
                      <p className="font-bold text-white text-base">H-OS Admin</p>
                      <p className="text-xs text-white/70">Console Navigation</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setMobileOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                    title="Minimize sidebar"
                  >
                    <X size={18} />
                  </button>
                </div>

                <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto py-2">
                  {navItems.map((item) => {
                    const isActive =
                      item.path === '/admin/dashboard'
                        ? pathname === '/admin/dashboard'
                        : pathname === item.path || pathname.startsWith(item.path + '/');
                    return (
                      <Link
                        key={item.label}
                        href={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
                          isActive
                            ? 'bg-white text-indigo-600 shadow-md font-semibold'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <item.icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-auto pt-4 border-t border-white/15 flex flex-col gap-2">
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                    <span>Minimize sidebar</span>
                  </button>

                  <button
                    onClick={async () => {
                      setMobileOpen(false);
                      await logout();
                      router.push('/admin/login');
                    }}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-200 hover:bg-rose-500/20 hover:text-white transition cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sticky Sidebar */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="hidden md:flex sticky top-0 z-20 h-screen w-[78px] shrink-0 flex-col items-center py-6 hos-gradient-bg shadow-xl"
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
              const isActive =
                item.path === '/admin/dashboard'
                  ? pathname === '/admin/dashboard'
                  : pathname === item.path || pathname.startsWith(item.path + '/');
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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}