import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../api/updateProfile';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['patient-profile'],
      });
    },
  });
}
