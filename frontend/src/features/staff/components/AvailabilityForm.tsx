'use client';

import { useState } from 'react';
import { useStaffAuth } from '../../../staff/auth/staff.auth.provider';
import { useSetAvailability } from '../hooks/useSetAvailability';

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function AvailabilityForm() {
  const { auth } = useStaffAuth();
  const mutation = useSetAvailability();

  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState(15);

  const doctorId = auth.staff?.id;

  function handleSubmit() {
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
    return <p>Loading doctor...</p>;
  }

  return (
    <div className="bg-white p-6 rounded shadow space-y-5 max-w-md">
      <h2 className="text-xl font-bold">
        Set Doctor Availability
      </h2>

      <div>
        <label className="block mb-1">Day</label>
        <select
          value={dayOfWeek}
          onChange={(e) =>
            setDayOfWeek(Number(e.target.value))
          }
          className="border p-2 w-full rounded"
        >
          {days.map((day, index) => (
            <option key={index} value={index}>
              {day}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1">Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) =>
            setStartTime(e.target.value)
          }
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label className="block mb-1">End Time</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) =>
            setEndTime(e.target.value)
          }
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label className="block mb-1">
          Slot Duration (minutes)
        </label>
        <input
          type="number"
          min={5}
          step={5}
          value={slotDuration}
          onChange={(e) =>
            setSlotDuration(Number(e.target.value))
          }
          className="border p-2 w-full rounded"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={mutation.isPending}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded font-semibold"
      >
        {mutation.isPending ? 'Saving...' : 'Save'}
      </button>

      {mutation.isSuccess && (
        <p className="text-green-600">
          Availability saved successfully!
        </p>
      )}

      {mutation.isError && (
        <p className="text-red-600">
          Failed to save availability.
        </p>
      )}
    </div>
  );
}