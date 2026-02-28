'use client';

import { useState } from 'react';
import { useStaffAuth } from '../../../../staff/auth/staff.auth.provider';
import { useDoctorQueue } from '../../../../features/appointments/hooks/useDoctorQueue';
import {
  useStartAppointment,
  useCompleteAppointment,
  useCheckInAppointment,
} from '../../../../features/appointments/hooks/useStaffActions';
import { useEmergency } from '../../../../features/appointments/hooks/useEmergency';

export default function QueuePage() {
  const { auth } = useStaffAuth();
  const doctorId = auth.staff?.id;

  const [showEmergency, setShowEmergency] = useState(false);
  const [patientId, setPatientId] = useState('');

  if (auth.isRestoring) return <p>Loading authentication...</p>;
  if (!doctorId) return <p>Doctor information not available.</p>;

  const { data, isLoading } = useDoctorQueue(doctorId);

  const startMutation = useStartAppointment();
  const completeMutation = useCompleteAppointment();
  const checkInMutation = useCheckInAppointment();
  const emergencyMutation = useEmergency(doctorId);

  if (isLoading) return <p>Loading queue...</p>;
  if (!data) return <p>No queue found.</p>;

  const { queue, doctor_status } = data;
  const someoneInProgress = queue.some((q: any) => q.status === 'IN_PROGRESS');

  return (
    <div className="space-y-8">

      {/* 🔴 Emergency Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Today's Queue</h1>

        <button
          onClick={() => setShowEmergency(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
        >
          + Emergency Case
        </button>
      </div>

      {/* Doctor Status Panel */}
      <div className="bg-white p-6 rounded shadow space-y-2">
        <p><strong>Total:</strong> {doctor_status.total_appointments}</p>
        <p><strong>Checked In:</strong> {doctor_status.checked_in_count}</p>
        <p><strong>Delay:</strong> {doctor_status.doctor_delay_minutes} min</p>
        <p><strong>Remaining:</strong> {doctor_status.remaining_queue_minutes} min</p>
      </div>

      {/* Queue List */}
      <div className="space-y-4">
        {queue.map((item: any) => (
          <div
            key={item.id}
            className={`p-4 rounded border shadow-sm ${
              item.priority === 'HIGH'
                ? 'bg-red-50 border-red-300'
                : item.is_current
                ? 'bg-green-100 border-green-400'
                : 'bg-white'
            }`}
          >
            <p className="font-semibold">
              Patient ID: {item.patient_id}
            </p>
            <p>Status: {item.status}</p>
            <p>Position: {item.position}</p>

            <div className="flex gap-2 mt-3">

              {item.status === 'SCHEDULED' && (
                <button
                  onClick={() => checkInMutation.mutate(item.id)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                >
                  Check In
                </button>
              )}

              {item.status === 'CHECKED_IN' && !someoneInProgress && (
                <button
                  onClick={() => startMutation.mutate(item.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Start
                </button>
              )}

              {item.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => completeMutation.mutate(item.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                >
                  Complete
                </button>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* 🔴 Emergency Modal */}
      {showEmergency && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-xl">

            <h2 className="text-xl font-semibold text-red-600">
              Create Emergency Case
            </h2>

            <input
              type="text"
              placeholder="Enter Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowEmergency(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  emergencyMutation.mutate(patientId);
                  setShowEmergency(false);
                  setPatientId('');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Confirm Emergency
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}