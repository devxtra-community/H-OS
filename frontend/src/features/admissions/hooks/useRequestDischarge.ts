import { useMutation } from '@tanstack/react-query';
import { requestDischarge } from '../api/requestDischarge.api';

export const useRequestDischarge = () => {
  return useMutation({
    mutationFn: requestDischarge,
  });
};
