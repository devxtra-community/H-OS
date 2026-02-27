import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEmergency } from '../api/createEmergency';

export function useEmergency(doctorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patientId: string) => createEmergency({ doctorId, patientId }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['doctorQueue', doctorId],
      });
    },
  });
}
