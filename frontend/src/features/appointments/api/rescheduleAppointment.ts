import { api } from '@/src/lib/api';

export async function rescheduleAppointment(
  appointmentId: string,
  newTime: string
) {
  const { data } = await api.post(`/appointments/reschedule/${appointmentId}`, {
    newTime,
  });

  return data;
}
