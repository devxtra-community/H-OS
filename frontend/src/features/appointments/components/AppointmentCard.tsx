'use client';

import { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Bed,
  User,
  Clock,
  Pill,
  Calendar,
  AlertCircle,
  CalendarClock,
  XCircle,
  Stethoscope
} from 'lucide-react';
import { useCancelAppointment } from '../hooks/useCancelAppointment';
import RescheduleModal from './RescheduleModal';
import { getCurrentAdmission } from '../../patient/api/getCurrentAdmission';
import { getPrescriptions } from '../../patient/api/getPrescriptions';
import {
  formatAppointmentDate,
  formatAppointmentTime,
  getWallClockNow,
} from '@/src/lib/dateUtils';

interface Props {
  appointment: any;
}

const statusConfig: Record<string, { label: string; badge: string; dot: string }> = {
  SCHEDULED: {
    label: "Scheduled",
    badge: "bg-blue-50 text-blue-700 border-blue-200/60",
    dot: "bg-blue-500",
  },
  CHECKED_IN: {
    label: "Checked In",
    badge: "bg-amber-50 text-amber-700 border-amber-200/60",
    dot: "bg-amber-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    badge: "bg-purple-50 text-purple-700 border-purple-200/60",
    dot: "bg-purple-500",
  },
  COMPLETED: {
    label: "Completed",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    badge: "bg-rose-50 text-rose-700 border-rose-200/60",
    dot: "bg-rose-500",
  },
  NO_SHOW: {
    label: "No Show",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
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
  const now = getWallClockNow();

  const isPast = appointmentDate < now;
  const diffMinutes = (appointmentDate.getTime() - now.getTime()) / 60000;
  const canReschedule = appointment.status === 'SCHEDULED' && diffMinutes >= 60;

  const currentStatus = statusConfig[appointment.status] || {
    label: appointment.status?.replace('_', ' ') || 'Status',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  };

  const doctorInitials = appointment.doctor_name
    ? appointment.doctor_name
        .split(' ')
        .filter((n: string) => n.length > 0)
        .slice(0, 2)
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    : 'DR';

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 hover:border-slate-300 transition group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Doctor & Info */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-blue-500/20">
              {doctorInitials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-xs">
              <Stethoscope size={11} className="text-blue-600" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Dr. {appointment.doctor_name}
              </h3>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${currentStatus.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`}></span>
                {currentStatus.label}
              </span>
            </div>

            <p className="text-xs font-medium text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded-md">
              {appointment.department}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" />
                <span>{formatAppointmentDate(appointment.appointment_time)}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-slate-400" />
                <span className="font-semibold text-slate-700">
                  {formatAppointmentTime(appointment.appointment_time)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <span>{expanded ? 'Less Details' : 'View Details'}</span>
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="mt-5 pt-5 border-t border-slate-100 space-y-5 animate-in fade-in-50 duration-200">
          {isLoadingExtra ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Admission Status */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <Bed size={15} className="text-blue-600" />
                  <span>Admission Record</span>
                </div>
                {admission ? (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-100">
                      <p className="text-slate-400">Ward</p>
                      <p className="font-semibold text-slate-800">{admission.ward}</p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-100">
                      <p className="text-slate-400">Bed Number</p>
                      <p className="font-semibold text-slate-800">{admission.bed_number}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Not admitted to any hospital ward</p>
                )}
              </div>

              {/* Prescriptions */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <Pill size={15} className="text-emerald-600" />
                  <span>Prescriptions</span>
                </div>
                {prescriptions.length > 0 ? (
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {prescriptions.map((pres: any) => (
                      <div key={pres.id} className="p-2.5 bg-white rounded-lg border border-slate-100 space-y-1">
                        <p className="text-[11px] font-semibold text-emerald-700">Dr. {pres.doctor_name}</p>
                        <ul className="divide-y divide-slate-100">
                          {pres.items.map((item: any) => (
                            <li key={item.id} className="py-1 text-xs flex justify-between gap-2">
                              <span className="text-slate-800 font-medium truncate">{item.item_name} × {item.quantity}</span>
                              <span className="text-slate-500 text-[11px] italic shrink-0">{item.instructions}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No prescriptions recorded for this visit</p>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            {appointment.status === 'SCHEDULED' && !isPast && (
              <button
                onClick={() => cancelMutation.mutate(appointment.id)}
                disabled={cancelMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition disabled:opacity-50"
              >
                <XCircle size={14} />
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Appointment'}
              </button>
            )}

            {canReschedule && (
              <button
                onClick={() => setShowReschedule(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition"
              >
                <CalendarClock size={14} />
                Reschedule Visit
              </button>
            )}

            {appointment.status === 'CANCELLED' && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100">
                <AlertCircle size={14} />
                Cancelled
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