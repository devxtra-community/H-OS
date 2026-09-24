'use client';

import { Stethoscope, Clock, CheckCircle2, User } from 'lucide-react';

interface Props {
  doctor: any;
  selected: boolean;
  onSelect: (id: string) => void;
}

function formatTime(time: string) {
  if (!time) return '';
  const [hour, minute] = time.split(':');
  const date = new Date();
  date.setHours(Number(hour));
  date.setMinutes(Number(minute));
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function DoctorCard({ doctor, selected, onSelect }: Props) {
  const initial = doctor.name ? doctor.name.charAt(0).toUpperCase() : 'D';

  return (
    <button
      type="button"
      onClick={() => onSelect(doctor.id)}
      className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative group flex items-start gap-4 ${
        selected
          ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-xs'
          : 'border-slate-200/80 bg-white hover:border-indigo-200 hover:bg-slate-50/50 hover:shadow-xs'
      }`}
    >
      {/* Doctor Avatar */}
      <div className="relative shrink-0">
        <div
          className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-base transition-colors ${
            selected
              ? 'hos-gradient-bg text-white shadow-sm shadow-indigo-200'
              : 'bg-indigo-50 text-indigo-600 border border-indigo-100 group-hover:bg-indigo-100'
          }`}
        >
          {initial}
        </div>
        <div className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full shadow-2xs">
          <Stethoscope size={11} className="text-indigo-600" />
        </div>
      </div>

      {/* Doctor Info */}
      <div className="flex-1 min-w-0 pr-6">
        <div className="flex items-center gap-1.5">
          <p className="font-bold text-slate-900 text-sm sm:text-base truncate">
            Dr. {doctor.name}
          </p>
        </div>

        <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
          {doctor.job_title || 'General Practitioner'}
        </p>

        {doctor.department_name && (
          <span className="inline-block mt-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded-md">
            {doctor.department_name}
          </span>
        )}

        {/* Operating Hours */}
        {doctor.start_time && doctor.end_time && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2.5 pt-2 border-t border-slate-100">
            <Clock size={12} className="text-slate-400 shrink-0" />
            <span className="font-medium text-[11px]">
              {formatTime(doctor.start_time)} – {formatTime(doctor.end_time)}
            </span>
          </div>
        )}
      </div>

      {/* Checkmark Indicator */}
      <div className="absolute top-4 right-4 shrink-0">
        <div
          className={`h-5 w-5 rounded-full flex items-center justify-center transition-all ${
            selected
              ? 'text-indigo-600'
              : 'border border-slate-300 group-hover:border-indigo-400'
          }`}
        >
          {selected && <CheckCircle2 size={20} className="fill-indigo-600 text-white" />}
        </div>
      </div>
    </button>
  );
}