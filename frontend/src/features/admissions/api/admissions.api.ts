import { api } from '@/src/lib/api';

export async function getPendingAdmissions() {
  const res = await api.get('/admissions/pending');
  return res.data;
}

export async function requestAdmission(data: any) {
  const res = await api.post('/admissions', data);
  return res.data;
}
