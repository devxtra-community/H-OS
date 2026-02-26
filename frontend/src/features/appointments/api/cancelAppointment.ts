import { api } from '@/src/lib/api';

export async function cancelAppointment(id: string) {
  const { data } = await api.post(`/appointments/cancel/${id}`);

  return data;
}
