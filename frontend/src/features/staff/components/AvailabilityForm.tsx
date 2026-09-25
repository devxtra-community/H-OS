'use client';

import { useState } from 'react';
import { useStaffAuth } from '../../../staff/auth/staff.auth.provider';
import { useSetAvailability } from '../hooks/useSetAvailability';
import { Calendar, Clock, CheckCircle2, AlertCircle, Save, Timer } from 'lucide-react';

const days = [
  { label: 'Sun', full: 'Sunday', value: 0 },
  { label: 'Mon', full: 'Monday', value: 1 },
  { label: 'Tue', full: 'Tuesday', value: 2 },
  { label: 'Wed', full: 'Wednesday', value: 3 },
  { label: 'Thu', full: 'Thursday', value: 4 },
  { label: 'Fri', full: 'Friday', value: 5 },
  { label: 'Sat', full: 'Saturday', value: 6 },
];

const slotOptions = [10, 15, 20, 30, 45, 60];

export default function AvailabilityForm() {
  const { auth } = useStaffAuth();
  const mutation = useSetAvailability();

  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState(15);

  const doctorId = auth.staff?.id;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!doctorId) return;

    mutation.mutate({
      doctorId,
      dayOfWeek,
      startTime,
      endTime,
      slotDuration,
    });
  }

  if (!doctorId) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center text-slate-500 animate-pulse">
        Loading physician profile...
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
          <Calendar size={22} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Set Weekly Consultation Shift
          </h2>
          <p className="text-xs text-slate-500">
            Configure your active hours and appointment slot intervals for patients to book
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Day Selection Chips */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Day of Week
          </label>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const isSelected = dayOfWeek === day.value;
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => setDayOfWeek(day.value)}
                  className={`py-3 rounded-xl text-xs font-semibold transition text-center cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 ring-2 ring-indigo-600'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <span className="hidden sm:inline">{day.full}</span>
                  <span className="sm:hidden">{day.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Operating Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={13} className="text-slate-400" />
              <span>Shift Start Time</span>
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-800 transition text-sm bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={13} className="text-slate-400" />
              <span>Shift End Time</span>
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-800 transition text-sm bg-white"
            />
          </div>
        </div>

        {/* Slot Duration Chips */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Timer size={13} className="text-slate-400" />
            <span>Consultation Slot Duration</span>
          </label>
          <div className="flex flex-wrap gap-2.5">
            {slotOptions.map((duration) => {
              const isSelected = slotDuration === duration;
              return (
                <button
                  key={duration}
                  type="button"
                  onClick={() => setSlotDuration(duration)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 ring-2 ring-indigo-600'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  {duration} mins
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-sm shadow-indigo-500/25 transition disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} />
            <span>{mutation.isPending ? 'Publishing Shift...' : 'Save Availability Shift'}</span>
          </button>
        </div>

        {/* Status Messages */}
        {mutation.isSuccess && (
          <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold animate-in fade-in-50">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>Consultation availability successfully updated! Patients can now book slots for this day.</span>
          </div>
        )}

        {mutation.isError && (
          <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold animate-in fade-in-50">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>Failed to update availability. Please check the timings and try again.</span>
          </div>
        )}
      </form>
    </div>
  );
}

