'use client';

import AppointmentCard from './AppointmentCard';

interface Props {
  appointments: any[];
}

export default function AppointmentList({ appointments }: Props) {
  if (!appointments.length) {
    return <p>No appointments found.</p>;
  }

  return (
    <div className="space-y-4">
      {appointments.map((appt) => (
        <AppointmentCard
          key={appt.id}
          appointment={appt}
        />
      ))}
    </div>
  );
}