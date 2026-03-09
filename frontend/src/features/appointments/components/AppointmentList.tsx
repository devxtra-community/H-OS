'use client';

import AppointmentCard from './AppointmentCard';
import { CalendarX } from 'lucide-react';

interface Props {
  appointments: any[];
}

export default function AppointmentList({ appointments }: Props) {

  if (!appointments.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
        <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 mb-4">
          <CalendarX size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No appointments found</h3>
        <p className="text-slate-500 text-sm mt-1 text-center max-w-62.5">
          We couldn't find any scheduled visits in your history.
        </p>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto">

      {/* Timeline line */}
      <div className="absolute left-5.5 top-0 bottom-0 w-0.5 bg-slate-200" />

      <div className="space-y-6">

        {appointments.map((appt, i) => (

          <div
            key={appt.id}
            className="relative pl-12 animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >

            {/* Timeline dot */}
            <div className="absolute left-2.5 top-6 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow" />

            <AppointmentCard appointment={appt} />

          </div>

        ))}

      </div>

    </div>
  );
}