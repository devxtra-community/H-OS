import { api } from '@/src/lib/api';

export async function adminLogin(email: string, password: string) {
  const res = await api.post('/staff/public/auth/admin/login', {
    email,
    password,
  });

  return res.data;
}

export async function refreshAdmin() {
  const res = await api.post('/staff/public/auth/admin/refresh');
  return res.data as { accessToken: string };
}
export async function logoutAdmin() {
  await api.post('/staff/public/auth/admin/logout');
}
