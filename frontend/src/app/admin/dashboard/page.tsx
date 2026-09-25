'use client';

import Link from 'next/link';
import { useAdminAuth } from '@/src/features/admin/admin.auth.provider';
import { useStaffList } from '@/src/features/admin/hooks/useStaffList';
import { useQuery } from '@tanstack/react-query';
import { getWards, getBeds } from '@/src/features/admin/api/beds.api';
import { usePharmacyHistory, useBedHistory } from '@/src/features/admin/hooks/useAudits';
import {
  Shield,
  UserPlus,
  Building2,
  Bed,
  History,
  Users,
  DoorOpen,
  Pill,
  ArrowRight,
  CheckCircle2,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboard() {
  const { auth } = useAdminAuth();
  const adminEmail = auth.admin?.email || 'Administrator';
  const initial = adminEmail.charAt(0).toUpperCase();

  const { data: staffList, isLoading: staffLoading } = useStaffList();
  const { data: wards, isLoading: wardsLoading } = useQuery({
    queryKey: ['wards'],
    queryFn: getWards,
  });
  const { data: beds, isLoading: bedsLoading } = useQuery({
    queryKey: ['beds'],
    queryFn: getBeds,
  });
  const { data: pharmacyRecords, isLoading: pharmacyLoading } = usePharmacyHistory();
  const { data: bedRecords, isLoading: bedAuditLoading } = useBedHistory();

  const totalStaff = staffList?.length || 0;
  const totalWards = wards?.length || 0;
  const totalBeds = beds?.length || 0;
  const occupiedBeds = beds?.filter((b: any) => b.status === 'OCCUPIED').length || 0;
  const totalDispensed = pharmacyRecords?.length || 0;
  const totalBedLogs = bedRecords?.length || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Header Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl hos-gradient-bg flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200 shrink-0">
            {initial}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Welcome back, {adminEmail.split('@')[0]}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Shield size={12} />
                Admin
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Hospital operations console, access control, facility management, and institutional audit tracking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Live &amp; Operational
          </div>
        </div>
      </div>

      {/* Metrics / Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Staff */}
        <Link
          href="/admin/dashboard/staff"
          className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex items-center gap-4 group"
        >
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
            <Users size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Clinical Staff</p>
            <p className="text-2xl font-bold text-gray-900">{staffLoading ? '—' : totalStaff}</p>
            <p className="text-xs text-indigo-600 font-medium group-hover:underline flex items-center gap-1">
              View Directory &rarr;
            </p>
          </div>
        </Link>

        {/* Card 2: Wards */}
        <Link
          href="/admin/dashboard/wards"
          className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex items-center gap-4 group"
        >
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
            <Building2 size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital Wards</p>
            <p className="text-2xl font-bold text-gray-900">{wardsLoading ? '—' : totalWards}</p>
            <p className="text-xs text-emerald-600 font-medium group-hover:underline flex items-center gap-1">
              Manage Wings &rarr;
            </p>
          </div>
        </Link>

        {/* Card 3: Beds */}
        <Link
          href="/admin/dashboard/beds"
          className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex items-center gap-4 group"
        >
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
            <Bed size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Bed Capacity</p>
            <p className="text-2xl font-bold text-gray-900">
              {bedsLoading ? '—' : `${occupiedBeds}/${totalBeds}`}
            </p>
            <p className="text-xs text-blue-600 font-medium group-hover:underline flex items-center gap-1">
              Configure Beds &rarr;
            </p>
          </div>
        </Link>

        {/* Card 4: Audits */}
        <Link
          href="/admin/dashboard/audits"
          className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-purple-200 transition-all flex items-center gap-4 group"
        >
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
            <History size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Audit Records</p>
            <p className="text-2xl font-bold text-gray-900">
              {pharmacyLoading || bedAuditLoading ? '—' : totalDispensed + totalBedLogs}
            </p>
            <p className="text-xs text-purple-600 font-medium group-hover:underline flex items-center gap-1">
              Audit Trails &rarr;
            </p>
          </div>
        </Link>
      </div>

      {/* Main Module Nav Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Administrative Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Module 1: Staff Management */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                  <UserPlus size={24} />
                </div>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  Staff Module
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Staff Management &amp; Directory</h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Inspect the full registry of registered doctors and nurses, provision new medical practitioner accounts, and control system role permissions.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                {totalStaff} registered practitioners
              </span>
              <Link
                href="/admin/dashboard/staff"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shadow-indigo-200 transition cursor-pointer"
              >
                <span>Open Staff Portal</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Module 2: Ward Infrastructure */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                  <Building2 size={24} />
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  Facility Module
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Ward Infrastructure &amp; Rooms</h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Establish new operational hospital wards (e.g. ICU, General Ward, Pediatrics), design inpatient room setups, and manage hospital architecture.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                {totalWards} operational wings
              </span>
              <Link
                href="/admin/dashboard/wards"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs shadow-emerald-200 transition cursor-pointer"
              >
                <span>Manage Wards</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Module 3: Bed Configuration */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                  <Bed size={24} />
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  Capacity Module
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Bed Setup &amp; Capacity Allocation</h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Provision bed units inside designated rooms, assign inpatient capacity, and track live occupancy states across all departments.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                {totalBeds} total beds configured
              </span>
              <Link
                href="/admin/dashboard/beds"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs shadow-blue-200 transition cursor-pointer"
              >
                <span>Configure Beds</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Module 4: History & Audits */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
                  <History size={24} />
                </div>
                <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                  Compliance &amp; Audits
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">History &amp; Institutional Audits</h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Access medication dispensation records (time, medicine, patient, doctor) and complete inpatient bed assignment &amp; discharge history.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                Pharmacy &amp; Bed audit logs
              </span>
              <Link
                href="/admin/dashboard/audits"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs shadow-purple-200 transition cursor-pointer"
              >
                <span>View Audits</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}