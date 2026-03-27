import { api } from '@/src/lib/api';

export async function dischargePatient(data: {
  bedId: string;
  admissionId: string;
}) {
  const res = await api.post('/staff/beds/discharge', data);
  return res.data;
}
