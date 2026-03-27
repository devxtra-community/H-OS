import { api } from '@/src/lib/api';

export async function getCurrentAdmission() {
  const res = await api.get('/admissions/current');
  return res.data;
}
