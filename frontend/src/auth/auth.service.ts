import { api } from '../lib/api';
import { LoginResponseSchema } from './auth.types';

export async function loginPatient(email: string, password: string) {
  const res = await api.post('/patients/public/auth/login', {
    email,
    password,
  });

  console.log('LOGIN RESPONSE DATA:', res.data);

  // ⛔ TEMP: do NOT parse, just return raw data
  return res.data;
}

export async function registerPatient(data: {
  email: string;
  password: string;
  name: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
}) {
  try {
    const res = await api.post('/patients/public/auth/register', data);
    return res.data;
  } catch (err: any) {
    console.error('REGISTER ERROR RESPONSE:', err.response?.data);
    throw err;
  }
}

export async function refreshPatient() {
  const res = await api.post('/patients/public/auth/refresh');
  return res.data as { accessToken: string };
}
