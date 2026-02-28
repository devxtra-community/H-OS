'use client';

import { useState } from 'react';
import { useAvailableSlots } from '../hooks/useAvailableSlots';
import { useRescheduleAppointment } from '../hooks/useRescheduleAppointment';
import SlotSelector from './SlotSelector';

type Props = {
  appointmentId: string;
  doctorId: string;
  onClose: () => void;
};

export default function RescheduleModal({
  appointmentId,
  doctorId,
  onClose,
}: Props) {
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { data: slots = [] } = useAvailableSlots(doctorId, date);
  const mutation = useRescheduleAppointment();

  function handleReschedule() {
    if (!selectedSlot || !date) return;

    const fullDateTime = `${date}T${selectedSlot}:00`;

    mutation.mutate(
      {
        appointmentId,
        newTime: fullDateTime,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96 space-y-4">
        <h2 className="text-lg font-semibold">Reschedule Appointment</h2>

        <input
          type="date"
          className="border p-2 w-full rounded-lg"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setSelectedSlot(null);
          }}
          min={new Date().toISOString().split('T')[0]}
        />

        {slots.length > 0 && (
          <SlotSelector
            slots={slots}
            selected={selectedSlot}
            onSelect={setSelectedSlot}
          />
        )}

        <button
          onClick={handleReschedule}
          disabled={!selectedSlot || mutation.isPending}
          className="bg-blue-600 text-white w-full p-2 rounded-lg"
        >
          {mutation.isPending ? 'Rescheduling...' : 'Confirm Reschedule'}
        </button>

        {mutation.isError && (
          <p className="text-red-500 text-sm">
            {(mutation.error as any)?.response?.data?.error}
          </p>
        )}

        <button
          onClick={onClose}
          className="text-gray-500 text-sm w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}