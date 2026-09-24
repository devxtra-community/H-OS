'use client';

import { format } from 'date-fns';
import { Clock, Check } from 'lucide-react';

interface Props {
  slots: string[];
  selected: string | null;
  onSelect: (slot: string) => void;
}

export default function SlotSelector({
  slots,
  selected,
  onSelect,
}: Props) {
  if (!slots.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 text-center">
        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5">
          <Clock size={20} />
        </div>
        <p className="text-sm font-semibold text-slate-700">No Available Slots</p>
        <p className="text-xs text-slate-400 mt-0.5 max-w-xs">
          All consultation slots for this doctor on this date are filled or the doctor is off duty.
        </p>
      </div>
    );
  }

  function formatTo12Hour(time: string) {
    const timeParts = time.split(':');
    const date = new Date();
    date.setHours(parseInt(timeParts[0], 10));
    date.setMinutes(parseInt(timeParts[1], 10));
    return format(date, 'h:mm a');
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {slots.map((slot) => {
          const isSelected = selected === slot;
          const formatted = formatTo12Hour(slot);
          const [timePart, meridiem] = formatted.split(' ');

          return (
            <button
              key={slot}
              type="button"
              onClick={() => onSelect(slot)}
              className={`relative flex items-center justify-center gap-1.5 py-3 px-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-97 ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-200 ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/30'
              }`}
            >
              <span>{timePart}</span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isSelected ? 'text-indigo-200' : 'text-slate-400'
                }`}
              >
                {meridiem}
              </span>

              {isSelected && (
                <span className="ml-1">
                  <Check size={13} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}