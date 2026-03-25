'use client';

import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStaffAuth } from '../../../staff/auth/staff.auth.provider';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  User,
  LogOut,
  Activity,
  Settings,
  Bed,
  ClipboardPlus,
  FileMinus,
  Package,
  Pill
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

  if (auth.isRestoring) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
        </div>
      </div>
    );
  }
  if (!auth.accessToken) return null;

  const isDoctor = auth.staff?.role === 'DOCTOR';

  const navItems = isDoctor ? [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/staff/dashboard' },
    { label: "Today's Queue", icon: Activity, path: '/staff/dashboard/queue' },
    { label: 'Manage Availability', icon: Calendar, path: '/staff/dashboard/availability' },
    { label: 'Patients', icon: User, path: '/staff/dashboard/patients' },
    { label: 'Pharmacy', icon: Pill, path: '/staff/dashboard/pharmacy' },
    { label: 'Inventory', icon: Package, path: '/staff/dashboard/inventory' },
  ] : [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/staff/dashboard' },
    { label: 'Beds', icon: Bed, path: '/staff/dashboard/beds' },
    { label: 'Admissions', icon: ClipboardPlus, path: '/staff/dashboard/admissions' },
    { label: 'Discharge', icon: FileMinus, path: '/staff/dashboard/discharge' },
    { label: 'Pharmacy', icon: Pill, path: '/staff/dashboard/pharmacy' },
    { label: 'Inventory', icon: Package, path: '/staff/dashboard/inventory' },
  ];

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
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${isActive
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
                <button className="flex h-11 w-11 items-center justify-center rounded-2xl text-white/60 transition-all hover:bg-white/10 hover:text-white">
                  <Settings size={20} strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">Settings</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => { logout(); router.push('/staff/login'); }}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-white/60 transition-all hover:bg-white/10 hover:text-white"
                >
                  <LogOut size={20} strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">Sign out</TooltipContent>
            </Tooltip>
          </div>
        </motion.aside>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}