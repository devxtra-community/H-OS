import { api } from '@/src/lib/api';

export async function requestAdmission(data: {
  patientId: string;
  doctorId: string;
  departmentId: string;
}) {
  const res = await api.post('/admissions/request', data);

  return res.data;
}
