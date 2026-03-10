import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api/getProfile';
import { useAuth } from '@/src/auth/auth.provider';

export function usePatientProfile() {
  const { auth } = useAuth();

  return useQuery({
    queryKey: ['patient-profile'],
    queryFn: getProfile,
    enabled: !!auth.patient, // 🔥 KEY FIX
    staleTime: 1000 * 60 * 5,
  });
}
