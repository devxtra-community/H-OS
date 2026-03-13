import { useMutation } from '@tanstack/react-query';
import { createRoom } from '../api/beds.api';

export function useCreateRoom() {
  return useMutation({
    mutationFn: createRoom,
  });
}
