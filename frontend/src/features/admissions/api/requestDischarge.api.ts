import { api } from '@/src/lib/api';

export async function requestDischarge(admissionId: string) {
  const res = await api.post(`/admissions/${admissionId}/request-discharge`);

  return res.data;
}
