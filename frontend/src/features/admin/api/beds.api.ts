import { api } from '@/src/lib/api';

export async function createWard(data: { name: string; description?: string }) {
  const res = await api.post('/admin/beds/wards', data);
  return res.data;
}

export async function createRoom(data: { wardId: string; roomNumber: string }) {
  const res = await api.post('/admin/beds/rooms', data);
  return res.data;
}

export async function createBed(data: { roomId: string; bedNumber: string }) {
  const res = await api.post('/admin/beds/beds', data);
  return res.data;
}

export async function getBeds() {
  const res = await api.get('/staff/beds');
  return res.data;
}
export async function getWards() {
  const res = await api.get('/admin/beds/wards');
  return res.data;
}

export async function getRooms(wardId: string) {
  const res = await api.get(`/admin/beds/rooms/${wardId}`);
  return res.data;
}
