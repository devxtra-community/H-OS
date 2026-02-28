import { api } from '@/src/lib/api';

export async function getDoctorQueue(doctorId: string) {
  const { data } = await api.get(`/appointments/doctor/today/${doctorId}`);
  return data;
}
