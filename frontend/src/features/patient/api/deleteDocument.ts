import { api } from '@/src/lib/api';

export async function deletePatientDocument(key: string) {
  await api.delete('/patients/documents', {
    data: {
      file_key: key,
    },
  });
}
