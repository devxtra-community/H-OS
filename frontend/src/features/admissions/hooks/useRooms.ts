import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/lib/api';

export const useRooms = (wardId: string) => {
  return useQuery({
    queryKey: ['rooms', wardId],
    enabled: !!wardId,
    queryFn: async () => {
      const res = await api.get(`/staff/beds/rooms/${wardId}`);
      return res.data;
    },
  });
};
