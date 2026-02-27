'use client';

import { format } from 'date-fns';

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
    return <p>No slots available</p>;
  }

  function formatTo12Hour(time: string) {
    const date = new Date(`1970-01-01T${time}:00`);
    return format(date, 'h:mm a'); // 1:00 PM
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {slots.map((slot) => {
        const isSelected = selected === slot;

        return (
          <button
            key={slot}
            onClick={() => onSelect(slot)}
            className={`p-3 rounded-lg border transition ${
              isSelected
                ? 'bg-black text-white'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            {formatTo12Hour(slot)}
          </button>
        );
      })}
    </div>
  );
}