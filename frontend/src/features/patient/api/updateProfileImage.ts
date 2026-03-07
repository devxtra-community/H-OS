import { api } from '@/src/lib/api';

export async function uploadProfileImage(file: File) {
  // 1 get signed upload url
  const { data } = await api.get('/patients/upload/upload-url');

  const { uploadUrl, fileUrl } = data;

  // 2 upload to s3
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  // 3 save url in database
  await api.put('/patients/profile-image', {
    profile_image: fileUrl,
  });

  return fileUrl;
}
