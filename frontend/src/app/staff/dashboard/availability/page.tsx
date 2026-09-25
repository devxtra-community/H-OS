import AvailabilityForm from '../../../../features/staff/components/AvailabilityForm';
import { Calendar } from 'lucide-react';

export default function AvailabilityPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-500/20">
          <Calendar size={20} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Manage Availability
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Define consultation windows and slot intervals for patient bookings
          </p>
        </div>
      </div>

      <AvailabilityForm />
    </div>
  );
}