'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getWards, getRooms } from '@/src/features/admin/api/beds.api';
import CreateWardForm from '@/src/features/admin/components/CreateWardForm';
import CreateRoomForm from '@/src/features/admin/components/CreateRoomForm';
import {
  Building2,
  DoorOpen,
  ArrowLeft,
  Layers,
  Sparkles,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';

export default function WardInfrastructurePage() {
  const [selectedWardId, setSelectedWardId] = useState<string>('');

  const {
    data: wards,
    isLoading: wardsLoading,
    refetch: refetchWards,
  } = useQuery({
    queryKey: ['wards'],
    queryFn: getWards,
  });

  const activeWardId = selectedWardId || wards?.[0]?.id || '';

  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ['rooms', activeWardId],
    queryFn: () => getRooms(activeWardId),
    enabled: !!activeWardId,
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-200 transition shadow-2xs cursor-pointer"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Ward Infrastructure</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                Facility & Rooms
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Establish hospital wings, specialized units, and configure inpatient room architecture.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetchWards()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-emerald-600 text-xs font-semibold shadow-2xs transition self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={14} className={wardsLoading ? 'animate-spin' : ''} />
          <span>Refresh Facility Data</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
            <Building2 size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Operational Wards</p>
            <p className="text-2xl font-bold text-gray-900">{wardsLoading ? '—' : wards?.length || 0}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 shrink-0">
            <DoorOpen size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rooms in Active Ward</p>
            <p className="text-2xl font-bold text-gray-900">{roomsLoading ? '—' : rooms?.length || 0}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
            <Layers size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Facility Status</p>
            <p className="text-base font-bold text-emerald-600">Active &amp; Scalable</p>
          </div>
        </div>
      </div>

      {/* Creation Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ward Creation Section */}
        <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3.5 border-b border-gray-100 pb-5">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">1. Establish Hospital Ward</h2>
              <p className="text-xs text-gray-500">
                Create new operational wings (e.g., ICU, Pediatric Wing, Cardiology Unit).
              </p>
            </div>
          </div>

          <CreateWardForm />
        </section>

        {/* Room Assignment Section */}
        <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3.5 border-b border-gray-100 pb-5">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
              <DoorOpen size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">2. Inpatient Room Setup</h2>
              <p className="text-xs text-gray-500">
                Designate rooms inside an established ward for patient stays.
              </p>
            </div>
          </div>

          <CreateRoomForm />
        </section>
      </div>

      {/* Existing Facility Structure Explorer */}
      <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>Current Ward &amp; Room Layout</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {wards?.length || 0} Wards Configured
              </span>
            </h2>
            <p className="text-xs text-gray-500">
              Select a ward below to inspect all assigned inpatient rooms.
            </p>
          </div>
        </div>

        {/* Ward Pills Selector */}
        {wardsLoading ? (
          <div className="py-8 text-center text-xs text-gray-500">Loading hospital wards...</div>
        ) : !wards || wards.length === 0 ? (
          <div className="py-10 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <Building2 size={32} className="mx-auto text-gray-400 mb-2 stroke-1" />
            <p className="text-sm font-semibold text-gray-700">No hospital wards established yet</p>
            <p className="text-xs text-gray-500 mt-1">Use the form above to create your first ward.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {wards.map((ward: any) => {
                const isSelected = ward.id === activeWardId;
                return (
                  <button
                    key={ward.id}
                    type="button"
                    onClick={() => setSelectedWardId(ward.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-200'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Building2 size={14} />
                    <span>{ward.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Rooms inside selected ward */}
            <div className="bg-gray-50/70 rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                  <DoorOpen size={14} className="text-purple-600" />
                  <span>
                    Rooms in {wards.find((w: any) => w.id === activeWardId)?.name || 'Selected Ward'}
                  </span>
                </p>
                <span className="text-xs font-semibold text-gray-500">
                  {rooms?.length || 0} Rooms
                </span>
              </div>

              {roomsLoading ? (
                <div className="py-6 text-center text-xs text-gray-500">Loading rooms...</div>
              ) : !rooms || rooms.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-4 text-center">
                  No rooms have been assigned to this ward yet. Use the Inpatient Room Setup form above to add rooms.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {rooms.map((room: any) => (
                    <div
                      key={room.id}
                      className="bg-white border border-gray-200/80 rounded-xl p-3 text-center shadow-2xs hover:border-purple-300 transition"
                    >
                      <DoorOpen size={16} className="mx-auto text-purple-600 mb-1" />
                      <p className="text-xs font-bold text-gray-900">Room {room.room_number}</p>
                      <p className="text-[10px] text-gray-400">Inpatient</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
