import { api } from '@/src/lib/api';

export async function startAppointment(id: string) {
  const { data } = await api.post(`/appointments/start/${id}`);
  return data;
}

export async function completeAppointment(id: string) {
  const { data } = await api.post(`/appointments/complete/${id}`);
  return data;
}

export async function checkInAppointment(id: string) {
  const { data } = await api.post(`/appointments/check-in/${id}`);
  return data;
}
