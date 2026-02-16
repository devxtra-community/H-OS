import { api } from '../../lib/api';

export async function loginStaff(email: string, password: string) {
  const res = await api.post('/staff/public/auth/login', {
    email,
    password,
  });

  return res.data;
}

export async function refreshStaff() {
  const res = await api.post('/staff/public/auth/refresh');
  return res.data as { accessToken: string };
}
