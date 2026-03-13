import { useMutation } from '@tanstack/react-query';
import { requestAdmission } from '../api/requestAdmission.api';

export function useRequestAdmission() {
  return useMutation({
    mutationFn: requestAdmission,
  });
}
