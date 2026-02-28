import { api } from '@/src/lib/api';

export async function setAvailability(payload: {
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
}) {
  const { data } = await api.post('/staff/availability', payload);

  return data;
}
