import { api } from '@/src/lib/api';

export async function uploadPatientDocument(file: File) {
  // 1 get signed upload URL
  const { data } = await api.get('/patients/upload/upload-url', {
    params: {
      fileType: file.type,
      type: 'document',
    },
  });

  const { uploadUrl, fileUrl, key } = data;

  // 2 upload file to S3
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  // 3 save document in database
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
