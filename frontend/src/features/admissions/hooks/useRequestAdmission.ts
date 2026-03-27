import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestAdmission } from '../api/requestAdmission.api';

export function useRequestAdmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestAdmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctorQueue'] });
    },
  });
}
