import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRoom } from '../api/beds.api';

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
  });
}
