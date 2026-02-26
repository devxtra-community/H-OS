import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookAppointment } from '../api/appointments.api';

export function useBookAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookAppointment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['available-slots', variables.doctorId],
      });
    },
  });
}
