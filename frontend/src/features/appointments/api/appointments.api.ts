import { api } from '@/src/lib/api';
import { Doctor } from '../types/doctor.types';

export async function getAvailableSlots(
  doctorId: string,
  date: string
): Promise<string[]> {
  const { data } = await api.get('/appointments/available-slots', {
    params: { doctorId, date },
  });

  return data;
}

export async function bookAppointment(payload: {
  doctorId: string;
  appointmentTime: string;
  appointmentDate: string;
  durationMinutes?: number;
}) {
  const { data } = await api.post('/appointments', payload);
  return data;
}

export async function getDoctorsByDepartment(
  departmentId: string
): Promise<Doctor[]> {
  const res = await api.get('/staff/doctors', {
    params: { department_id: departmentId },
  });

  return res.data;
}
