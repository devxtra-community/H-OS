import { api } from '@/src/lib/api';

export async function getPrescriptions() {
  const res = await api.get('/prescriptions/me');
  return res.data;
}
