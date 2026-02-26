import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/lib/api';

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await api.get('/staff/departments');
      return res.data;
    },
  });
}
