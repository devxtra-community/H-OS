import { useQuery } from '@tanstack/react-query';
import { getDoctorQueue } from '../api/getDoctorQueue';

export function useDoctorQueue(doctorId?: string) {
  return useQuery({
    queryKey: ['doctor-queue', doctorId],
    queryFn: async () => {
      // This will only run if doctorId exists
      return getDoctorQueue(doctorId as string);
    },
    enabled: !!doctorId, // Prevent query from running if undefined
    refetchInterval: 10000, // Auto refresh every 10 seconds
  });
}
