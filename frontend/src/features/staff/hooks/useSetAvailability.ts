import { useMutation } from '@tanstack/react-query';
import { setAvailability } from '../api/availability.api';

export function useSetAvailability() {
  return useMutation({
    mutationFn: setAvailability,
  });
}
