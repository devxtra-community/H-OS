import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rescheduleAppointment } from '../api/rescheduleAppointment';

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      newTime,
    }: {
      appointmentId: string;
      newTime: string;
    }) => rescheduleAppointment(appointmentId, newTime),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
      queryClient.invalidateQueries({ queryKey: ['my-status'] });
    },
  });
}
