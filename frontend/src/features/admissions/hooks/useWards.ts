import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/lib/api';

export const useWards = () => {
  return useQuery({
    queryKey: ['wards'],
    queryFn: async () => {
      const res = await api.get('/staff/beds/wards');
      return res.data;
    },
  });
};
