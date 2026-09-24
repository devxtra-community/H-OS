'use client';

import Link from 'next/link';
import { CheckCircle2, Calendar, Clock, Stethoscope, ArrowRight, PlusCircle } from 'lucide-react';
import { formatAppointmentDate, formatAppointmentTime } from '@/src/lib/dateUtils';

interface Props {
  doctorName?: string;
  departmentName?: string;
  appointmentTime?: string;
  onBookAnother: () => void;
}

export default function BookingSuccess({
  doctorName,
  departmentName,
  appointmentTime,
  onBookAnother,
}: Props) {
  return (
    <div className="max-w-xl mx-auto py-8 text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Success Icon */}
      <div className="flex flex-col items-center">
        <div className="h-20 w-20 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-100 mb-4">
          <CheckCircle2 size={40} className="stroke-[2.5]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Appointment Confirmed!
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">
          Your consultation slot has been reserved and confirmed with the hospital department.
        </p>
      </div>

      {/* Appointment Ticket Card */}
      <div className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-6 sm:p-7 text-left space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Consultation Pass
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            ● Confirmed
          </span>
        </div>

        <div className="space-y-4">
          {/* Doctor */}
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
              <Stethoscope size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Attending Physician
              </p>
              <p className="font-bold text-slate-900 text-base">
                Dr. {doctorName || 'Assigned Specialist'}
              </p>
              {departmentName && (
                <p className="text-xs text-indigo-600 font-medium">
                  {departmentName}
                </p>
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Date
                </p>
                <p className="font-bold text-slate-900 text-sm">
                  {appointmentTime ? formatAppointmentDate(appointmentTime) : '—'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Time Slot
                </p>
                <p className="font-bold text-slate-900 text-sm">
                  {appointmentTime ? formatAppointmentTime(appointmentTime) : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Link
          href="/dashboard/appointments"
          className="px-6 py-3.5 rounded-xl hos-gradient-bg hover:opacity-95 text-white font-semibold text-sm transition-all shadow-sm shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>View My Appointments</span>
          <ArrowRight size={16} />
        </Link>

        <button
          type="button"
          onClick={onBookAnother}
          className="px-6 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <PlusCircle size={16} />
          <span>Book Another Visit</span>
        </button>
      </div>
    </div>
  );
}
