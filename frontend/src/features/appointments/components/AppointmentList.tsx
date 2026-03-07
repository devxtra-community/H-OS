'use client';

import AppointmentCard from './AppointmentCard';
import { CalendarX } from 'lucide-react';

interface Props {
  appointments: any[];
}

export default function AppointmentList({ appointments }: Props) {
  // Enhanced Empty State
  if (!appointments.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
        <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 mb-4">
          <CalendarX size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No appointments found</h3>
        <p className="text-slate-500 text-sm mt-1 text-center max-w-[250px]">
          We couldn't find any scheduled visits in your history.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Optional: Simple timeline line decoration for desktop */}
      <div className="hidden lg:block absolute left-[40px] top-0 bottom-0 w-[2px] bg-slate-100 -z-10" />
      
      <div className="space-y-6">
        {appointments.map((appt) => (
          <AppointmentCard
            key={appt.id}
            appointment={appt}
          />
        ))}
      </div>
    </div>
  );
}