import { api } from '@/src/lib/api';

export async function getBeds() {
  const res = await api.get('/staff/beds');
  return res.data;
}

export async function assignBed(data: { bedId: string; patientId: string }) {
  const res = await api.post('/staff/beds/assign', data);
  return res.data;
}

export async function dischargeBed(bedId: string) {
  const res = await api.post('/staff/beds/discharge', { bedId });
  return res.data;
}
