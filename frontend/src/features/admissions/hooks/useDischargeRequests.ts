import { useQuery } from '@tanstack/react-query';
import { getDischargeRequests } from '../api/getDischargeRequests.api';

export function useDischargeRequests() {
  return useQuery({
    queryKey: ['discharge-requests'],
    queryFn: getDischargeRequests,
  });
}
