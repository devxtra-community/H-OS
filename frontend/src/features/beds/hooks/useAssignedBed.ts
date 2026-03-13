import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignBed } from '../api/beds.api';

export function useAssignBed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignBed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
  });
}
