import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api/getProfile';

export function usePatientProfile() {
  return useQuery({
    queryKey: ['patient-profile'],
    queryFn: getProfile,
  });
}
