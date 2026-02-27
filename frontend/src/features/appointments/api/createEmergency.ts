import { api } from '@/src/lib/api';

export async function createEmergency(data: {
  doctorId: string;
  patientId: string;
}) {
  const res = await api.post('/appointments/emergency', data);
  return res.data;
}
