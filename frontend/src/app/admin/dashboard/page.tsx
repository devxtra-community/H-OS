'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/src/features/admin/admin.auth.provider';
import CreateStaffForm from "@/src/features/admin/components/CreateStaffForm";
import CreateWardForm from "@/src/features/admin/components/CreateWardForm";
import CreateRoomForm from "@/src/features/admin/components/CreateRoomForm";
import CreateBedForm from "@/src/features/admin/components/CreateBedForm";
import {
  Shield,
  UserPlus,
  Building2,
  DoorOpen,
  Bed,
  Layers,
  CheckCircle,
  Activity,
  Sliders,
} from 'lucide-react';

type ActiveTab = 'all' | 'staff' | 'wards' | 'rooms' | 'beds';

export default function AdminDashboard() {
  const { auth } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');

  const adminEmail = auth.admin?.email || 'Administrator';
  const initial = adminEmail.charAt(0).toUpperCase();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Header Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
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
              Hospital infrastructure, staff access control, and facility configuration console.
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Staff */}
        <div
          onClick={() => setActiveTab('staff')}
          className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 ${
            activeTab === 'staff' ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-100'
          }`}
        >
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
            <UserPlus size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Portal</p>
            <p className="text-base font-bold text-gray-900 truncate">Doctors &amp; Nurses</p>
            <p className="text-xs text-indigo-600 font-medium">Provision accounts &rarr;</p>
          </div>
        </div>

        {/* Card 2: Wards */}
        <div
          onClick={() => setActiveTab('wards')}
          className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 ${
            activeTab === 'wards' ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-gray-100'
          }`}
        >
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
            <Building2 size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital Wings</p>
            <p className="text-base font-bold text-gray-900 truncate">Wards &amp; Units</p>
            <p className="text-xs text-emerald-600 font-medium">Manage wings &rarr;</p>
          </div>
        </div>

        {/* Card 3: Rooms */}
        <div
          onClick={() => setActiveTab('rooms')}
          className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 ${
            activeTab === 'rooms' ? 'border-purple-400 ring-2 ring-purple-100' : 'border-gray-100'
          }`}
        >
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 shrink-0">
            <DoorOpen size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Inpatient Rooms</p>
            <p className="text-base font-bold text-gray-900 truncate">Room Layout</p>
            <p className="text-xs text-purple-600 font-medium">Assign rooms &rarr;</p>
          </div>
        </div>

        {/* Card 4: Beds */}
        <div
          onClick={() => setActiveTab('beds')}
          className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 ${
            activeTab === 'beds' ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-100'
          }`}
        >
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
            <Bed size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Bed Capacity</p>
            <p className="text-base font-bold text-gray-900 truncate">Admissions Ready</p>
            <p className="text-xs text-blue-600 font-medium">Setup beds &rarr;</p>
          </div>
        </div>
      </div>

      {/* Navigation Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'all'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          All Modules
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'staff'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <UserPlus size={14} />
          Staff Provisioning
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wards')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'wards'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Building2 size={14} />
          Ward Management
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'rooms'
              ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <DoorOpen size={14} />
          Room Assignment
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('beds')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'beds'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Bed size={14} />
          Bed Configuration
        </button>
      </div>

      {/* Main Section Content */}
      <div className="space-y-8">
        {/* Module 1: Staff Registration */}
        {(activeTab === 'all' || activeTab === 'staff') && (
          <section id="staff" className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                  <UserPlus size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">1. Staff Registration &amp; Access Provisioning</h2>
                  <p className="text-xs text-gray-500">Create medical practitioner and nurse accounts with department affiliations.</p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Staff Module
              </span>
            </div>

            <CreateStaffForm />
          </section>
        )}

        {/* Module 2: Ward Creation */}
        {(activeTab === 'all' || activeTab === 'wards') && (
          <section id="infrastructure" className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                  <Building2 size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">2. Ward &amp; Wing Infrastructure</h2>
                  <p className="text-xs text-gray-500">Establish operational hospital wards (e.g. ICU, General Ward, Pediatrics).</p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Facility Module
              </span>
            </div>

            <CreateWardForm />
          </section>
        )}

        {/* Module 3: Room Assignment */}
        {(activeTab === 'all' || activeTab === 'rooms') && (
          <section id="rooms" className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
                  <DoorOpen size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">3. Inpatient Room Setup</h2>
                  <p className="text-xs text-gray-500">Assign designated rooms to established wards for patient stay.</p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                Facility Module
              </span>
            </div>

            <CreateRoomForm />
          </section>
        )}

        {/* Module 4: Bed Setup */}
        {(activeTab === 'all' || activeTab === 'beds') && (
          <section id="beds" className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                  <Bed size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">4. Bed Setup &amp; Capacity Allocation</h2>
                  <p className="text-xs text-gray-500">Configure bed units inside rooms to enable inpatient admissions and assignments.</p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Capacity Module
              </span>
            </div>

            <CreateBedForm />
          </section>
        )}
      </div>
    </div>
  );
}