import { useQuery } from '@tanstack/react-query';
import { getBeds } from '../api/beds.api';

export function useBeds() {
  return useQuery({
    queryKey: ['beds'],
    queryFn: getBeds,
  });
}
