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
import { useRequestAdmission } from '../../../../features/admissions/hooks/useRequestAdmission';
import { Activity, Clock, Users, Timer, CheckCircle, AlertCircle } from 'lucide-react';
import { PrescribeModal } from '../../../../features/pharmacy/components/PrescribeModal';

export default function QueuePage() {
  const { auth } = useStaffAuth();
  const doctorId = auth.staff?.id;

  const [showEmergency, setShowEmergency] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [prescribePatient, setPrescribePatient] = useState<{ id: string, name: string } | null>(null);

  if (auth.isRestoring) return (
    <div className="flex justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
    </div>
  );
  if (!doctorId) return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 text-slate-500 text-center">
      Doctor information not available.
    </div>
  );

  const { data, isLoading } = useDoctorQueue(doctorId);

  const startMutation = useStartAppointment();
  const completeMutation = useCompleteAppointment();
  const checkInMutation = useCheckInAppointment();
  const emergencyMutation = useEmergency(doctorId);
  const admitMutation = useRequestAdmission();

  if (isLoading) return (
    <div className="flex justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
    </div>
  );
  if (!data) return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 text-slate-500 text-center">
      No queue found.
    </div>
  );

  const { queue, doctor_status } = data;
  const someoneInProgress = queue.some((q: any) => q.status === 'IN_PROGRESS');

  return (
    <div className="space-y-8">

      {/* 🔴 Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
            <Activity size={24} />
          </div>
          Today's Queue
        </h1>

        <button
          onClick={() => setShowEmergency(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-red-700 transition font-medium"
        >
          <AlertCircle size={20} />
          Emergency Case
        </button>
      </div>

      {/* Doctor Status Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition">
          <div className="p-3 rounded-xl bg-blue-100 text-blue-600"><Users size={22} /></div>
          <div>
            <p className="text-sm text-slate-500">Total Appointments</p>
            <p className="text-xl font-bold">{doctor_status.total_appointments}</p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition">
          <div className="p-3 rounded-xl bg-green-100 text-green-600"><CheckCircle size={22} /></div>
          <div>
            <p className="text-sm text-slate-500">Checked In</p>
            <p className="text-xl font-bold">{doctor_status.checked_in_count}</p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-600"><Clock size={22} /></div>
          <div>
            <p className="text-sm text-slate-500">Current Delay</p>
            <p className="text-xl font-bold">{doctor_status.doctor_delay_minutes} min</p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition">
          <div className="p-3 rounded-xl bg-purple-100 text-purple-600"><Timer size={22} /></div>
          <div>
            <p className="text-sm text-slate-500">Remaining Time</p>
            <p className="text-xl font-bold">{doctor_status.remaining_queue_minutes} min</p>
          </div>
        </div>

      </div>

      {/* Queue List */}
      <div className="grid grid-cols-1 gap-4">
        {queue.length === 0 ? (
          <div className="bg-white rounded-2xl border shadow-sm p-6 text-slate-500 text-center">
            The queue is currently empty.
          </div>
        ) : queue.map((item: any) => (
          <div
            key={item.id}
            className={`p-6 rounded-2xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition ${item.priority === 'HIGH'
              ? 'bg-rose-50 border-rose-200'
              : item.is_current
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-white hover:shadow-md'
              }`}
          >

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border border-slate-300">
                {item.patient_name?.charAt(0) || '?'}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-lg">
                  {item.patient_name} <span className="text-sm font-normal text-slate-500">({item.patient_id.split('-')[0]}...)</span>
                </p>
                <div className="flex gap-2 mt-1">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${item.status === 'SCHEDULED' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                    item.status === 'CHECKED_IN' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      item.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full border bg-slate-100 text-slate-600 border-slate-200">
                    Pos: {item.position}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">

              {/* Check In */}
              {item.status === 'SCHEDULED' && (
                <button
                  onClick={() => checkInMutation.mutate(item.id)}
                  className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-sm font-medium transition shadow-sm"
                >
                  Check In
                </button>
              )}

              {/* Start Consultation */}
              {item.status === 'CHECKED_IN' && !someoneInProgress && (
                <button
                  onClick={() => startMutation.mutate(item.id)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition shadow-sm"
                >
                  Start Consult
                </button>
              )}

              {/* Complete Consultation */}
              {item.status === 'IN_PROGRESS' && (
                <>
                  <button
                    onClick={() => setPrescribePatient({ id: item.patient_id, name: item.patient_name })}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition shadow-sm"
                  >
                    Prescribe
                  </button>

                  <button
                    onClick={() => completeMutation.mutate(item.id)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition shadow-sm"
                  >
                    Complete
                  </button>

                  {/* 🏥 Admit Patient */}
                  {item.admission_requested ? (
                    <span className="px-5 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-sm font-medium border border-slate-200 cursor-not-allowed shadow-sm">
                      Request Sent
                    </span>
                  ) : (
                    <button
                      disabled={admitMutation.isPending}
                      onClick={() =>
                        admitMutation.mutate({
                          patientId: item.patient_id,
                          doctorId: doctorId,
                          departmentId: auth.staff?.department_id as string
                        })
                      }
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition disabled:opacity-50 shadow-sm"
                    >
                      {admitMutation.isPending
                        ? 'Admitting...'
                        : 'Admit Patient'}
                    </button>
                  )}
                </>
              )}

            </div>

          </div>
        ))}
      </div>

      {/* 🔴 Emergency Modal */}
      {showEmergency && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md space-y-6 shadow-2xl">

            <div className="flex items-center gap-3 border-b pb-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-full">
                <AlertCircle size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Create Emergency Case
              </h2>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Patient ID</label>
              <input
                type="text"
                placeholder="Enter full UUID..."
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setShowEmergency(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 font-medium text-slate-700 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  emergencyMutation.mutate(patientId);
                  setShowEmergency(false);
                  setPatientId('');
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-md transition"
              >
                Confirm Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔴 Prescribe Modal */}
      {prescribePatient && (
        <PrescribeModal
          patientId={prescribePatient.id}
          patientName={prescribePatient.name}
          onClose={() => setPrescribePatient(null)}
        />
      )}

    </div>
  );
}