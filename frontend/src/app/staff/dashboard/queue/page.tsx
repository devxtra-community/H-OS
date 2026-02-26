'use client';

import { useStaffAuth } from '../../../../staff/auth/staff.auth.provider';
import { useDoctorQueue } from '../../../../features/appointments/hooks/useDoctorQueue';

export default function QueuePage() {
  const { auth } = useStaffAuth();

  const doctorId = auth.staff?.id;

  // Wait until auth restoration finishes
  if (auth.isRestoring) {
    return <p>Loading authentication...</p>;
  }

  if (!doctorId) {
    return <p>Doctor information not available.</p>;
  }

  const { data, isLoading, isError } =
    useDoctorQueue(doctorId);

  if (isLoading) return <p>Loading queue...</p>;
  if (isError) return <p>Failed to load queue.</p>;
  if (!data) return <p>No queue found.</p>;

  const { queue, doctor_status } = data;

  return (
    <div className="space-y-8">

      <h1 className="text-2xl font-bold">
        Today's Queue
      </h1>

      {/* Doctor Status Panel */}
      <div className="bg-white p-6 rounded shadow space-y-2">
        <p>
          <strong>Total Appointments:</strong>{' '}
          {doctor_status.total_appointments}
        </p>
        <p>
          <strong>Checked In:</strong>{' '}
          {doctor_status.checked_in_count}
        </p>
        <p>
          <strong>Doctor Delay:</strong>{' '}
          {doctor_status.doctor_delay_minutes} min
        </p>
        <p>
          <strong>Remaining Queue:</strong>{' '}
          {doctor_status.remaining_queue_minutes} min
        </p>
      </div>

      {/* Queue List */}
      <div className="space-y-4">
        {queue.map((item: any) => (
          <div
            key={item.id}
            className={`p-4 rounded border shadow-sm ${
              item.is_current
                ? 'bg-green-100 border-green-400'
                : item.priority === 'HIGH'
                ? 'bg-red-50 border-red-300'
                : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  Patient ID: {item.patient_id}
                </p>
                <p>Status: {item.status}</p>
                <p>Position: {item.position}</p>
                <p>Delay: {item.delay_minutes} min</p>
              </div>

              {item.priority === 'HIGH' && (
                <span className="px-3 py-1 text-sm bg-red-500 text-white rounded-full">
                  HIGH
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}