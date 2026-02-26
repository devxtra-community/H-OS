import { useQuery } from '@tanstack/react-query';
import { getDoctorsByDepartment } from '../api/appointments.api';
import { Doctor } from '../types/doctor.types';
import { useAuth } from '@/src/auth/auth.provider';

export function useDoctors(departmentId: string) {
  const { auth } = useAuth();
  return useQuery<Doctor[]>({
    queryKey: ['doctors', departmentId],
    queryFn: () => getDoctorsByDepartment(departmentId),
    enabled: !!departmentId && !!auth.accessToken,
  });
}
