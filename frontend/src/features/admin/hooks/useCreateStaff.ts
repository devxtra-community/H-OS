import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStaff, CreateStaffInput } from '../api/createStaff.api';

export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStaffInput) => createStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}
