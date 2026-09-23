import { uploadFiles } from '@/src/lib/uploadthing';
import { api } from '@/src/lib/api';

export async function uploadProfileImage(file: File) {
  const res = await uploadFiles('profileImage', {
    files: [file],
  });

  if (!res || res.length === 0) {
    throw new Error('Upload failed: no response from server');
  }

  const uploaded = res[0];
  const fileUrl = (uploaded as any).ufsUrl || uploaded.url;

  // Save url in database via existing backend endpoint
  await api.put('/patients/profile-image', {
    profile_image: fileUrl,
  });

  return fileUrl;
}
