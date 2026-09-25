import { api } from '@/src/lib/api';

export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  role: 'DOCTOR' | 'NURSE' | 'ADMIN' | 'RECEPTIONIST' | string;
  job_title: string;
  department_id?: string;
  department_name?: string;
  is_active: boolean;
  created_at: string;
}

export async function getStaffList(): Promise<StaffAccount[]> {
  const res = await api.get('/staff');
  return res.data;
}
