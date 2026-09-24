'use client';

import { useAuth } from '../../../auth/auth.provider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  User,
  LogOut,
  Activity,
  Settings,
  PlusCircle,
  FileText,
  MoreVertical,
  X,
  ChevronLeft,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Appointments', icon: Calendar, path: '/dashboard/appointments' },
  { label: 'Book Appointment', icon: PlusCircle, path: '/dashboard/book' },
  { label: 'Documents', icon: FileText, path: '/dashboard/documents' },
  { label: 'Profile', icon: User, path: '/dashboard/profile' },
];

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!auth.isRestoring && !auth.accessToken) {
      router.replace('/login');
    }
  }, [auth.isRestoring, auth.accessToken, router]);

  // Automatically minimize sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (auth.isRestoring) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
      </div>
    </div>
  );

  if (!auth.accessToken) return null;

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50 flex-col md:flex-row">
        {/* Mobile Top App Bar with 3-Dots Button */}
        <header className="md:hidden sticky top-0 z-30 flex h-14 w-full items-center justify-between px-4 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl hos-gradient-bg text-white shadow-xs">
              <Activity size={18} strokeWidth={2.2} />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm tracking-tight">H-OS</span>
              <span className="text-[10px] text-slate-500 block -mt-1 font-medium">Patient Portal</span>
            </div>
          </div>

          {/* 3 Dots Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition cursor-pointer"
          >
            {mobileOpen ? <X size={20} /> : <MoreVertical size={20} />}
          </button>
        </header>

        {/* Mobile Drawer (Hidden by default, slides in when 3 dots clicked) */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Dimmed backdrop - click to minimize */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
              />

              {/* Mobile Sidebar Panel */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col py-5 px-4 hos-gradient-bg text-white shadow-2xl md:hidden"
                style={{ borderRadius: '0 24px 24px 0' }}
              >
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/15">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                      <Activity size={20} className="text-white" strokeWidth={2.2} />
                    </div>
                    <div>
                      <p className="font-bold text-white text-base">H-OS Health</p>
                      <p className="text-xs text-white/70">Patient Navigation</p>
                    </div>
                  </div>

                  {/* Minimize Button (X) */}
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                    title="Minimize sidebar"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Navigation items with readable labels */}
                <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto py-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.path}
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

                {/* Bottom Actions */}
                <div className="mt-auto pt-4 border-t border-white/15 flex flex-col gap-2">
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                    <span>Minimize sidebar</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                      router.push('/login');
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

        {/* Desktop Sticky Sidebar (Hidden on mobile) */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="hidden md:flex sticky top-0 z-20 h-screen w-19.5 shrink-0 flex-col items-center py-6 hos-gradient-bg shadow-xl"
          style={{ borderRadius: '0 24px 24px 0' }}
        >
          {/* Logo */}
          <div className="mb-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Activity size={22} className="text-white" strokeWidth={2.2} />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Tooltip key={item.path} delayDuration={0}>
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
                <button className="flex h-11 w-11 items-center justify-center rounded-2xl text-white/60 transition-all hover:bg-white/10 hover:text-white cursor-pointer">
                  <Settings size={20} strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">Settings</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => { logout(); router.push('/login'); }}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-white/60 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  <LogOut size={20} strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">Sign out</TooltipContent>
            </Tooltip>
          </div>
        </motion.aside>

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}