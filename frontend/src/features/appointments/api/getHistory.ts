import { api } from '@/src/lib/api';

export async function getAppointmentHistory() {
  const { data } = await api.get('/appointments/history');
  return data;
}
