'use client';

import {
  useStartAppointment,
  useCompleteAppointment,
  useCheckInAppointment,
} from '../hooks/useStaffActions';

interface Props {
  appointment: any;
}

export default function StaffQueueCard({ appointment }: Props) {
  const startMutation = useStartAppointment();
  const completeMutation = useCompleteAppointment();
  const checkInMutation = useCheckInAppointment();

  const status = appointment.status;

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-3">

      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">{appointment.patient_name}</p>
          <p className="text-sm text-gray-500">
            {new Date(appointment.planned_time).toLocaleTimeString()}
          </p>
        </div>

        <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded">
          {status}
        </span>
      </div>

      <div className="flex gap-2">

        {status === 'SCHEDULED' && (
          <button
            onClick={() => checkInMutation.mutate(appointment.id)}
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
          >
            Check In
          </button>
        )}

        {status === 'CHECKED_IN' && (
          <button
            onClick={() => startMutation.mutate(appointment.id)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Start
          </button>
        )}

        {status === 'IN_PROGRESS' && (
          <button
            onClick={() => completeMutation.mutate(appointment.id)}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Complete
          </button>
        )}

      </div>
    </div>
  );
}