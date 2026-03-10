import { api } from '@/src/lib/api';

export async function getProfile() {
  const res = await api.get('/patients/me');
  return res.data ?? null;
}
