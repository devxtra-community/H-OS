import { useQuery } from '@tanstack/react-query';
import { getPendingPrescriptions } from '../api/pharmacy.api';

export function usePendingPrescriptions() {
  return useQuery({
    queryKey: ['pendingPrescriptions'],
    queryFn: getPendingPrescriptions,
  });
}
