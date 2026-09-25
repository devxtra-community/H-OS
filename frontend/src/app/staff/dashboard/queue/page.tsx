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
import {
  Activity,
  Clock,
  Users,
  Timer,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Stethoscope,
  Pill,
  Bed,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { PrescribeModal } from '../../../../features/pharmacy/components/PrescribeModal';
import { useDepartments, useDoctorsByDepartment } from '../../../../features/staff/hooks/useStaffData';

export default function QueuePage() {
  const { auth } = useStaffAuth();
  const isDoctor = auth.staff?.role === 'DOCTOR';

  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(isDoctor ? auth.staff?.id : '');
  const [showEmergency, setShowEmergency] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [prescribePatient, setPrescribePatient] = useState<{ id: string, name: string } | null>(null);

  const { data: departments } = useDepartments();
  const { data: doctorsInDept, isLoading: isLoadingDoctors } = useDoctorsByDepartment(selectedDeptId);

  const statuses = isDoctor ? ['CHECKED_IN', 'IN_PROGRESS'] : ['SCHEDULED', 'CHECKED_IN', 'IN_PROGRESS'];
  const { data, isLoading } = useDoctorQueue(selectedDoctorId, statuses);

  const startMutation = useStartAppointment();
  const completeMutation = useCompleteAppointment();
  const checkInMutation = useCheckInAppointment();
  const emergencyMutation = useEmergency(selectedDoctorId || '');
  const admitMutation = useRequestAdmission();

  if (auth.isRestoring) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-100 border-t-indigo-600" />
    </div>
  );

  if (!isDoctor && !selectedDoctorId) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200/80 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Activity size={32} />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Staff Check-in Panel</h2>
            <p className="text-sm text-slate-500">Select a specialty department and attending physician to manage their patient queue.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Department</label>
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white font-medium text-slate-800 transition text-sm"
              >
                <option value="">Select Department...</option>
                {departments?.map((dept: any) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Doctor</label>
              <select
                disabled={!selectedDeptId || isLoadingDoctors}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white disabled:bg-slate-50 disabled:text-slate-400 font-medium text-slate-800 transition text-sm"
                value=""
              >
                <option value="">
                  {isLoadingDoctors ? 'Loading doctors...' : selectedDeptId ? 'Select Doctor...' : 'Select Department first...'}
                </option>
                {doctorsInDept?.map((doc: any) => (
                  <option key={doc.id} value={doc.id}>{doc.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const doctorId = selectedDoctorId;

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-100 border-t-indigo-600" />
    </div>
  );

  if (!data) return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 text-slate-500 text-center space-y-3">
        <p className="font-semibold text-slate-800">No active queue session found for this physician.</p>
        {!isDoctor && (
          <button
            onClick={() => setSelectedDoctorId('')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
          >
            <RotateCcw size={14} />
            Switch Doctor
          </button>
        )}
      </div>
    </div>
  );

  const { queue, doctor_status } = data;
  const someoneInProgress = queue.some((q: any) => q.status === 'IN_PROGRESS');

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-sm shadow-indigo-500/25">
            <Activity size={24} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {isDoctor ? "Today's Clinical Queue" : "Staff Check-in Terminal"}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Sync
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Real-time patient flow, triage status, and consultation controls
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {!isDoctor && (
            <button
              onClick={() => setSelectedDoctorId('')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition"
            >
              <RotateCcw size={14} />
              Switch Doctor
            </button>
          )}

          <button
            onClick={() => setShowEmergency(true)}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-rose-500/25 transition cursor-pointer"
          >
            <AlertCircle size={16} />
            <span>Emergency Case</span>
          </button>
        </div>
      </div>

      {/* Doctor Status Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Appointments</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{doctor_status.total_appointments}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
            <UserCheck size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Checked In</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{doctor_status.checked_in_count}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Schedule Delay</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{doctor_status.doctor_delay_minutes} min</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600 shrink-0">
            <Timer size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Remaining Queue</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{doctor_status.remaining_queue_minutes} min</p>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Queued Patients</span>
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {queue.length}
            </span>
          </h2>
        </div>

        {queue.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">
                {isDoctor ? "No patients waiting in queue." : "No upcoming appointments for this doctor."}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                New checked-in visits will populate automatically in real-time.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map((item: any) => {
              const isEmergency = item.priority === 'HIGH';
              const isInProgress = item.status === 'IN_PROGRESS';

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 ${
                    isEmergency
                      ? 'bg-rose-50/70 border-rose-200 ring-1 ring-rose-300'
                      : isInProgress
                        ? 'bg-blue-50/60 border-blue-200 ring-1 ring-blue-300'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${
                      isEmergency
                        ? 'bg-rose-600 text-white'
                        : isInProgress
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.patient_name?.charAt(0) || 'P'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-slate-900 text-base">
                          {item.patient_name}
                        </p>
                        <span className="text-xs text-slate-400">
                          (ID: {item.patient_id.slice(0, 8)}...)
                        </span>

                        {isEmergency && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
                            EMERGENCY
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                          item.status === 'SCHEDULED' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                          item.status === 'CHECKED_IN' ? 'bg-amber-50 text-amber-700 border-amber-200/70' :
                          item.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-200/70' :
                          'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'SCHEDULED' ? 'bg-slate-400' :
                            item.status === 'CHECKED_IN' ? 'bg-amber-500' :
                            item.status === 'IN_PROGRESS' ? 'bg-blue-500 animate-pulse' :
                            'bg-emerald-500'
                          }`} />
                          {item.status.replace('_', ' ')}
                        </span>

                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full border bg-slate-50 text-slate-600 border-slate-200">
                          Queue Pos: #{item.position}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 flex-wrap border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    {/* Check In - STAFF ONLY */}
                    {!isDoctor && item.status === 'SCHEDULED' && (
                      <button
                        onClick={() => checkInMutation.mutate(item.id)}
                        disabled={checkInMutation.isPending}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold transition shadow-xs disabled:opacity-50"
                      >
                        <UserCheck size={14} />
                        {checkInMutation.isPending ? 'Checking In...' : 'Check In'}
                      </button>
                    )}

                    {/* Start Consultation - DOCTOR ONLY */}
                    {isDoctor && item.status === 'CHECKED_IN' && !someoneInProgress && (
                      <button
                        onClick={() => startMutation.mutate(item.id)}
                        disabled={startMutation.isPending}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition shadow-xs disabled:opacity-50"
                      >
                        <Play size={14} />
                        {startMutation.isPending ? 'Starting...' : 'Start Consult'}
                      </button>
                    )}

                    {/* Complete Consultation - DOCTOR ONLY */}
                    {isDoctor && item.status === 'IN_PROGRESS' && (
                      <>
                        <button
                          onClick={() => setPrescribePatient({ id: item.patient_id, name: item.patient_name })}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold transition"
                        >
                          <Pill size={14} />
                          Prescribe
                        </button>

                        <button
                          onClick={() => completeMutation.mutate(item.id)}
                          disabled={completeMutation.isPending}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition shadow-xs disabled:opacity-50"
                        >
                          <CheckCircle size={14} />
                          {completeMutation.isPending ? 'Completing...' : 'Complete'}
                        </button>

                        {/* Admit Patient */}
                        {item.admission_requested ? (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-medium border border-slate-200 cursor-not-allowed">
                            <Bed size={14} />
                            Admit Requested
                          </span>
                        ) : (
                          <button
                            disabled={admitMutation.isPending}
                            onClick={() =>
                              admitMutation.mutate({
                                patientId: item.patient_id,
                                doctorId: doctorId as string,
                                departmentId: auth.staff?.department_id as string
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition disabled:opacity-50"
                          >
                            <Bed size={14} />
                            {admitMutation.isPending ? 'Requesting...' : 'Admit Patient'}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Emergency Modal */}
      {showEmergency && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl w-full max-w-md space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Register Emergency Case
                </h2>
                <p className="text-xs text-slate-500">Bypasses queue position for immediate triage</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Patient UUID / Reference</label>
              <input
                type="text"
                placeholder="Enter patient ID..."
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowEmergency(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-xs text-slate-700 transition"
              >
                Cancel
              </button>

              <button
                disabled={!patientId.trim() || emergencyMutation.isPending}
                onClick={() => {
                  emergencyMutation.mutate(patientId);
                  setShowEmergency(false);
                  setPatientId('');
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-xs shadow-sm transition disabled:opacity-50"
              >
                {emergencyMutation.isPending ? 'Registering...' : 'Confirm Emergency'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prescribe Modal */}
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