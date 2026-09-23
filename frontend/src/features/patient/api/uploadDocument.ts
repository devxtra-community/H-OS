import { uploadFiles } from '@/src/lib/uploadthing';
import { api } from '@/src/lib/api';

export async function uploadPatientDocument(file: File) {
  const res = await uploadFiles('patientDocument', {
    files: [file],
  });

  if (!res || res.length === 0) {
    throw new Error('Upload failed: no response from server');
  }

  const uploaded = res[0];
  const fileUrl = (uploaded as any).ufsUrl || uploaded.url;
  const key = uploaded.key;

  // Save document in database via existing backend endpoint
  await api.post('/patients/documents', {
    file_url: fileUrl,
    file_key: key,
    file_name: file.name,
  });

  return {
    fileUrl,
    key,
  };
}
