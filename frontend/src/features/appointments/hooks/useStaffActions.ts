import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  startAppointment,
  completeAppointment,
  checkInAppointment,
} from '../api/staffQueue.api';

export function useStartAppointment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: startAppointment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['doctor-queue'] });
    },
  });
}

export function useCompleteAppointment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: completeAppointment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['doctor-queue'] });
    },
  });
}

export function useCheckInAppointment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: checkInAppointment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['doctor-queue'] });
    },
  });
}
