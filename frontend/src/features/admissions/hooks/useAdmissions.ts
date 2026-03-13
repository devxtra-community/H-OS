import { useQuery } from '@tanstack/react-query';
import { getPendingAdmissions } from '../api/admissions.api';

export function useAdmissions() {
  return useQuery({
    queryKey: ['admissions'],
    queryFn: getPendingAdmissions,
  });
}
