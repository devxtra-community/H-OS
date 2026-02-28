import { useMutation } from '@tanstack/react-query';
import { createStaff, CreateStaffInput } from '../api/createStaff.api';

export function useCreateStaff() {
  return useMutation({
    mutationFn: (data: CreateStaffInput) => createStaff(data),
  });
}
