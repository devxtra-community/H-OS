import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPrescription, dispensePrescription } from '../api/pharmacy.api';

export function useCreatePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPrescription,
    onSuccess: () => {
      // We don't necessarily need to invalidate here since Doctors don't see the Pharmacy list, but good practice
      queryClient.invalidateQueries({ queryKey: ['pendingPrescriptions'] });
    },
  });
}

export function useDispensePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dispensePrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingPrescriptions'] });
      // Dispensing uses inventory stock, so we invalidate inventory too
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
