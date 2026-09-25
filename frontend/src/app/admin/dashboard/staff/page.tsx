'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStaffList } from '@/src/features/admin/hooks/useStaffList';
import CreateStaffForm from '@/src/features/admin/components/CreateStaffForm';
import {
  UserPlus,
  Users,
  Search,
  Stethoscope,
  HeartPulse,
  Shield,
  Building2,
  Mail,
  Briefcase,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Calendar,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export default function StaffManagementPage() {
  const { data: staffList, isLoading, isError, refetch } = useStaffList();
  const [activeTab, setActiveTab] = useState<'directory' | 'create'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'DOCTOR' | 'NURSE'>('ALL');

  const staff = staffList || [];
  const doctorsCount = staff.filter((s) => s.role === 'DOCTOR').length;
  const nursesCount = staff.filter((s) => s.role === 'NURSE').length;
  const activeCount = staff.filter((s) => s.is_active !== false).length;

  const filteredStaff = staff.filter((item) => {
    const matchesRole = roleFilter === 'ALL' || item.role === roleFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.name?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query) ||
      item.department_name?.toLowerCase().includes(query) ||
      item.job_title?.toLowerCase().includes(query);
    return matchesRole && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Breadcrumb & Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition shadow-2xs cursor-pointer"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Staff Management</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Access & Directory
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Manage clinical personnel accounts, credentials, and institutional role authorizations.
            </p>
          </div>
        </div>

        {/* Action Toggle */}
        <div className="flex items-center gap-2 bg-gray-100/80 p-1 rounded-2xl border border-gray-200/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users size={14} />
            <span>Staff Directory ({staff.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserPlus size={14} />
            <span>Provision Account</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Staff</p>
            <p className="text-2xl font-bold text-gray-900">{isLoading ? '—' : staff.length}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
            <Stethoscope size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Doctors</p>
            <p className="text-2xl font-bold text-gray-900">{isLoading ? '—' : doctorsCount}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 shrink-0">
            <HeartPulse size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nurses</p>
            <p className="text-2xl font-bold text-gray-900">{isLoading ? '—' : nursesCount}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Status</p>
            <p className="text-2xl font-bold text-emerald-600">
              {isLoading ? '—' : `${activeCount}/${staff.length}`}
            </p>
          </div>
        </div>
      </div>

      {/* Main View Content */}
      {activeTab === 'directory' ? (
        <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>Hospital Personnel Accounts</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  {filteredStaff.length} listed
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                Verified records of clinical practitioners and nurse authorizations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => refetch()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 text-xs font-semibold transition cursor-pointer"
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shadow-indigo-200 transition cursor-pointer"
              >
                <UserPlus size={14} />
                <span>Add Staff Member</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by name, email, department, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-gray-50 p-1 rounded-xl border border-gray-200/80">
              <button
                type="button"
                onClick={() => setRoleFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  roleFilter === 'ALL'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Roles ({staff.length})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('DOCTOR')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  roleFilter === 'DOCTOR'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Doctors ({doctorsCount})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('NURSE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  roleFilter === 'NURSE'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Nurses ({nursesCount})
              </button>
            </div>
          </div>

          {/* Accounts Table */}
          {isLoading ? (
            <div className="py-16 text-center">
              <div className="h-10 w-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-gray-500">Loading personnel directory...</p>
            </div>
          ) : isError ? (
            <div className="py-12 text-center text-rose-600 text-sm">
              Failed to load staff accounts. Please check server connection and retry.
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="py-16 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <Users size={36} className="mx-auto text-gray-400 mb-2 stroke-1" />
              <p className="text-sm font-semibold text-gray-800">No staff accounts found</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                {searchQuery
                  ? 'No personnel records match your current search criteria.'
                  : 'No staff accounts have been provisioned yet. Use the provision form to register staff.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Staff Member</th>
                    <th className="py-3.5 px-4">Role &amp; Title</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStaff.map((member) => {
                    const isDoctor = member.role === 'DOCTOR';
                    const initials = member.name
                      ? member.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                      : 'ST';

                    return (
                      <tr key={member.id} className="hover:bg-gray-50/70 transition">
                        {/* Member Identity */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                isDoctor
                                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                  : 'bg-rose-50 text-rose-700 border border-rose-100'
                              }`}
                            >
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{member.name}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                                <Mail size={11} className="text-gray-400" />
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role & Title */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                isDoctor
                                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                  : 'bg-rose-50 text-rose-700 border border-rose-100'
                              }`}
                            >
                              {isDoctor ? <Stethoscope size={11} /> : <HeartPulse size={11} />}
                              {member.role}
                            </span>
                            <p className="text-xs text-gray-600 font-medium truncate">
                              {member.job_title || 'Practitioner'}
                            </p>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                            <Building2 size={13} className="text-gray-400 shrink-0" />
                            <span>{member.department_name || 'General Medicine'}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {member.is_active !== false ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Joined Date */}
                        <td className="py-3.5 px-4 text-right text-xs text-gray-500">
                          {member.created_at
                            ? new Date(member.created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'Active'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <UserPlus size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Provision Staff Account</h2>
                <p className="text-xs text-gray-500">
                  Assign practitioner credentials, select clinical department, and grant system role access.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('directory')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline self-start sm:self-auto cursor-pointer"
            >
              &larr; Back to Directory
            </button>
          </div>

          <CreateStaffForm />
        </section>
      )}
    </div>
  );
}
