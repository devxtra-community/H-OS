import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelAppointment } from '../api/cancelAppointment';

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess: (data) => {
      // Assuming backend returns doctor_id + appointment_time
      const doctorId = data.doctor_id;
      const date = data.appointment_time.split('T')[0];

      queryClient.invalidateQueries({
        queryKey: ['available-slots', doctorId, date],
      });

      queryClient.invalidateQueries({
        queryKey: ['history'],
      });
    },
  });
}
