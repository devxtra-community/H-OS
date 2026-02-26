import { useQuery } from '@tanstack/react-query';
import { getAppointmentHistory } from '../api/getHistory';
import { useAuth } from '@/src/auth/auth.provider';

export function useAppointmentHistory() {
  const { auth } = useAuth();

  console.log('useappointment history running');
  return useQuery({
    queryKey: ['history'],
    queryFn: getAppointmentHistory,
    enabled: !!auth.accessToken && !auth.isRestoring,
    retry: false,
  });
}
