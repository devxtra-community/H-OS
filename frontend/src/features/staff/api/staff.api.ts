import { api } from '@/src/lib/api';

export async function getDepartments() {
  const { data } = await api.get('/staff/departments');
  return data;
}

export async function getDoctorsByDepartment(departmentId: string) {
  const { data } = await api.get(
    `/staff/doctors?department_id=${departmentId}`
  );
  return data;
}
