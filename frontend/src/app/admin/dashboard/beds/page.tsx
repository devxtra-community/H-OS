'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getBeds } from '@/src/features/admin/api/beds.api';
import CreateBedForm from '@/src/features/admin/components/CreateBedForm';
import {
  Bed,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  User,
  Stethoscope,
  Building2,
  DoorOpen,
} from 'lucide-react';

export default function BedConfigurationPage() {
  const [filter, setFilter] = useState<'ALL' | 'AVAILABLE' | 'OCCUPIED'>('ALL');
  const [search, setSearch] = useState('');

  const {
    data: beds,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['beds'],
    queryFn: getBeds,
  });

  const bedList: any[] = beds || [];
  const totalBeds = bedList.length;
  const availableBeds = bedList.filter((b) => b.status === 'AVAILABLE').length;
  const occupiedBeds = bedList.filter((b) => b.status === 'OCCUPIED').length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const filteredBeds = bedList.filter((bed) => {
    const matchesFilter = filter === 'ALL' || bed.status === filter;
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      bed.bed_number?.toLowerCase().includes(query) ||
      bed.room_number?.toLowerCase().includes(query) ||
      bed.ward?.toLowerCase().includes(query) ||
      bed.patient_name?.toLowerCase().includes(query) ||
      bed.doctor_name?.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 transition shadow-2xs cursor-pointer"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bed Configuration</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                Capacity & Allocation
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Set up hospital bed inventory, assign units to rooms, and monitor active ward occupancy.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-blue-600 text-xs font-semibold shadow-2xs transition self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh Beds</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
            <Bed size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Beds</p>
            <p className="text-2xl font-bold text-gray-900">{isLoading ? '—' : totalBeds}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Available Beds</p>
            <p className="text-2xl font-bold text-emerald-600">{isLoading ? '—' : availableBeds}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 shrink-0">
            <AlertCircle size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Occupied Beds</p>
            <p className="text-2xl font-bold text-amber-600">{isLoading ? '—' : occupiedBeds}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
            <Building2 size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy Rate</p>
            <p className="text-2xl font-bold text-indigo-600">{isLoading ? '—' : `${occupancyRate}%`}</p>
          </div>
        </div>
      </div>

      {/* Bed Creation Form */}
      <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
              <Bed size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Provision Hospital Bed</h2>
              <p className="text-xs text-gray-500">
                Select target ward &amp; room to establish new inpatient capacity.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Capacity Setup
          </span>
        </div>

        <CreateBedForm />
      </section>

      {/* Live Bed Inventory Table / Grid */}
      <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>Facility Bed Status Overview</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {filteredBeds.length} Beds
              </span>
            </h2>
            <p className="text-xs text-gray-500">
              Real-time monitoring of hospital bed availability and current inpatient occupancy.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start md:self-auto bg-gray-50 p-1 rounded-xl border border-gray-200/80">
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filter === 'ALL'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({totalBeds})
            </button>
            <button
              type="button"
              onClick={() => setFilter('AVAILABLE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filter === 'AVAILABLE'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Available ({availableBeds})
            </button>
            <button
              type="button"
              onClick={() => setFilter('OCCUPIED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filter === 'OCCUPIED'
                  ? 'bg-white text-amber-700 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Occupied ({occupiedBeds})
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by bed, room, ward, patient, or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition placeholder:text-gray-400"
          />
        </div>

        {/* Beds Grid */}
        {isLoading ? (
          <div className="py-16 text-center">
            <div className="h-10 w-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500">Loading facility bed capacity...</p>
          </div>
        ) : filteredBeds.length === 0 ? (
          <div className="py-16 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <Bed size={36} className="mx-auto text-gray-400 mb-2 stroke-1" />
            <p className="text-sm font-semibold text-gray-800">No beds found</p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              {search
                ? 'No bed units match your search query.'
                : 'No beds have been configured yet. Use the form above to add beds.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBeds.map((bed: any) => {
              const isOccupied = bed.status === 'OCCUPIED';
              return (
                <div
                  key={bed.id}
                  className={`rounded-2xl p-4 border transition-all ${
                    isOccupied
                      ? 'bg-amber-50/30 border-amber-200/80 shadow-2xs'
                      : 'bg-white border-gray-200/80 shadow-2xs hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          isOccupied ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        <Bed size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{bed.bed_number}</p>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Building2 size={11} className="text-gray-400" />
                          <span>{bed.ward || 'General Ward'}</span> &bull; <span>Room {bed.room_number}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        isOccupied
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isOccupied ? 'Occupied' : 'Available'}
                    </span>
                  </div>

                  {isOccupied ? (
                    <div className="pt-2 border-t border-amber-200/60 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-800">
                        <User size={13} className="text-amber-600 shrink-0" />
                        <span className="font-semibold truncate">{bed.patient_name || 'Active Patient'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Stethoscope size={13} className="text-gray-400 shrink-0" />
                        <span className="truncate">{bed.doctor_name || 'Attending Physician'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-gray-100 text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      <span>Ready for patient admission</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
