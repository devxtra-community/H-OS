import { useMutation } from '@tanstack/react-query';
import { createBed } from '../api/beds.api';

export function useCreateBed() {
  return useMutation({
    mutationFn: createBed,
  });
}
