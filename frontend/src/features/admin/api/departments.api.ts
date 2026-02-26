import { api } from '@/src/lib/api';

export type Department = {
  id: string;
  name: string;
};

export async function getDepartments(): Promise<Department[]> {
  const res = await api.get('/staff/departments');
  return res.data;
}
