import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignBed } from '../api/assignBed.api';

export const useAssignBed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignBed,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admissions'],
      });
    },
  });
};
