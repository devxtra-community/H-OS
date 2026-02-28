import { useQuery } from '@tanstack/react-query';
import { getDepartments, Department } from '../api/departments.api';

export function useDepartments() {
  return useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });
}
