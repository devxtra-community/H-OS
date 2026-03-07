'use client';

import { format } from 'date-fns';
import { Clock } from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
        <Clock className="text-slate-300 mb-2" size={24} />
        <p className="text-slate-500 text-sm font-medium">No slots available for this date</p>
      </div>
    );
  }

  function formatTo12Hour(time: string) {
    // Handling potential "HH:mm" or "HH:mm:ss" formats
    const timeParts = time.split(':');
    const date = new Date();
    date.setHours(parseInt(timeParts[0], 10));
    date.setMinutes(parseInt(timeParts[1], 10));
    return format(date, 'h:mm a'); 
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {slots.map((slot) => {
        const isSelected = selected === slot;

        return (
          <button
            key={slot}
            type="button" // Prevent accidental form submission
            onClick={() => onSelect(slot)}
            className={`relative group flex flex-col items-center justify-center py-4 px-2 rounded-2xl border-2 transition-all duration-200 active:scale-95
              ${isSelected
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                : 'bg-white border-slate-100 text-slate-600 hover:border-blue-100 hover:bg-blue-50/30'
              }`}
          >
            <span className={`text-sm font-bold tracking-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
              {formatTo12Hour(slot).split(' ')[0]}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
              {formatTo12Hour(slot).split(' ')[1]}
            </span>

            {/* Subtle dot indicator for selected state */}
            {isSelected && (
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
}