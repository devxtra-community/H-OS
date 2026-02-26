'use client';

import { useCancelAppointment } from '../hooks/useCancelAppointment';

interface Props {
  appointment: any;
}

export default function AppointmentCard({ appointment }: Props) {
  const cancelMutation = useCancelAppointment();

  const isPast =
    new Date(appointment.appointment_time) < new Date();

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-2">
      <p>
        <strong>Doctor:</strong> {appointment.doctor_name}
      </p>

      <p>
        <strong>Date:</strong>{' '}
        {new Date(
          appointment.appointment_time
        ).toLocaleString()}
      </p>

      <p>
        <strong>Status:</strong> {appointment.status}
      </p>

      {/* ✅ Cancel button */}
      {appointment.status !== 'CANCELLED' && !isPast && (
        <button
          onClick={() =>
            cancelMutation.mutate(appointment.id)
          }
          disabled={cancelMutation.isPending}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 cursor-pointer rounded text-sm transition disabled:opacity-50"
        >
          {cancelMutation.isPending
            ? 'Cancelling...'
            : 'Cancel'}
        </button>
      )}

      {/* Show cancelled label */}
      {appointment.status === 'CANCELLED' && (
        <span className="text-red-500 font-medium">
          Cancelled
        </span>
      )}
    </div>
  );
}