'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCancelAppointment } from '../hooks/useCancelAppointment';
import RescheduleModal from './RescheduleModal';

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
    className={`px-3 py-1 text-xs font-semibold rounded-full ${
      statusStyles[appointment.status] || "bg-slate-100 text-slate-600"
    }`}
  >
    {appointment.status.replace("_", " ")}
  </span>
</div>

      {/* Expanded section */}
      {expanded && (

        <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">

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