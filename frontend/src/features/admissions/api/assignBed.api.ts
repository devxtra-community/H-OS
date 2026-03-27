import { api } from '@/src/lib/api';
import { StepId } from 'framer-motion';

export async function assignBed(data: {
  bedId: string;
  patientId: string;
  admissionId: string;
}) {
  const res = await api.post('/staff/beds/assign', data);

  return res.data;
}
