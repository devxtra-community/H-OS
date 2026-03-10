import { api } from '@/src/lib/api';

export async function updateProfile(data: any) {
  const res = await api.patch('/patients/me', data);
  return res.data;
}
