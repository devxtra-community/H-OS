import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWard } from '../api/beds.api';

export function useCreateWard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
  });
}
