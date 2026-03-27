import { api } from '@/src/lib/api';

export async function getDischargeRequests() {
  const res = await api.get('/admissions/discharge-requests');

  return res.data;
}
