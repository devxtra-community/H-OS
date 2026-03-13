import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dischargePatient } from '../api/dischargePatients.api';

export function useDischargePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dischargePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['discharge-requests'],
      });

      queryClient.invalidateQueries({
        queryKey: ['beds'],
      });
    },
  });
}
