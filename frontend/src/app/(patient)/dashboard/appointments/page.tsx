'use client';

import { useAppointmentHistory } from '../../../../features/appointments/hooks/useAppointmentHistory';
import AppointmentList from '../../../../features/appointments/components/AppointmentList';
import { useCancelAppointment } from '@/src/features/appointments/hooks/useCancelAppointment';

export default function AppointmentsPage() {
  const { data, isLoading } = useAppointmentHistory();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        My Appointments
      </h1>

      <AppointmentList appointments={data || []} />
    </div>
  );
}