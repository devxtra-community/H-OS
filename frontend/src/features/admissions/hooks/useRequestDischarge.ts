import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestDischarge } from '../api/requestDischarge.api';

export const useRequestDischarge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestDischarge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctorAdmissions'] });
    },
  });
};
