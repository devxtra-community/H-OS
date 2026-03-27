import { api } from '@/src/lib/api';

export async function getDoctorAdmissions() {
  const res = await api.get('/admissions/doctor');

  return res.data;
}
