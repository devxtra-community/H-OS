import { api } from '@/src/lib/api';

export async function getPatientDocuments() {
  const { data } = await api.get('/patients/documents');

  return data;
}
