import { api } from '@/src/lib/api';

export async function getDoctorQueue(doctorId: string, statuses?: string[]) {
  const params = statuses ? { statuses: statuses.join(',') } : {};
  const { data } = await api.get(`/appointments/doctor/today/${doctorId}`, {
    params,
  });
  return data;
}
