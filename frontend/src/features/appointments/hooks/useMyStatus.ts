import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/lib/api';

type MyStatusResponse =
  | {
      status: 'SCHEDULED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED';
      position: number;
      patients_ahead: number;
      estimated_start_time?: string;
      estimated_end_time?: string;
      delay_minutes: number;
      doctor_delay_minutes: number;
      doctor_current_patient?: string;
    }
  | { message: string };

export function useMyStatus() {
  return useQuery<MyStatusResponse>({
    queryKey: ['my-status'],
    queryFn: async () => {
      const { data } = await api.get('/appointments/my-status');
      return data;
    },

    refetchInterval: (query) => {
      const data = query.state.data as MyStatusResponse | undefined;

      if (!data) return false;
      if ('message' in data) return false;
      if (data.status === 'COMPLETED') return false;

      return 5000;
    },

    refetchOnWindowFocus: true,
  });
}
