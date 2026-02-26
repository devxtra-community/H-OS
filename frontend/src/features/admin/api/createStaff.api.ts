import { api } from '@/src/lib/api';

export type CreateStaffInput = {
  name: string;
  email: string;
  password: string;
  department_id: string;
  role: 'DOCTOR' | 'NURSE';
  job_title: string;
};

export async function createStaff(data: CreateStaffInput) {
  const res = await api.post('/staff', data);
  return res.data;
}
