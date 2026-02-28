'use client';

import { useMyStatus } from '../hooks/useMyStatus';

export default function MyQueueCard() {
  
  const { data, isLoading } = useMyStatus();

  if (isLoading) return <p>Loading queue...</p>;
  if (!data || 'message' in data)
    return <p>No active appointment today.</p>;

  const estimatedStart = data.estimated_start_time
    ? new Date(data.estimated_start_time)
    : null;
    console.log("Queue data:", data);

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">

      <h2 className="text-xl font-semibold">
        Your Appointment Status
      </h2>

      {/* ========================= */}
      {/* SCHEDULED + CHECKED_IN */}
      {/* ========================= */}
      {(data.status === 'SCHEDULED' ||
        data.status === 'CHECKED_IN') && (
        <>
          <div className="grid grid-cols-2 gap-4">

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Your Position</p>
              <p className="text-2xl font-bold text-blue-600">
                #{data.position}
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Patients Ahead
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {data.patients_ahead}
              </p>
            </div>

          </div>

          <div className="space-y-2">

            {data.status === 'CHECKED_IN' && (
              <p className="text-blue-600 font-medium">
                Waiting for doctor to start your consultation
              </p>
            )}

            {estimatedStart && (
              <p>
                <strong>Estimated Start:</strong>{' '}
                {estimatedStart.toLocaleTimeString()}
              </p>
            )}

            {data.delay_minutes > 0 && (
              <p className="text-red-600">
                Running {data.delay_minutes} mins late
              </p>
            )}

          </div>
        </>
      )}

      {/* ========================= */}
      {/* IN_PROGRESS */}
      {/* ========================= */}
      {data.status === 'IN_PROGRESS' && (
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-lg font-semibold text-green-700">
            Your consultation is in progress
          </p>
        </div>
      )}

      {/* ========================= */}
      {/* COMPLETED */}
      {/* ========================= */}
      {data.status === 'COMPLETED' && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="font-semibold text-gray-700">
            Consultation completed
          </p>
        </div>
      )}

    </div>
  );
}