'use client';

import { useState } from 'react';
import { useCancelAppointment } from '../hooks/useCancelAppointment';
import RescheduleModal from './RescheduleModal';

interface Props {
  appointment: any;
}

export default function AppointmentCard({ appointment }: Props) {
  console.log(appointment);
  const cancelMutation = useCancelAppointment();
  const [showReschedule, setShowReschedule] = useState(false);

  const appointmentDate = new Date(appointment.appointment_time);
  const now = new Date();

  const isPast = appointmentDate < now;

  const diffMinutes =
    (appointmentDate.getTime() - now.getTime()) / 60000;

  const canReschedule =
    appointment.status === 'SCHEDULED' &&
    diffMinutes >= 60;

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-2">
      <p>
        <strong>Doctor:</strong> {appointment.doctor_id}
      </p>

      <p>
        <strong>Date:</strong>{' '}
        {appointmentDate.toLocaleString()}
      </p>

      <p>
        <strong>Status:</strong> {appointment.status}
      </p>

      {/* Cancel */}
      {appointment.status === 'SCHEDULED' && !isPast && (
        <button
          onClick={() =>
            cancelMutation.mutate(appointment.id)
          }
          disabled={cancelMutation.isPending}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition disabled:opacity-50"
        >
          {cancelMutation.isPending
            ? 'Cancelling...'
            : 'Cancel'}
        </button>
      )}

      {/* Reschedule */}
      {canReschedule && (
        <button
          onClick={() => setShowReschedule(true)}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
        >
          Reschedule
        </button>
      )}

      {/* Cancelled label */}
      {appointment.status === 'CANCELLED' && (
        <span className="text-red-500 font-medium">
          Cancelled
        </span>
      )}

      {/* Modal */}
      {showReschedule && (
        <RescheduleModal
          appointmentId={appointment.id}
          doctorId={appointment.doctor_id}
          onClose={() => setShowReschedule(false)}
        />
      )}
    </div>
  );
}