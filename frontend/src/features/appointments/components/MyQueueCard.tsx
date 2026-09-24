'use client';

import { useMyStatus } from '../hooks/useMyStatus';
import { formatAppointmentTime } from '@/src/lib/dateUtils';
import { Users, Clock, AlertTriangle, CheckCircle2, Activity, ArrowRight, Stethoscope } from 'lucide-react';
import Link from 'next/link';

export default function MyQueueCard() {
  const { data, isLoading } = useMyStatus();

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 bg-slate-100 rounded-xl"></div>
          <div className="h-20 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // When no active appointment today
  if (!data || 'message' in data) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <Stethoscope size={22} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
              Today's Clinic Queue
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              No appointments scheduled for today. Live queue tracking will activate on your visit day.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/book"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition shrink-0"
        >
          Book Visit
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const estimatedStart = data.estimated_start_time
    ? new Date(data.estimated_start_time)
    : null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-50/30 border border-blue-200/90 p-6 rounded-2xl shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
            <Activity size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Live Queue Status
            </h2>
            <p className="text-xs text-slate-500">Real-time outpatient consultation tracker</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            Live Queue Active
          </span>
        </div>
      </div>

      {/* SCHEDULED + CHECKED_IN */}
      {(data.status === 'SCHEDULED' || data.status === 'CHECKED_IN') && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Your Position</p>
                <p className="text-3xl font-extrabold text-blue-600 mt-1">
                  #{data.position}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-xs text-blue-600">
                <Users size={22} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-4 rounded-xl border border-amber-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Patients Ahead</p>
                <p className="text-3xl font-extrabold text-amber-600 mt-1">
                  {data.patients_ahead}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-xs text-amber-600">
                <Clock size={22} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${data.status === 'CHECKED_IN' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
              <span className="text-slate-700 font-medium">
                {data.status === 'CHECKED_IN'
                  ? 'Checked in — Doctor is preparing for your consultation'
                  : 'Scheduled for today — Please check in upon arrival at the desk'}
              </span>
            </div>

            {estimatedStart && (
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <Clock size={14} className="text-slate-400" />
                <span>Est. Start: <strong>{formatAppointmentTime(data.estimated_start_time)}</strong></span>
              </div>
            )}
          </div>

          {data.delay_minutes > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-medium">
              <AlertTriangle size={15} className="text-amber-600 shrink-0" />
              <span>Doctor schedule is running approximately {data.delay_minutes} minutes behind. Thank you for your patience.</span>
            </div>
          )}
        </div>
      )}

      {/* IN_PROGRESS */}
      {data.status === 'IN_PROGRESS' && (
        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Activity size={20} className="animate-spin" />
          </div>
          <div>
            <p className="text-sm sm:text-base font-bold text-emerald-900">
              Your consultation is currently in progress
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">
              You are currently with the specialist in the consultation room.
            </p>
          </div>
        </div>
      )}

      {/* COMPLETED */}
      {data.status === 'COMPLETED' && (
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-sm sm:text-base font-bold text-slate-800">
              Consultation completed
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Review any prescriptions or uploaded diagnostic notes below.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}