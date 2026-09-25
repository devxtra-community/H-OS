'use client';

import { useStaffAuth } from '../../../staff/auth/staff.auth.provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  User,
  Activity,
  ClipboardPlus,
  Bed,
  Stethoscope,
  Building2,
  Briefcase,
  ArrowUpRight,
  CalendarDays,
  Sparkles,
  Package,
  Pill,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function StaffDashboardPage() {
  const { auth, logout } = useStaffAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isRestoring && !auth.accessToken) {
      router.replace('/staff/login');
    }
  }, [auth.accessToken, auth.isRestoring, router]);

  if (auth.isRestoring) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin"></div>
      </div>
    </div>
  );

  if (!auth.accessToken) return null;

  const staff = auth.staff;
  const isDoctor = staff?.role === 'DOCTOR';

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  const staffInitials = staff?.name
    ? staff.name
        .split(' ')
        .filter((n: string) => n.length > 0)
        .slice(0, 2)
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    : 'S';

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Executive Staff Header */}
      <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-transparent blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white font-extrabold text-2xl shadow-md ring-2 ring-indigo-500/20">
                {staffInitials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
            </div>

            {/* Title & Info */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back{staff?.name ? `, ${isDoctor ? 'Dr. ' : ''}${staff.name}` : ''}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  <ShieldCheck size={11} className="text-indigo-500" />
                  {isDoctor ? 'Attending Physician' : 'Clinical Operations'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active on Duty
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500">
                {isDoctor
                  ? "Manage today's outpatient consultation queue, patient admissions, and clinical prescriptions."
                  : "Oversee ward allocations, pending admission requests, bed occupancy, and facility inventory."}
              </p>

              <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                <CalendarDays size={13} className="text-slate-400" />
                <span>{todayFormatted}</span>
                <span className="text-slate-300">•</span>
                <span className="font-medium text-slate-600">{staff?.department || 'General Medicine'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Role */}
        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Stethoscope size={22} />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Credential</span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {staff?.role || 'STAFF'}
            </p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              Primary System Role
            </p>
          </div>
        </div>

        {/* Department */}
        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <Building2 size={22} />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Specialty</span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight truncate">
              {staff?.department || 'Hospital Operations'}
            </p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              Clinical Department
            </p>
          </div>
        </div>

        {/* Job Title */}
        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <Briefcase size={22} />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Assignment</span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight truncate">
              {staff?.job_title || 'Hospital Staff'}
            </p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              Official Position
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Operational Quick Actions
          </h2>
        </div>

        {isDoctor ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/staff/dashboard/queue"
              className="group relative flex items-center justify-between p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25">
                  <Activity size={22} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">
                    Today's Queue
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Live consultation & check-in tracker
                  </p>
                </div>
              </div>

              <div className="h-9 w-9 rounded-xl bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition shrink-0 ml-3">
                <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>

            <Link
              href="/staff/dashboard/patients"
              className="group relative flex items-center justify-between p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-emerald-400 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/25">
                  <User size={22} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition">
                    My Admitted Patients
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    View ward allocation & discharge
                  </p>
                </div>
              </div>

              <div className="h-9 w-9 rounded-xl bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600 flex items-center justify-center transition shrink-0 ml-3">
                <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>

            <Link
              href="/staff/dashboard/availability"
              className="group relative flex items-center justify-between p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-purple-400 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-sm shadow-purple-500/25">
                  <Calendar size={22} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-base group-hover:text-purple-600 transition">
                    Manage Schedule
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Set weekly working hours & slots
                  </p>
                </div>
              </div>

              <div className="h-9 w-9 rounded-xl bg-slate-50 group-hover:bg-purple-50 text-slate-400 group-hover:text-purple-600 flex items-center justify-center transition shrink-0 ml-3">
                <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/staff/dashboard/queue"
              className="group relative flex items-center justify-between p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">
                    Staff Check-in
                  </p>
                  <p className="text-xs text-slate-500">Patient arrival queue</p>
                </div>
              </div>
              <ArrowUpRight size={16} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </Link>

            <Link
              href="/staff/dashboard/admissions"
              className="group relative flex items-center justify-between p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-purple-400 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-sm shadow-purple-500/25">
                  <ClipboardPlus size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm group-hover:text-purple-600 transition">
                    Admissions
                  </p>
                  <p className="text-xs text-slate-500">Pending bed requests</p>
                </div>
              </div>
              <ArrowUpRight size={16} className="text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </Link>

            <Link
              href="/staff/dashboard/beds"
              className="group relative flex items-center justify-between p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-emerald-400 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/25">
                  <Bed size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition">
                    Ward Beds
                  </p>
                  <p className="text-xs text-slate-500">Live bed allocation</p>
                </div>
              </div>
              <ArrowUpRight size={16} className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </Link>

            <Link
              href="/staff/dashboard/pharmacy"
              className="group relative flex items-center justify-between p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-amber-400 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm shadow-amber-500/25">
                  <Pill size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition">
                    Pharmacy
                  </p>
                  <p className="text-xs text-slate-500">Dispense medicines</p>
                </div>
              </div>
              <ArrowUpRight size={16} className="text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </Link>
          </div>
        )}
      </div>

      {/* Clinical Shift Notice Card */}
      <div className="bg-gradient-to-r from-indigo-50/70 via-blue-50/40 to-white border border-indigo-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-500/20">
            <Clock size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Hospital Operating System Active</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              All queue updates, emergency alerts, and bed movements synchronize in real-time across staff terminals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/staff/dashboard/queue"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition"
          >
            <span>Launch Live Queue</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
