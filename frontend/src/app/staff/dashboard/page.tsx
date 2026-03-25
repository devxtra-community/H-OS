'use client';

import { useStaffAuth } from '../../../staff/auth/staff.auth.provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Calendar, FileText, User, Activity, ClipboardPlus, Bed } from 'lucide-react';

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
        <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
      </div>
    </div>
  );

  if (!auth.accessToken) return null;

  const staff = auth.staff;
  const isDoctor = staff?.role === 'DOCTOR';

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-2xl border">
            {staff?.name?.charAt(0) || 'S'}
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              Welcome back{staff?.name ? `, ${staff?.name}` : ''}
            </h1>
            <p className="text-gray-600">
              {isDoctor ? "Manage your patients and queue for the day." : "Oversee hospital operations and admission requests."}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
            <User size={22} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Role</p>
            <p className="text-lg font-bold">{staff?.role}</p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-100 text-green-600">
            <LayoutDashboard size={22} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Department</p>
            <p className="text-lg font-bold truncate max-w-[150px]">{staff?.department}</p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Job Title</p>
            <p className="text-lg font-bold truncate max-w-[150px]">{staff?.job_title}</p>
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

        {isDoctor ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/staff/dashboard/queue" className="flex items-center gap-4 p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <Activity size={22} />
              </div>
              <div>
                <p className="font-semibold">Today's Queue</p>
                <p className="text-sm text-slate-500">View your queued patients</p>
              </div>
            </Link>
            <Link href="/staff/dashboard/patients" className="flex items-center gap-4 p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="p-3 rounded-xl bg-green-100 text-green-600">
                <User size={22} />
              </div>
              <div>
                <p className="font-semibold">My Patients</p>
                <p className="text-sm text-slate-500">View admitted patients</p>
              </div>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/staff/dashboard/admissions" className="flex items-center gap-4 p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                <ClipboardPlus size={22} />
              </div>
              <div>
                <p className="font-semibold">Admission Requests</p>
                <p className="text-sm text-slate-500">Acknowledge pending requests</p>
              </div>
            </Link>
            <Link href="/staff/dashboard/beds" className="flex items-center gap-4 p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <Bed size={22} />
              </div>
              <div>
                <p className="font-semibold">Bed Management</p>
                <p className="text-sm text-slate-500">Manage ward allocations</p>
              </div>
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
