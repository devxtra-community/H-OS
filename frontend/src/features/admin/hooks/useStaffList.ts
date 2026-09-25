import { useQuery } from '@tanstack/react-query';
import { getStaffList, StaffAccount } from '../api/staff.api';

export function useStaffList() {
  return useQuery<StaffAccount[]>({
    queryKey: ['staff'],
    queryFn: getStaffList,
  });
}
