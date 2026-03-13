import { useQuery } from '@tanstack/react-query';
import { getDoctorAdmissions } from '../api/getDoctorAdmissions.api';

export const useDoctorAdmissions = () => {
  return useQuery({
    queryKey: ['doctor-admissions'],
    queryFn: getDoctorAdmissions,
  });
};
