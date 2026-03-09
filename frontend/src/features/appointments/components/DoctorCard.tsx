'use client';

import { Stethoscope, Clock } from 'lucide-react';

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

  return (

    <button
      type="button"
      onClick={() => onSelect(doctor.id)}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition
      ${
        selected
          ? 'border-blue-600 bg-blue-50'
          : 'border-slate-200 hover:border-blue-300'
      }`}
    >

      {/* Avatar */}

      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
        <Stethoscope size={20} className="text-blue-600" />
      </div>

      {/* Doctor Info */}

      <div className="flex flex-col text-left">

        <span className="font-semibold text-slate-900">
          Dr. {doctor.name}
        </span>

        <span className="text-sm text-slate-500">
          {doctor.job_title}
        </span>

        {/* Availability */}

        {doctor.start_time && doctor.end_time && (
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">

            <Clock size={14} />

            <span>
              {formatTime(doctor.start_time)} – {formatTime(doctor.end_time)}
            </span>

          </div>
        )}

      </div>

    </button>

  );
}