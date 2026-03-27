import { useQuery } from '@tanstack/react-query';
import { getDepartments, getDoctorsByDepartment } from '../api/staff.api';

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useDoctorsByDepartment(departmentId: string) {
  return useQuery({
    queryKey: ['doctors', departmentId],
    queryFn: () => getDoctorsByDepartment(departmentId),
    enabled: !!departmentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
