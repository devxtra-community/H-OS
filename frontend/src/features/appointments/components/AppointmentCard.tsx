'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Bed, User, Clock, Pill } from 'lucide-react';
import { useCancelAppointment } from '../hooks/useCancelAppointment';
import RescheduleModal from './RescheduleModal';
import { getCurrentAdmission } from '../../patient/api/getCurrentAdmission';
import { getPrescriptions } from '../../patient/api/getPrescriptions';
import { useEffect } from 'react';

interface Props {
  appointment: any;
}

const statusStyles: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-700",
  CHECKED_IN: "bg-yellow-100 text-yellow-700",
  IN_PROGRESS: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-gray-100 text-gray-600"
};

export default function AppointmentCard({ appointment }: Props) {

  const cancelMutation = useCancelAppointment();
  const [expanded, setExpanded] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);

  const [admission, setAdmission] = useState<any>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [isLoadingExtra, setIsLoadingExtra] = useState(false);

  useEffect(() => {
    if (expanded && !admission && prescriptions.length === 0) {
      const loadData = async () => {
        setIsLoadingExtra(true);
        try {
          const [adm, pres] = await Promise.all([
            getCurrentAdmission(),
            getPrescriptions()
          ]);
          setAdmission(adm);
          // Show all prescriptions for now, or filter by doctor if needed
          setPrescriptions(pres || []);
        } catch (err) {
          console.error("Failed to load extra appointment data", err);
        } finally {
          setIsLoadingExtra(false);
        }
      };
      loadData();
    }
  }, [expanded]);

  const appointmentDate = new Date(appointment.appointment_time);
  const now = new Date();

  const isPast = appointmentDate < now;

  const diffMinutes =
    (appointmentDate.getTime() - now.getTime()) / 60000;

  const canReschedule =
    appointment.status === 'SCHEDULED' &&
    diffMinutes >= 60;

  return (

    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">

      <div className="flex items-start justify-between">

        <div>

          {/* Date */}
          <p className="text-xs text-slate-400 font-medium">
            {appointmentDate.toLocaleDateString()}
          </p>

          {/* Doctor */}
          <h3 className="text-lg font-semibold text-slate-900 mt-1">
            Dr. {appointment.doctor_name}
          </h3>

          {/* Department */}
          <p className="text-sm text-blue-600 font-medium">
            {appointment.department}
          </p>

          {/* Time */}
          <p className="text-sm text-slate-500 mt-1">
            {appointmentDate.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>

        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 rounded-lg hover:bg-slate-100 transition"
        >
          {expanded
            ? <ChevronUp className="w-4 h-4 text-slate-500" />
            : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

      </div>

      {/* Status */}
      <div className="mt-3">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[appointment.status] || "bg-slate-100 text-slate-600"
            }`}
        >
          {appointment.status.replace("_", " ")}
        </span>
      </div>

      {/* Expanded section */}
      {expanded && (

        <div className="mt-4 pt-4 border-t border-slate-200 space-y-6">

          {isLoadingExtra ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Admission Status */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Bed size={16} className="text-blue-600" />
                  Admission Status
                </h4>
                {admission ? (
                  <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs">Ward</p>
                        <p className="font-medium">{admission.ward}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Bed</p>
                        <p className="font-medium">{admission.bed_number}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic ml-6">Not currently admitted</p>
                )}
              </div>

              {/* Prescriptions */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Pill size={16} className="text-green-600" />
                  Prescribed Medicines
                </h4>
                {prescriptions.length > 0 ? (
                  <div className="space-y-2">
                    {prescriptions.map((pres: any) => (
                      <div key={pres.id} className="bg-green-50/30 rounded-xl p-3 border border-green-100">
                        <p className="text-xs font-semibold text-green-700 mb-2">Prescription from Dr. {pres.doctor_name}</p>
                        <ul className="space-y-1">
                          {pres.items.map((item: any) => (
                            <li key={item.id} className="text-sm flex justify-between">
                              <span className="text-slate-700">{item.item_name} × {item.quantity}</span>
                              <span className="text-slate-500 text-xs italic">{item.instructions}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic ml-6">No medicines prescribed recently</p>
                )}
              </div>
            </>
          )}

          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
            {appointment.status === 'SCHEDULED' && !isPast && (
              <button
                onClick={() => cancelMutation.mutate(appointment.id)}
                disabled={cancelMutation.isPending}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition disabled:opacity-50"
              >
                {cancelMutation.isPending
                  ? 'Cancelling...'
                  : 'Cancel Appointment'}
              </button>
            )}

            {canReschedule && (
              <button
                onClick={() => setShowReschedule(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Reschedule
              </button>
            )}

            {appointment.status === 'CANCELLED' && (
              <span className="text-red-500 font-medium">
                Appointment Cancelled
              </span>
            )}
          </div>

        </div>

      )}

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