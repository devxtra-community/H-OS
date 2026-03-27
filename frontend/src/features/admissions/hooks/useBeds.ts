import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/lib/api';

export const useBeds = (roomId: string) => {
  return useQuery({
    queryKey: ['beds', roomId],
    enabled: !!roomId,
    queryFn: async () => {
      const res = await api.get(`/staff/beds/beds/${roomId}`);
      return res.data;
    },
  });
};
