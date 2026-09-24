import BookingForm from '../../../../features/appointments/components/BookingForm';
import { CalendarPlus, ShieldCheck } from 'lucide-react';

export default function BookPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Book Appointment
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <CalendarPlus size={12} />
              Outpatient
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Select a specialty department, choose an available physician, and schedule your visit.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Real-time Doctor Availability</span>
        </div>
      </div>

      {/* Main Content */}
      <BookingForm />
    </div>
  );
}