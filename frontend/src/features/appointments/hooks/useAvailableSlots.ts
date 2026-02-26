import { useQuery } from '@tanstack/react-query';
import { getAvailableSlots } from '../api/appointments.api';
import { useAuth } from '@/src/auth/auth.provider';

export function useAvailableSlots(doctorId: string, date: string) {
  const { auth } = useAuth(); // ✅ INSIDE HOOK

  return useQuery({
    queryKey: ['available-slots', doctorId, date],
    queryFn: () => getAvailableSlots(doctorId, date),
    enabled:
      !!doctorId &&
      !!date &&
      !!auth.accessToken && // ✅ force boolean
      !auth.isRestoring,
  });
}
